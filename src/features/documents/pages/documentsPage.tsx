import { useEffect, useState } from "react";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { Paper, Stack, Tab, Tabs } from "@mui/material";

import { PageContainer } from "../../../components/common/pageContainer";
import { DocumentUploadForm } from "../components/documentUploadForm";
import { DocumentsTable } from "../components/documentsTable";
import { TransferReportsPanel } from "../components/transferReportsPanel";
import { getDocuments } from "../services/documentsApi";
import type { SourceDocument } from "../types/documentTypes";

type ReportType = "bank" | "transfer";

export function DocumentsPage() {
  const [documents, setDocuments] = useState<SourceDocument[]>([]);
  const [selectedReportType, setSelectedReportType] = useState<ReportType>("bank");

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
      title="Reportes CSV"
      subtitle="Carga, procesa y exporta documentos financieros."
    >
      <Stack spacing={3}>
        <Paper sx={{ px: 2 }}>
          <Tabs
            value={selectedReportType}
            onChange={(_event, value: ReportType) => setSelectedReportType(value)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              icon={<AccountBalanceIcon fontSize="small" />}
              iconPosition="start"
              label="Cartolas bancarias"
              value="bank"
            />
            <Tab
              icon={<SwapHorizIcon fontSize="small" />}
              iconPosition="start"
              label="Cartolas de transferencias"
              value="transfer"
            />
          </Tabs>
        </Paper>

        {selectedReportType === "bank" ? (
          <Stack spacing={3}>
            <DocumentUploadForm onUploaded={loadDocuments} />
            <DocumentsTable documents={documents} onRefresh={loadDocuments} />
          </Stack>
        ) : (
          <TransferReportsPanel />
        )}
      </Stack>
    </PageContainer>
  );
}
