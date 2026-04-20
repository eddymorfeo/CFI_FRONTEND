import {
  Box,
  Button,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";
import { uploadDocument } from "../services/documentsApi";
import type { SourceDocument } from "../types/documentTypes";

interface DocumentUploadFormProps {
  onUploaded: (document: SourceDocument) => void;
}

export function DocumentUploadForm({ onUploaded }: DocumentUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleUpload() {
    if (!selectedFile) return;

    try {
      setIsUploading(true);

      const uploadedDocument = await uploadDocument(selectedFile);

      setSelectedFile(null);
      onUploaded(uploadedDocument);

      await Swal.fire({
        icon: "success",
        title: "Documento cargado",
        text: "La cartola fue cargada correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar el documento.",
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Cargar cartola bancaria</Typography>

        <Button variant="outlined" component="label" disabled={isUploading}>
          Seleccionar archivo PDF
          <input
            hidden
            type="file"
            accept=".pdf,.csv,.xls,.xlsx"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              setSelectedFile(file);
            }}
          />
        </Button>

        {selectedFile && (
          <Typography variant="body2">
            Archivo seleccionado: <strong>{selectedFile.name}</strong>
          </Typography>
        )}

        {isUploading && (
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Subiendo documento...
            </Typography>
            <LinearProgress />
          </Box>
        )}

        <Box>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            Subir documento
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}