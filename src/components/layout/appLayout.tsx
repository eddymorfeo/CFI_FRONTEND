import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f7f9fc" }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div">
            CFI
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 1600, margin: "0 auto", padding: 3 }}>{children}</Box>
    </Box>
  );
}