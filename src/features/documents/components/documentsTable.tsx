import { Box, Chip, Paper, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridPaginationModel, GridRenderCellParams } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { DocumentActions } from "./documentActions";
import type { SourceDocument } from "../types/documentTypes";

interface DocumentsTableProps {
  documents: SourceDocument[];
  onRefresh: () => void;
}

function buildStatusChip(status: string) {
  const normalizedStatus = status.toUpperCase();

  if (normalizedStatus === "PROCESSED") {
    return <Chip label={status} color="success" size="small" />;
  }

  if (normalizedStatus === "PENDING") {
    return <Chip label={status} color="warning" size="small" />;
  }

  if (normalizedStatus === "FAILED") {
    return <Chip label={status} color="error" size="small" />;
  }

  return <Chip label={status} variant="outlined" size="small" />;
}

export function DocumentsTable({ documents, onRefresh }: DocumentsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const filteredDocuments = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return documents;
    }

    return documents.filter((document) =>
      document.original_file_name.toLowerCase().includes(normalizedSearchTerm),
    );
  }, [documents, searchTerm]);

  const paginatedCountStart =
    filteredDocuments.length === 0
      ? 0
      : paginationModel.page * paginationModel.pageSize + 1;

  const paginatedCountEnd = Math.min(
    (paginationModel.page + 1) * paginationModel.pageSize,
    filteredDocuments.length,
  );

  const columns: GridColDef<SourceDocument>[] = [
    {
      field: "original_file_name",
      headerName: "Archivo",
      flex: 1.5,
      minWidth: 240,
      sortable: true,
    },
    {
      field: "detected_institution_name",
      headerName: "Banco",
      flex: 1,
      minWidth: 160,
      sortable: true,
      valueGetter: (_value, row) => row.detected_institution_name ?? "-",
    },
    {
      field: "detected_document_type",
      headerName: "Tipo de cartola",
      flex: 1.2,
      minWidth: 190,
      sortable: true,
      valueGetter: (_value, row) => row.detected_document_type ?? row.detected_document_group ?? "-",
    },
    {
      field: "file_extension",
      headerName: "Extensión",
      flex: 0.7,
      minWidth: 100,
      sortable: true,
    },
    {
      field: "processing_status",
      headerName: "Estado proceso",
      flex: 0.9,
      minWidth: 150,
      sortable: true,
      renderCell: (params: GridRenderCellParams<SourceDocument, string>) =>
        buildStatusChip(params.value ?? ""),
    },
    {
      field: "uploaded_at",
      headerName: "Fecha carga",
      flex: 1,
      minWidth: 180,
      sortable: true,
      valueFormatter: (value) => new Date(String(value)).toLocaleString(),
    },
    {
      field: "actions",
      headerName: "Acciones",
      minWidth: 230,
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<SourceDocument>) => (
        <DocumentActions
          sourceDocumentId={params.row.source_document_id}
          onProcessed={onRefresh}
          onDeleted={onRefresh}
        />
      ),
    },
  ];

  return (
    <Paper sx={{ p: 2 }}>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          gap: 2,
          alignItems: { xs: "stretch", md: "center" },
        }}
      >
        <Typography variant="h6">Documentos cargados</Typography>

        <TextField
          size="small"
          label="Buscar por nombre de archivo"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setPaginationModel((previousValue) => ({
              ...previousValue,
              page: 0,
            }));
          }}
          sx={{ width: { xs: "100%", md: 340 } }}
        />
      </Box>

      <Box sx={{ height: 520, width: "100%" }}>
        <DataGrid
          rows={filteredDocuments}
          columns={columns}
          getRowId={(row) => row.source_document_id}
          disableRowSelectionOnClick
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50]}
          sortingOrder={["asc", "desc"]}
          localeText={{
            noRowsLabel: "No hay documentos cargados.",
            footerRowSelected: (count) =>
              count !== 1 ? `${count.toString()} filas seleccionadas` : "1 fila seleccionada",
          }}
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f8fafc",
              fontWeight: 700,
            },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
              outline: "none",
            },
          }}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Mostrando {paginatedCountStart} a {paginatedCountEnd} de {filteredDocuments.length} registros
        </Typography>
      </Box>
    </Paper>
  );
}