"use client";

import { useState, useTransition } from "react";

export default function ImageUploader({
  serviceId,
  currentUrl,
  onUploaded,
}: {
  serviceId: string;
  currentUrl?: string | null;
  onUploaded?: (url: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-3">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          setErr(null);
          const f = e.target.files?.[0] || null;
          setFile(f);
          if (f) setPreview(URL.createObjectURL(f));
        }}
        className="block text-sm"
      />

      <button
        type="button"
        disabled={!file || pending}
        onClick={() => {
          if (!file) return;
          setErr(null);
          const fd = new FormData();
          fd.append("file", file);
          fd.append("serviceId", serviceId);

          start(async () => {
            const res = await fetch("/api/admin/services/upload", {
              method: "POST",
              body: fd,
            });
            if (!res.ok) {
              const j = await res.json().catch(() => ({}));
              setErr(j?.error || `Yükleme hatası (${res.status})`);
              return;
            }
            const j = await res.json();
            setPreview(j.url);
            onUploaded?.(j.url);
            // Basit çözüm: sayfayı tazele ki yeni URL grid’e düşsün
            if (typeof window !== "undefined") window.location.reload();
          });
        }}
        className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? "Yükleniyor..." : "Yükle"}
      </button>

      {err && <span className="text-xs text-red-600">{err}</span>}

      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="preview"
          className="h-10 w-16 rounded-md border object-cover"
        />
      )}
    </div>
  );
}
