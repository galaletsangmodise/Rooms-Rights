"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { saveDocument } from "@/app/actions/documents";
import { MAX_FILE_BYTES, safeFileName } from "@/lib/documents";
import { compressImage } from "@/lib/image";
import { btnPrimary, cardCls, inputCls } from "@/lib/ui";
import { Field } from "./Field";

export function UploadForm({ roomId, canHide }: { roomId: string; canHide: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const picked = data.get("file");

    if (!(picked instanceof File) || picked.size === 0) {
      setError("Choose a file first.");
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const file = await compressImage(picked);
      if (file.size > MAX_FILE_BYTES) {
        setError("That file is too big. The limit is 5 MB.");
        return;
      }

      const path = `${roomId}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from("evidence")
        .upload(path, file, { contentType: file.type });

      if (uploadError) {
        setError("We could not upload that file. Only photos and PDFs up to 5 MB are allowed.");
        return;
      }

      const result = await saveDocument({
        room_id: roomId,
        file_path: path,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        type: String(data.get("type")),
        visibility: canHide ? String(data.get("visibility")) : "shared",
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      form.reset();
      router.refresh();
    } catch {
      setError("We could not upload that file. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={`${cardCls} space-y-4`}>
      <h2 className="text-lg font-bold">Upload a file</h2>

      <Field label="File" htmlFor="file" hint="A photo or PDF, up to 5 MB.">
        <input
          id="file"
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          required
          className={inputCls}
        />
      </Field>

      <Field label="What is it?" htmlFor="type">
        <select id="type" name="type" defaultValue="photo" className={inputCls}>
          <option value="agreement">Agreement</option>
          <option value="receipt">Receipt</option>
          <option value="photo">Photo</option>
          <option value="other">Other</option>
        </select>
      </Field>

      {canHide && (
        <Field label="Who can see it?" htmlFor="visibility">
          <select id="visibility" name="visibility" defaultValue="shared" className={inputCls}>
            <option value="shared">Me and my tenant</option>
            <option value="landlord_only">Only me</option>
          </select>
        </Field>
      )}

      {error && (
        <p role="alert" className="rounded-xl bg-orange-pale px-4 py-3 text-sm font-semibold text-orange">
          {error}
        </p>
      )}

      <button type="submit" disabled={busy} className={btnPrimary}>
        {busy ? "Uploading..." : "Upload a file"} <Plus size={20} />
      </button>
    </form>
  );
}
