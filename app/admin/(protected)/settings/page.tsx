"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onLogout = async () => {
    try {
      setErr(null);
      setLoading(true);
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (!res.ok) throw new Error("Çıkış başarısız.");
      router.replace("/admin/login");
      router.refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Bir şeyler ters gitti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[70vh] flex items-center">
      <div className="mx-auto w-full max-w-md px-4">
        <div className="rounded-2xl border border-zinc-200/70 bg-white p-6 shadow">
          <h1 className="text-2xl font-bold">Admin Ayarları</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Buradan sadece oturumunu kapatabilirsin.
          </p>

          <div className="mt-6">
            <button
              onClick={onLogout}
              disabled={loading}
              className="w-full rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white shadow hover:bg-rose-700 disabled:opacity-60"
            >
              {loading ? "Çıkış yapılıyor..." : "Çıkış Yap"}
            </button>
          </div>

          {err && <p className="mt-4 text-sm text-rose-600">{err}</p>}
        </div>
      </div>
    </section>
  );
}
