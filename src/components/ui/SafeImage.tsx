"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useState, type ReactNode } from "react";

type SafeImageProps = Omit<ImageProps, "onError"> & {
  /** Rendered instead of the image if it fails to load. Defaults to nothing. */
  fallback?: ReactNode;
};

/** next/image that swaps to a graceful fallback instead of a broken-image icon. */
export function SafeImage({ fallback = null, alt, unoptimized, ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  // Catches images that already failed before React hydrated.
  const checkLoaded = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth === 0 && img.currentSrc) setFailed(true);
  }, []);

  if (failed) return <>{fallback}</>;
  // Remote URLs are served as-is, so no `images.remotePatterns` config is needed.
  const isRemote = typeof props.src === "string" && /^https?:\/\//i.test(props.src);

  return (
    <Image
      {...props}
      alt={alt}
      unoptimized={unoptimized ?? isRemote}
      ref={checkLoaded}
      onError={() => setFailed(true)}
    />
  );
}
