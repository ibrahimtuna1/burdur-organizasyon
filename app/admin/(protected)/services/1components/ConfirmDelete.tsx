"use client";

import { useTransition } from "react";

export default function ConfirmDelete({
  label,
  onConfirmAction,
}: {
  label: string;
  onConfirmAction: () => Promise<void>;
}) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("Bu hizmet silinecek. Emin misin?")) {
          start(async () => {
            await onConfirmAction();
          });
        }
      }}
      className="rounded-md bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
    >
      {pending ? "Siliniyor..." : label}
    </button>
  );
}
