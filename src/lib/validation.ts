import { BLOCKED_EXTENSIONS, BRANCHES, DOMAINS, MAX_FILE_MB } from "./config";

export type Fields = {
  name: string;
  regNo: string;
  email: string;
  branch: string;
  title: string;
  domains: string[];
  collaborators: string;
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

/** Shared by the browser form and the API route. */
export function validateFields(f: Fields): FieldErrors {
  const errors: FieldErrors = {};
  if (f.name.length < 2) errors.name = "Enter your full name.";
  else if (!/^[\p{L}][\p{L}\s.'\-]*$/u.test(f.name)) errors.name = "Use letters only in your name.";
  if (!/^[A-Z0-9][A-Z0-9\-\/_.]{2,23}$/.test(f.regNo)) errors.regNo = "Enter a valid registration number (3–24 letters or digits).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) errors.email = "Enter a valid e-mail address.";
  if (!(BRANCHES as readonly string[]).includes(f.branch)) errors.branch = "Choose your branch.";
  if (f.title.length < 4) errors.title = "Give your idea a short title.";
  if (!f.consent) errors.consent = "Please confirm to continue.";
  return errors;
}

export function validateFile(file: { name: string; size: number } | null): string | undefined {
  if (!file || file.size === 0) return "Attach your abstract.";
  if (file.size > MAX_FILE_MB * 1024 * 1024) return `File is too large. Maximum is ${MAX_FILE_MB} MB.`;
  if (BLOCKED_EXTENSIONS.includes(extFor(file.name))) return "This file type is not allowed for security reasons.";
  return undefined;
}

export function normalise(raw: {
  name?: unknown;
  regNo?: unknown;
  email?: unknown;
  branch?: unknown;
  title?: unknown;
  domains?: unknown;
  collaborators?: unknown;
  consent?: unknown;
}): Fields {
  const domains = Array.isArray(raw.domains)
    ? (raw.domains as unknown[]).map((d) => clean(d, 60))
    : clean(raw.domains, 400).split("|").map((d) => d.trim());
  return {
    name: clean(raw.name, 80),
    regNo: clean(raw.regNo, 24).toUpperCase(),
    email: clean(raw.email, 120).toLowerCase(),
    branch: clean(raw.branch, 80),
    title: clean(raw.title, 150),
    domains: domains.filter((d) => (DOMAINS as readonly string[]).includes(d)).slice(0, 6),
    collaborators: clean(raw.collaborators, 200),
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
    domains: fd.get("domains"),
    collaborators: fd.get("collaborators"),
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
