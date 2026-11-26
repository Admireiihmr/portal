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
// Prototypes must be PDF, Word (.docx) or an image; nothing else is accepted.
export const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "tif", "tiff", "svg", "heic", "heif", "avif", "ico"];
export const ALLOWED_EXTENSIONS = ["pdf", "docx", ...IMAGE_EXTENSIONS];
export const ACCEPT_ATTR = [
  ...ALLOWED_EXTENSIONS.map((e) => `.${e}`),
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
].join(",");

export const SUBMISSIONS_OPEN = (process.env.NEXT_PUBLIC_SUBMISSIONS_OPEN ?? "true") !== "false";
// Set here on purpose (no environment variable), so an old hosting setting cannot override the date.
export const DEADLINE_TEXT = "9 December 2026";
