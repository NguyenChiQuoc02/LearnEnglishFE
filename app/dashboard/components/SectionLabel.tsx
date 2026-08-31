"use client";

import Typography from "@mui/material/Typography";

export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="overline" sx={{ fontWeight: 700, color: "primary.main", letterSpacing: 0.6 }}>
      {children}
    </Typography>
  );
}
