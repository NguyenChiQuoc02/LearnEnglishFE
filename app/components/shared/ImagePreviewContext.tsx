"use client";

import { createContext, useCallback, useContext, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

type ImagePreviewContextValue = {
  openImagePreview: (url: string, alt?: string) => void;
};

const ImagePreviewContext = createContext<ImagePreviewContextValue | null>(null);

export function useImagePreview() {
  const ctx = useContext(ImagePreviewContext);
  if (!ctx) {
    throw new Error("useImagePreview must be used within ImagePreviewProvider");
  }
  return ctx;
}

export default function ImagePreviewProvider({ children }: { children: React.ReactNode }) {
  const [preview, setPreview] = useState<{ url: string; alt?: string } | null>(null);

  const openImagePreview = useCallback((url: string, alt?: string) => {
    setPreview({ url, alt });
  }, []);

  const close = useCallback(() => setPreview(null), []);

  return (
    <ImagePreviewContext.Provider value={{ openImagePreview }}>
      {children}
      <Modal
        open={!!preview}
        onClose={close}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 200, sx: { bgcolor: "rgba(0,0,0,0.85)" } } }}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}
      >
        <Fade in={!!preview}>
          <Box
            onClick={close}
            sx={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "90vh",
              outline: "none",
              display: "flex",
            }}
          >
            <IconButton
              onClick={close}
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "common.white",
                bgcolor: "rgba(0,0,0,0.45)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.65)" },
              }}
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element -- remote Cloudinary URL, no next/image domain config in this project
              <img
                src={preview.url}
                alt={preview.alt ?? ""}
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                  display: "block",
                  borderRadius: 8,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                }}
              />
            )}
          </Box>
        </Fade>
      </Modal>
    </ImagePreviewContext.Provider>
  );
}
