import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { EVENT } from "./config";
import { extFor, safeSegment, type Fields } from "./validation";

export type Submission = {
  ref: string;
  folder: string; // one folder per student, e.g. "2401234_Asha Rao"
  stamp: string; // e.g. 20261119-1530
  fields: Fields;
  fileName: string; // stored name, timestamp prefixed
  fileType: string;
  fileSize: number;
  fileBytes: Buffer;
};

/** "drive" = Google Drive through the Apps Script web app; "local" = this computer's disk (development). */
export type Mode = "drive" | "local";

export function storageMode(): Mode | null {
  const e = process.env;
  if (e.GOOGLE_SCRIPT_URL && e.GOOGLE_SCRIPT_SECRET) return "drive";
  if (e.ALLOW_LOCAL_STORAGE === "true" || process.env.NODE_ENV !== "production") return "local";
  return null;
}

export function makeNames(fields: Fields, originalName: string, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .formatToParts(now)
    .reduce<Record<string, string>>((a, p) => ((a[p.type] = p.value), a), {});
  const stamp = `${parts.year}${parts.month}${parts.day}-${parts.hour}${parts.minute}`;
  const folder = safeSegment(`${fields.regNo}_${fields.name}`);
  const ext = extFor(originalName).replace(/[^a-z0-9]/g, "").slice(0, 10);
  const base = safeSegment(originalName.replace(/\.[^.]+$/, ""), 60);
  const fileName = `${stamp}_${base}${ext ? "." + ext : ""}`;
  return { stamp, folder, fileName };
}

export function detailsText(s: Submission) {
  const f = s.fields;
  return [
    `${EVENT.name} - abstract submission`,
    `Reference:        ${s.ref}`,
    `Submitted (IST):  ${s.stamp}`,
    ``,
    `Name:             ${f.name}`,
    `Registration no.: ${f.regNo}`,
    `E-mail:           ${f.email}`,
    `Branch:           ${f.branch}`,
    `Idea title:       ${f.title}`,
    `Contributors:     ${f.collaborators || "-"} (acknowledgement only; the student above is the sole presenter)`,
    ``,
    `Abstract file:    ${s.fileName} (${(s.fileSize / 1024).toFixed(1)} KB, ${s.fileType || "unknown type"})`,
    ``,
  ].join("\r\n");
}

export async function saveSubmission(mode: Mode, s: Submission) {
  if (mode === "drive") return saveToDrive(s);
  return saveLocal(s);
}

/* ───────────── local disk (development) ───────────── */
async function saveLocal(s: Submission) {
  const dir = path.join(process.cwd(), "submissions", s.folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, s.fileName), s.fileBytes);
  await writeFile(path.join(dir, `${s.stamp}_details.txt`), detailsText(s), "utf8");
  await writeFile(
    path.join(dir, `${s.stamp}_details.json`),
    JSON.stringify({ ref: s.ref, ...s.fields, file: s.fileName }, null, 2),
    "utf8",
  );
}

/* ───────────── Google Drive via the Apps Script web app ───────────── */
// The script (google-apps-script/Code.gs) runs as the Drive owner, so no Google Cloud project or admin consent is needed.
// It creates the student's folder inside the shared folder if it is missing, then saves the abstract and a details file.
async function saveToDrive(s: Submission) {
  const res = await fetch(process.env.GOOGLE_SCRIPT_URL!, {
    method: "POST",
    // text/plain keeps this a "simple" request; Apps Script parses the JSON itself
    headers: { "content-type": "text/plain;charset=utf-8" },
    redirect: "follow", // Apps Script answers through a redirect
    body: JSON.stringify({
      secret: process.env.GOOGLE_SCRIPT_SECRET,
      ref: s.ref,
      folder: s.folder,
      stamp: s.stamp,
      detailsText: detailsText(s),
      file: { name: s.fileName, contentType: s.fileType || "application/octet-stream", contentBase64: s.fileBytes.toString("base64") },
    }),
  });
  const text = await res.text();
  let body: { ok?: boolean; error?: string } = {};
  try {
    body = JSON.parse(text);
  } catch {
    // An HTML page here usually means the web app is not deployed for "Anyone", or the URL is wrong.
    throw new Error(`Apps Script did not return JSON (HTTP ${res.status}). Check the deployment settings. Start of reply: ${text.slice(0, 120)}`);
  }
  if (!res.ok || !body.ok) throw new Error(`Apps Script error: ${body.error ?? res.status}`);
}
