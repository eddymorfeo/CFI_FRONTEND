import { useEffect, useState } from "react";
import { PageContainer } from "../../../components/common/pageContainer";
import { DocumentUploadForm } from "../components/documentUploadForm";
import { DocumentsTable } from "../components/documentsTable";
import { getDocuments } from "../services/documentsApi";
import type { SourceDocument } from "../types/documentTypes";

export function DocumentsPage() {
  const [documents, setDocuments] = useState<SourceDocument[]>([]);

  async function loadDocuments() {
    const data = await getDocuments();
    setDocuments(data);
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchDocuments() {
      const data = await getDocuments();
      if (isMounted) {
        setDocuments(data);
      }
    }

    void fetchDocuments();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PageContainer
      title="Cartolas bancarias"
      subtitle="Carga, procesa y exporta documentos bancarios."
    >
      <DocumentUploadForm onUploaded={loadDocuments} />
      <DocumentsTable documents={documents} onRefresh={loadDocuments} />
    </PageContainer>
  );
}
