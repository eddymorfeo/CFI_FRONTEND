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
import { getDocumentErrorMessage } from "../services/documentErrors";
import type { SourceDocument } from "../types/documentTypes";

interface DocumentUploadFormProps {
  onUploaded: (document: SourceDocument) => void;
}

export function DocumentUploadForm({ onUploaded }: DocumentUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleUpload() {
    if (!selectedFile) {
      await Swal.fire({
        icon: "warning",
        title: "Archivo requerido",
        text: "Debes seleccionar un archivo antes de subirlo.",
      });
      return;
    }

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
    } catch (error: unknown) {
      await Swal.fire({
        icon: "error",
        title: "Error al cargar documento",
        text: getDocumentErrorMessage(error),
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Cargar cartola bancaria</Typography>

        <Box>
          <Button
            component="label"
            variant="outlined"
            fullWidth
            disabled={isUploading}
          >
            Seleccionar archivo PDF
            <input
              hidden
              type="file"
              accept=".pdf,.xlsx,.xls,.csv"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setSelectedFile(file);
              }}
            />
          </Button>
        </Box>

        {selectedFile && (
          <Typography variant="body2">
            <strong>Archivo seleccionado:</strong> {selectedFile.name}
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

        
      </Stack>
      <Button
          sx={{mt:2}}
          variant="contained"
          onClick={() => void handleUpload()}
          disabled={!selectedFile || isUploading}
        >
          Subir documento
        </Button>
    </Paper>
  );
}