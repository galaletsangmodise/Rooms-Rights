import {
  MAX_FILE_BYTES,
  documentSchema,
  documentTypeLabel,
  fileKind,
  filterDocuments,
  formatFileSize,
  safeFileName,
} from "./documents";

const roomId = "7b1d2f1e-3c4a-4b5d-8e6f-1a2b3c4d5e6f";

const valid = {
  room_id: roomId,
  file_path: `${roomId}/abc-agreement.pdf`,
  file_name: "agreement.pdf",
  file_size: 245 * 1024,
  mime_type: "application/pdf",
  type: "agreement",
  visibility: "shared",
};

describe("documentSchema", () => {
  it("accepts a normal PDF", () => {
    expect(documentSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects files over 5 MB", () => {
    expect(documentSchema.safeParse({ ...valid, file_size: MAX_FILE_BYTES + 1 }).success).toBe(false);
  });

  it("rejects file types that are not photos or PDFs", () => {
    expect(documentSchema.safeParse({ ...valid, mime_type: "application/zip" }).success).toBe(false);
  });

  it("rejects a path outside the room's folder", () => {
    expect(documentSchema.safeParse({ ...valid, file_path: "someone-else/abc.pdf" }).success).toBe(false);
  });

  it("rejects an unknown type or visibility", () => {
    expect(documentSchema.safeParse({ ...valid, type: "secret" }).success).toBe(false);
    expect(documentSchema.safeParse({ ...valid, visibility: "public" }).success).toBe(false);
  });
});

describe("filterDocuments", () => {
  const docs = [
    { id: "1", type: "agreement" },
    { id: "2", type: "receipt" },
    { id: "3", type: "photo" },
    { id: "4", type: "other" },
  ];

  it("returns everything for all, including other", () => {
    expect(filterDocuments(docs, "all")).toHaveLength(4);
  });

  it("returns only the chosen type", () => {
    expect(filterDocuments(docs, "photo").map((d) => d.id)).toEqual(["3"]);
    expect(filterDocuments(docs, "agreement").map((d) => d.id)).toEqual(["1"]);
  });
});

describe("formatFileSize", () => {
  it("formats bytes, kilobytes and megabytes", () => {
    expect(formatFileSize(500)).toBe("500 B");
    expect(formatFileSize(245 * 1024)).toBe("245 KB");
    expect(formatFileSize(Math.round(1.2 * 1024 * 1024))).toBe("1.2 MB");
  });
});

describe("safeFileName", () => {
  it("lowercases and replaces unsafe characters", () => {
    expect(safeFileName("Agreement Scan.PDF")).toBe("agreement-scan.pdf");
  });

  it("keeps the end of very long names so the extension survives", () => {
    const name = `${"a".repeat(200)}.jpg`;
    const result = safeFileName(name);
    expect(result.length).toBeLessThanOrEqual(80);
    expect(result.endsWith(".jpg")).toBe(true);
  });
});

describe("labels", () => {
  it("names the file kind from its type", () => {
    expect(fileKind("image/jpeg")).toBe("JPG");
    expect(fileKind("application/pdf")).toBe("PDF");
  });

  it("names the document types", () => {
    expect(documentTypeLabel("receipt")).toBe("Receipt");
  });
});
