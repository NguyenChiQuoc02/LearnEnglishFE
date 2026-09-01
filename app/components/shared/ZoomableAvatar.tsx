"use client";

import Avatar from "@mui/material/Avatar";
import type { AvatarProps } from "@mui/material/Avatar";
import { useImagePreview } from "@/app/components/shared/ImagePreviewContext";

// Same as MUI Avatar, but clicking it opens the shared image lightbox when a
// src is set — used for any read-only avatar/thumbnail (course, user, word).
export default function ZoomableAvatar({ src, alt, sx, ...props }: AvatarProps) {
  const { openImagePreview } = useImagePreview();

  return (
    <Avatar
      src={src}
      alt={alt}
      onClick={src ? () => openImagePreview(src, alt) : undefined}
      sx={[
        src ? { cursor: "zoom-in" } : null,
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
}
