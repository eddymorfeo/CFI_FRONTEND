import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface PageContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function PageContainer({ title, subtitle, children }: PageContainerProps) {
  return (
    <Box>
      <Typography variant="h4" sx={{fontWeight: 700}} gutterBottom>
        {title}
      </Typography>

      {subtitle && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {subtitle}
        </Typography>
      )}

      {children}
    </Box>
  );
}