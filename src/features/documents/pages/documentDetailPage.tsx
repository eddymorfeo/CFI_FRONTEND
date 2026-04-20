import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Alert, Button, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageContainer } from "../../../components/common/pageContainer";
import { getDocumentById } from "../services/documentsApi";
import type { SourceDocumentDetail } from "../types/documentTypes";

export function DocumentDetailPage() {
  const { sourceDocumentId } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState<SourceDocumentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDocument() {
      if (!sourceDocumentId) return;

      try {
        const data = await getDocumentById(sourceDocumentId);
        if (isMounted) {
          setDocument(data);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadDocument();

    return () => {
      isMounted = false;
    };
  }, [sourceDocumentId]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!document) {
    return <Alert severity="error">No se pudo cargar el documento.</Alert>;
  }

  return (
    <PageContainer
      title="Detalle de documento"
      subtitle="Información detectada del documento cargado."
    >
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        sx={{ mb: 2 }}
      >
        Volver
      </Button>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={1}>
          <Typography><strong>Archivo:</strong> {document.original_file_name}</Typography>
          <Typography><strong>Banco detectado:</strong> {document.detected_institution_name ?? "-"}</Typography>
          <Typography><strong>Titular detectado:</strong> {document.detected_holder_name ?? "-"}</Typography>
          <Typography><strong>Cuenta detectada:</strong> {document.detected_account_number ?? "-"}</Typography>
          <Typography><strong>Desde:</strong> {document.document_date_from ?? "-"}</Typography>
          <Typography><strong>Hasta:</strong> {document.document_date_to ?? "-"}</Typography>
          <Typography><strong>Estado proceso:</strong> {document.processing_status}</Typography>
          <Typography><strong>Estado revisión:</strong> {document.review_status}</Typography>
        </Stack>
      </Paper>
    </PageContainer>
  );
}