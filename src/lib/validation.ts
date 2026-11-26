import { ALLOWED_EXTENSIONS, BRANCHES, IMAGE_EXTENSIONS, MAX_FILE_MB } from "./config";

export type Fields = {
  name: string;
  regNo: string;
  email: string;
  branch: string;
  title: string;
  description: string;
  collaborators: string;
  link: string;
  consent: boolean;
};
export type FieldErrors = Partial<Record<keyof Fields | "file", string>>;

export const clean = (v: unknown, max: number) =>
  (typeof v === "string" ? v : "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

export function extFor(filename: string) {
  const i = filename.lastIndexOf(".");
  return i > -1 ? filename.slice(i + 1).toLowerCase() : "";
}

export const MAX_LINK_LENGTH = 500;
export const MAX_DESCRIPTION_WORDS = 500;
// A safety cap as well, so one enormous "word" cannot get through the word limit
export const MAX_DESCRIPTION_LENGTH = 6000;

export const countWords = (s: string) => s.split(/\s+/).filter(Boolean).length;

/** Like clean(), but keeps line breaks so paragraphs survive. */
export const cleanMultiline = (v: unknown, max: number) =>
  (typeof v === "string" ? v : "")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);

/** A full web address: http or https only, with a real-looking host name and no spaces. */
export function isWebLink(s: string) {
  if (/\s/.test(s) || !/^https?:\/\//i.test(s)) return false;
  try {
    return new URL(s).hostname.includes(".");
  } catch {
    return false;
  }
}

/** Shared by the browser form and the API route. */
export function validateFields(f: Fields): FieldErrors {
  const errors: FieldErrors = {};
  if (f.name.length < 2) errors.name = "Enter your full name.";
  else if (!/^[\p{L}][\p{L}\s.'\-]*$/u.test(f.name)) errors.name = "Use letters only in your name.";
  if (!/^[A-Z0-9][A-Z0-9\-\/_.]{2,23}$/.test(f.regNo)) errors.regNo = "Enter a valid registration number (3–24 letters or digits).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) errors.email = "Enter a valid e-mail address.";
  if (!(BRANCHES as readonly string[]).includes(f.branch)) errors.branch = "Choose your branch.";
  if (f.title.length < 4) errors.title = "Give your idea a short title.";
  if (!f.description) errors.description = "Describe your idea.";
  else if (countWords(f.description) > MAX_DESCRIPTION_WORDS) errors.description = `Keep your description to ${MAX_DESCRIPTION_WORDS} words or fewer.`;
  else if (f.description.length > MAX_DESCRIPTION_LENGTH) errors.description = `Your description is too long. Maximum is ${MAX_DESCRIPTION_LENGTH} characters.`;
  // the link is optional, but must be valid when given
  if (f.link.length > MAX_LINK_LENGTH) errors.link = `This link is too long. Maximum is ${MAX_LINK_LENGTH} characters.`;
  else if (f.link && !isWebLink(f.link)) errors.link = "Enter a full link that starts with https:// or http://";
  if (!f.consent) errors.consent = "Please confirm to continue.";
  return errors;
}

export function validateFile(file: { name: string; size: number } | null): string | undefined {
  if (!file || file.size === 0) return "Attach your prototype.";
  if (file.size > MAX_FILE_MB * 1024 * 1024) return `File is too large. Maximum is ${MAX_FILE_MB} MB.`;
  if (!ALLOWED_EXTENSIONS.includes(extFor(file.name))) return "Only PDF, Word (.docx) or image files are accepted.";
  return undefined;
}

/** Server-side check that the bytes match the extension: PDF, DOCX (a zip archive) or an image. */
export function looksLikeAllowedFile(name: string, bytes: Uint8Array): boolean {
  const ext = extFor(name);
  const head = String.fromCharCode(...bytes.subarray(0, 5));
  if (ext === "pdf") return head.startsWith("%PDF-");
  if (ext === "docx") return bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04;
  if (IMAGE_EXTENSIONS.includes(ext)) return looksLikeImage(ext, bytes);
  return false;
}

function looksLikeImage(ext: string, bytes: Uint8Array): boolean {
  const text = (from: number, to: number) => String.fromCharCode(...bytes.subarray(from, to));
  const starts = (...sig: number[]) => sig.every((b, i) => bytes[i] === b);
  // SVG is text: it may begin with an XML declaration or comments before the <svg> tag
  if (ext === "svg") return /<svg[\s>/]/i.test(new TextDecoder().decode(bytes.subarray(0, 4096)));
  // Phones and apps often save images under the wrong image extension, so any known image signature is accepted
  return (
    starts(0xff, 0xd8, 0xff) || // JPEG
    starts(0x89, 0x50, 0x4e, 0x47) || // PNG
    text(0, 4) === "GIF8" ||
    (text(0, 4) === "RIFF" && text(8, 12) === "WEBP") ||
    text(0, 2) === "BM" ||
    starts(0x49, 0x49, 0x2a, 0x00) || // TIFF, little-endian
    starts(0x4d, 0x4d, 0x00, 0x2a) || // TIFF, big-endian
    (text(4, 8) === "ftyp" && /^(heic|heix|hevc|hevx|heim|heis|mif1|msf1|avif|avis)$/.test(text(8, 12))) || // HEIC, HEIF, AVIF
    starts(0x00, 0x00, 0x01, 0x00) // ICO
  );
}

export function normalise(raw: {
  name?: unknown;
  regNo?: unknown;
  email?: unknown;
  branch?: unknown;
  title?: unknown;
  description?: unknown;
  collaborators?: unknown;
  link?: unknown;
  consent?: unknown;
}): Fields {
  return {
    name: clean(raw.name, 80),
    regNo: clean(raw.regNo, 24).toUpperCase(),
    email: clean(raw.email, 120).toLowerCase(),
    branch: clean(raw.branch, 80),
    title: clean(raw.title, 150),
    description: cleanMultiline(raw.description, MAX_DESCRIPTION_LENGTH + 1),
    collaborators: clean(raw.collaborators, 200),
    // one extra character is kept so an over-long link is rejected instead of being silently cut
    link: clean(raw.link, MAX_LINK_LENGTH + 1),
    consent: raw.consent === true || raw.consent === "on" || raw.consent === "true",
  };
}

export function parseAndValidate(fd: FormData): { fields: Fields; file: File | null; errors: FieldErrors } {
  const fields = normalise({
    name: fd.get("name"),
    regNo: fd.get("regNo"),
    email: fd.get("email"),
    branch: fd.get("branch"),
    title: fd.get("title"),
    description: fd.get("description"),
    collaborators: fd.get("collaborators"),
    link: fd.get("link"),
    consent: fd.get("consent"),
  });
  const f = fd.get("file");
  const file = f instanceof File && f.size > 0 ? f : null;
  const errors = validateFields(fields);
  const fe = validateFile(file);
  if (fe) errors.file = fe;
  return { fields, file, errors };
}

/** Folder-safe name: letters, digits, space, dash, underscore, dot. */
export function safeSegment(s: string, max = 80) {
  const out = s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 ._-]+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[.\s]+|[.\s]+$/g, "")
    .slice(0, max);
  return out || "student";
}
