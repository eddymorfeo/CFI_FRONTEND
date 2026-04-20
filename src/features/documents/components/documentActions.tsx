import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { CircularProgress, IconButton, Stack, Tooltip } from "@mui/material";
import type { AxiosError } from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  deleteDocument,
  exportCartolaBancaria,
  processDocument,
} from "../services/documentsApi";

interface DocumentActionsProps {
  sourceDocumentId: string;
  onProcessed: () => void;
  onDeleted: () => void;
}

export function DocumentActions({
  sourceDocumentId,
  onProcessed,
  onDeleted,
}: DocumentActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleProcessDocument() {
    try {
      setIsProcessing(true);

      const response = await processDocument(sourceDocumentId);

      onProcessed();

      await Swal.fire({
        icon: "success",
        title: "Documento procesado",
        text: `Se extrajeron ${response.movements_count} movimientos.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ detail?: string }>;

      await Swal.fire({
        icon: "error",
        title: "Error al procesar",
        text: axiosError.response?.data?.detail ?? "No se pudo procesar el documento.",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleDeleteDocument() {
    const result = await Swal.fire({
      icon: "warning",
      title: "Eliminar documento",
      text: "¿Deseas eliminar este documento? Esta acción no se puede deshacer.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setIsDeleting(true);

      await deleteDocument(sourceDocumentId);
      onDeleted();

      await Swal.fire({
        icon: "success",
        title: "Documento eliminado",
        text: "El documento fue eliminado correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ detail?: string }>;

      await Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: axiosError.response?.data?.detail ?? "No se pudo eliminar el documento.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  function handleExport() {
    const exportUrl = exportCartolaBancaria(sourceDocumentId);
    window.open(exportUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <Stack direction="row" spacing={0.5} sx={{ width: "100%", justifyContent: "flex-start" }}>
      <Tooltip title="Ver detalle">
        <span>
          <IconButton component={Link} to={`/documents/${sourceDocumentId}`}>
            <VisibilityIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Procesar documento">
        <span>
          <IconButton onClick={handleProcessDocument} disabled={isProcessing || isDeleting}>
            {isProcessing ? <CircularProgress size={20} /> : <PlayArrowIcon />}
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Exportar cartola bancaria">
        <span>
          <IconButton onClick={handleExport} disabled={isProcessing || isDeleting}>
            <DownloadIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Eliminar documento">
        <span>
          <IconButton onClick={handleDeleteDocument} disabled={isProcessing || isDeleting}>
            {isDeleting ? <CircularProgress size={20} /> : <DeleteIcon />}
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}