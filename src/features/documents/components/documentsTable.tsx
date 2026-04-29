import { Box, Chip, Paper, TextField, Typography } from "@mui/material";
import {
  DataGrid,
  GridFooterContainer,
  GridPagination,
} from "@mui/x-data-grid";
import type {
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
} from "@mui/x-data-grid";
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
    return (
      <Chip
        label="PROCESSED"
        size="small"
        sx={{
          backgroundColor: "#2e7d32",
          color: "#ffffff",
          fontWeight: 700,
        }}
      />
    );
  }

  if (normalizedStatus === "PENDING") {
    return (
      <Chip
        label="PENDING"
        size="small"
        sx={{
          backgroundColor: "#ed6c02",
          color: "#ffffff",
          fontWeight: 700,
        }}
      />
    );
  }

  if (normalizedStatus === "FAILED") {
    return (
      <Chip
        label="FAILED"
        size="small"
        sx={{
          backgroundColor: "#d32f2f",
          color: "#ffffff",
          fontWeight: 700,
        }}
      />
    );
  }

  return <Chip label={status || "-"} size="small" variant="outlined" />;
}

interface CustomFooterProps {
  totalRows: number;
  page: number;
  pageSize: number;
}

function CustomFooter({ totalRows, page, pageSize }: CustomFooterProps) {
  const paginatedCountStart = totalRows === 0 ? 0 : page * pageSize + 1;
  const paginatedCountEnd =
    totalRows === 0 ? 0 : Math.min((page + 1) * pageSize, totalRows);

  return (
    <GridFooterContainer
      sx={{
        minHeight: 56,
        px: 2,
        py: 1,
        borderTop: "1px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        flexWrap: { xs: "wrap", md: "nowrap" },
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Mostrando {paginatedCountStart} a {paginatedCountEnd} de {totalRows} registros
      </Typography>

      <GridPagination />
    </GridFooterContainer>
  );
}

export function DocumentsTable({
  documents,
  onRefresh,
}: DocumentsTableProps) {
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
      document.original_file_name
        .toLowerCase()
        .includes(normalizedSearchTerm),
    );
  }, [documents, searchTerm]);

  const columns: GridColDef[] = [
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
      valueGetter: (_value, row) =>
        row.detected_document_type ?? row.detected_document_group ?? "-",
    },
    {
      field: "extracted_movements_count",
      headerName: "Total registros",
      flex: 0.8,
      minWidth: 130,
      sortable: true,
      type: "number",
      headerAlign: "left",
      align: "left",
      valueGetter: (_value, row) => row.extracted_movements_count ?? 0,
    },
    {
      field: "processing_status",
      headerName: "Estado proceso",
      flex: 0.9,
      minWidth: 150,
      sortable: true,
      renderCell: (params: GridRenderCellParams) =>
        buildStatusChip(String(params.value ?? "")),
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
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: { xs: "stretch", md: "center" },
          justifyContent: "space-between",
          gap: 2,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Typography variant="h6">Documentos cargados</Typography>

        <TextField
          placeholder="Buscar por nombre de archivo"
          size="small"
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

      <DataGrid
        autoHeight
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
            count !== 1
              ? `${count.toString()} filas seleccionadas`
              : "1 fila seleccionada",
        }}
        slots={{
          footer: () => (
            <CustomFooter
              totalRows={filteredDocuments.length}
              page={paginationModel.page}
              pageSize={paginationModel.pageSize}
            />
          ),
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
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
          },
        }}
      />
    </Paper>
  );
}