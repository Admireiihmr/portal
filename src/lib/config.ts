export const EVENT = {
  name: "Foundation Day Idea Presentation",
  short: "FD26",
  institute: "IIHMR Bangalore",
  centre: "ADMIRE – Center for Advancing Digital Health",
};

export const BRANCHES = [
  "PGDM – Hospital & Health Management",
  "PGDM – Artificial Intelligence & Data Science",
  "PGDM – Pharmaceutical Management",
  "Other",
] as const;

export const DOMAINS = [
  "AI in healthcare",
  "Digital health",
  "Hospital operations",
  "Pharma & life sciences",
  "Public health",
  "Health IT",
  "Medical devices",
  "Health policy & finance",
  "Patient experience",
  "Something else",
] as const;

export const MAX_FILE_MB = Number(process.env.NEXT_PUBLIC_MAX_FILE_MB ?? 25) || 25;
// A short block-list of directly executable types. Everything else is accepted.
export const BLOCKED_EXTENSIONS = ["exe", "msi", "bat", "cmd", "com", "scr", "vbs", "ps1", "dll", "jar", "apk"];

export const SUBMISSIONS_OPEN = (process.env.NEXT_PUBLIC_SUBMISSIONS_OPEN ?? "true") !== "false";
export const DEADLINE_TEXT = process.env.NEXT_PUBLIC_DEADLINE_TEXT ?? "To be announced";
