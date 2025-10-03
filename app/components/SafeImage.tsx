"use client";

import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

type Props = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;      // boş/undefined gelebilir
  alt?: string;
  label?: string;           // placeholder yazısı
};

/**
 * - src yoksa ya da yükleme hata alırsa placeholder render eder.
 * - unoptimized: Next optimizer'a düşmediği için “isn't a valid image” log'u gelmez.
 */
export default function SafeImage({
  src,
  alt = "",
  label = "Görsel yok",
  className,
  ...rest
}: Props) {
  const [ok, setOk] = useState<boolean>(Boolean(src));

  useEffect(() => setOk(Boolean(src)), [src]);

  if (!ok) {
    // Tam alanı dolduran sade placeholder
    return (
      <div className={`w-full h-full grid place-items-center bg-neutral-100 text-neutral-400 ${className || ""}`}>
        <span className="text-xs">{label}</span>
      </div>
    );
  }

  return (
    <Image
      {...rest}
      src={src as string}
      alt={alt}
      unoptimized
      onError={() => setOk(false)}
      className={className}
    />
  );
}
