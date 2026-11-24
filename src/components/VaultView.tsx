import Link from "next/link";
import { filterDocuments, type DocumentFilter } from "@/lib/documents";
import type { VaultDocument } from "@/lib/vault";
import { cardCls } from "@/lib/ui";
import { DocumentCard } from "./DocumentCard";
import { UploadForm } from "./UploadForm";

const CHIPS: { value: DocumentFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "agreement", label: "Agreements" },
  { value: "receipt", label: "Receipts" },
  { value: "photo", label: "Photos" },
];

export function VaultView({
  roomId,
  basePath,
  filter,
  documents,
  urls,
  isLandlord,
}: {
  roomId: string;
  basePath: string;
  filter: DocumentFilter;
  documents: VaultDocument[];
  urls: Record<string, string>;
  isLandlord: boolean;
}) {
  const shown = filterDocuments(documents, filter);

  return (
    <div className="space-y-6">
      <nav aria-label="Filter files" className="flex flex-wrap gap-2">
        {CHIPS.map((chip) => (
          <Link
            key={chip.value}
            href={chip.value === "all" ? basePath : `${basePath}?type=${chip.value}`}
            aria-current={filter === chip.value ? "true" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              filter === chip.value ? "bg-maroon text-white" : "text-ink-soft"
            }`}
          >
            {chip.label}
          </Link>
        ))}
      </nav>

      {shown.length === 0 ? (
        <div className={cardCls}>
          <p className="font-bold">No files yet</p>
          <p className="mt-1 text-ink-soft">
            Add the signed agreement, a receipt or a photo of the room.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {shown.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              url={urls[doc.file_path] ?? null}
              showVisibility={isLandlord}
            />
          ))}
        </div>
      )}

      <UploadForm roomId={roomId} canHide={isLandlord} />
    </div>
  );
}
