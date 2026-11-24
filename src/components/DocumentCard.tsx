import { FileText } from "lucide-react";
import { fileKind, formatFileSize } from "@/lib/documents";
import { cardCls } from "@/lib/ui";
import { StatusChip } from "./StatusChip";

export type DocumentCardData = {
  id: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  type: string;
  visibility: string;
  created_at: string;
};

export function DocumentCard({
  doc,
  url,
  showVisibility = false,
}: {
  doc: DocumentCardData;
  url: string | null;
  showVisibility?: boolean;
}) {
  const isImage = doc.mime_type.startsWith("image/");

  const content = (
    <>
      <div className="mb-3 flex h-28 items-center justify-center overflow-hidden rounded-xl bg-sand">
        {isImage && url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={doc.file_name} className="h-full w-full object-cover" />
        ) : (
          <FileText size={40} className="text-maroon" />
        )}
      </div>
      <p className="truncate font-bold">{doc.file_name}</p>
      <p className="text-sm text-ink-soft">
        {fileKind(doc.mime_type)} · {formatFileSize(doc.file_size)}
      </p>
      {showVisibility && doc.visibility === "landlord_only" && (
        <div className="mt-2">
          <StatusChip tone="orange">Only me</StatusChip>
        </div>
      )}
    </>
  );

  if (!url) return <div className={cardCls}>{content}</div>;

  return (
    <a href={url} target="_blank" rel="noreferrer" className={`${cardCls} block`}>
      {content}
    </a>
  );
}
