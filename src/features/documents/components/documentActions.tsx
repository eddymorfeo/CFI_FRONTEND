import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { CircularProgress, IconButton, Stack, Tooltip } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import {
  deleteDocument,
  exportCartolaBancaria,
  processDocument,
} from "../services/documentsApi";
import { getDocumentErrorMessage } from "../services/documentErrors";

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
      await Swal.fire({
        icon: "error",
        title: "Error al procesar",
        text: getDocumentErrorMessage(error),
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
      await Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: getDocumentErrorMessage(error),
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
    <Stack direction="row" spacing={1}>
      <Tooltip title="Ver detalle">
        <IconButton component={Link} to={`/documents/${sourceDocumentId}`}>
          <VisibilityIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Procesar documento">
        <span>
          <IconButton
            onClick={() => void handleProcessDocument()}
            disabled={isProcessing}
          >
            {isProcessing ? <CircularProgress size={20} /> : <PlayArrowIcon />}
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Exportar cartola bancaria">
        <IconButton onClick={handleExport}>
          <DownloadIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Eliminar documento">
        <span>
          <IconButton
            onClick={() => void handleDeleteDocument()}
            disabled={isDeleting}
          >
            {isDeleting ? <CircularProgress size={20} /> : <DeleteIcon />}
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}