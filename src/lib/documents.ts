import { z } from "zod";

export const DOCUMENT_TYPES = ["agreement", "receipt", "photo", "other"] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const VISIBILITIES = ["shared", "landlord_only"] as const;

export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "application/pdf"] as const;

export const FILTERS = ["all", "agreement", "receipt", "photo"] as const;
export type DocumentFilter = (typeof FILTERS)[number];

export const documentSchema = z
  .object({
    room_id: z.string().uuid(),
    file_path: z.string().min(1),
    file_name: z.string().trim().min(1).max(200),
    file_size: z
      .number()
      .int()
      .min(1, "That file is empty.")
      .max(MAX_FILE_BYTES, "That file is too big. The limit is 5 MB."),
    mime_type: z
      .string()
      .refine(
        (value) => (ALLOWED_MIME as readonly string[]).includes(value),
        "Only photos (JPG, PNG, WebP) and PDF files are allowed.",
      ),
    type: z.enum(DOCUMENT_TYPES),
    visibility: z.enum(VISIBILITIES),
  })
  .refine((doc) => doc.file_path.startsWith(`${doc.room_id}/`), {
    message: "The file is not stored in this room's folder.",
    path: ["file_path"],
  });

export type DocumentInput = z.infer<typeof documentSchema>;

export function isDocumentFilter(value: unknown): value is DocumentFilter {
  return typeof value === "string" && (FILTERS as readonly string[]).includes(value);
}

export function filterDocuments<T extends { type: string }>(docs: T[], filter: DocumentFilter): T[] {
  return filter === "all" ? docs : docs.filter((doc) => doc.type === filter);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function safeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .slice(-80);
}

export function fileKind(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "JPG";
    case "image/png":
      return "PNG";
    case "image/webp":
      return "WEBP";
    case "application/pdf":
      return "PDF";
    default:
      return "FILE";
  }
}

const TYPE_LABELS: Record<DocumentType, string> = {
  agreement: "Agreement",
  receipt: "Receipt",
  photo: "Photo",
  other: "Other",
};

export function documentTypeLabel(type: DocumentType): string {
  return TYPE_LABELS[type];
}
