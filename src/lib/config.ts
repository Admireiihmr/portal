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
] as const;

// Vercel's serverless functions accept ~4.5 MB per request, so default to 4 MB there and 25 MB elsewhere.
const DEFAULT_MAX_MB = process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL ? 4 : 25;
export const MAX_FILE_MB = Number(process.env.NEXT_PUBLIC_MAX_FILE_MB ?? DEFAULT_MAX_MB) || DEFAULT_MAX_MB;
// A short block-list of directly executable types. Everything else is accepted.
// Prototypes must be PDF or Word (.docx); nothing else is accepted.
export const ALLOWED_EXTENSIONS = ["pdf", "docx"];
export const ACCEPT_ATTR = ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const SUBMISSIONS_OPEN = (process.env.NEXT_PUBLIC_SUBMISSIONS_OPEN ?? "true") !== "false";
export const DEADLINE_TEXT = process.env.NEXT_PUBLIC_DEADLINE_TEXT ?? "To be announced";
