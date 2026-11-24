import { randomBytes } from "node:crypto";
import { after } from "next/server";
import { MAX_FILE_MB } from "@/lib/config";
import { allow } from "@/lib/ratelimit";
import { makeNames, saveSubmission, storageMode } from "@/lib/storage";
import { parseAndValidate } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "cache-control": "no-store" } });

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  // Campus Wi-Fi puts many students behind one public IP, so the per-IP limit is generous;
  // the per-student limit below is the tighter one.
  if (!allow(`ip:${ip}`, 60)) {
    return json({ ok: false, message: "Too many attempts. Please wait a few minutes and try again." }, 429);
  }

  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > (MAX_FILE_MB + 2) * 1024 * 1024) {
    return json({ ok: false, message: `File is too large. Maximum is ${MAX_FILE_MB} MB.` }, 413);
  }

  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return json({ ok: false, message: "We could not read your submission. Please try again." }, 400);
  }

  // Honeypot: bots fill the hidden "website" field. Pretend success, store nothing.
  const trap = fd.get("website");
  if (typeof trap === "string" && trap.length > 0) return json({ ok: true, ref: "FD26-000000" });

  const { fields, file, errors } = parseAndValidate(fd);
  if (Object.keys(errors).length || !file) {
    return json({ ok: false, message: "Please fix the highlighted fields.", errors }, 422);
  }

  if (!allow(`reg:${fields.regNo}`, 6)) {
    return json({ ok: false, message: "Too many submissions for this registration number. Please wait a few minutes." }, 429);
  }

  const mode = storageMode();
  if (!mode) {
    return json({ ok: false, message: "Submissions are not available right now. Please contact the organisers." }, 503);
  }

  const ref = "FD26-" + randomBytes(4).toString("hex").slice(0, 6).toUpperCase();
  const { stamp, folder, fileName } = makeNames(fields, file.name);
  const submission = {
    ref,
    folder,
    stamp,
    fields,
    fileName,
    fileType: file.type,
    fileSize: file.size,
    fileBytes: Buffer.from(await file.arrayBuffer()),
  };

  if (mode === "local") {
    try {
      await saveSubmission(mode, submission);
    } catch (err) {
      console.error("[submit] storage failed:", err instanceof Error ? err.message : err);
      return json({ ok: false, message: "We could not save your abstract. Please try again in a moment." }, 502);
    }
    return json({ ok: true, ref });
  }

  // Google Drive (through Apps Script) takes several seconds per save. The details and file are already
  // validated and held in memory, so reply to the student now and finish the upload after the response,
  // retrying a few times. A final failure is logged with the reference so the organisers can follow up.
  after(async () => {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await saveSubmission(mode, submission);
        return;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (attempt === 3) {
          console.error(`[submit] DRIVE SAVE FAILED ref=${ref} folder=${folder} email=${fields.email}: ${msg}`);
        } else {
          console.warn(`[submit] drive save attempt ${attempt} failed for ${ref}: ${msg}`);
          await new Promise((r) => setTimeout(r, attempt * 2000));
        }
      }
    }
  });
  return json({ ok: true, ref });
}
