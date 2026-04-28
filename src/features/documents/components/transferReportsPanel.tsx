import { Box, Paper, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";

const transferColumns: GridColDef[] = [
  { field: "fecha", headerName: "Fecha", minWidth: 120, flex: 0.8 },
  { field: "monto", headerName: "Monto", minWidth: 120, flex: 0.8, type: "number", headerAlign: "left", align: "left" },
  { field: "rut_1", headerName: "RUT origen", minWidth: 130, flex: 0.9 },
  { field: "nombre_1", headerName: "Nombre origen", minWidth: 180, flex: 1.2 },
  { field: "cuenta_1", headerName: "Cuenta origen", minWidth: 150, flex: 1 },
  { field: "banco_1", headerName: "Banco origen", minWidth: 150, flex: 1 },
  { field: "rut_2", headerName: "RUT destino", minWidth: 130, flex: 0.9 },
  { field: "nombre_2", headerName: "Nombre destino", minWidth: 180, flex: 1.2 },
  { field: "cuenta_2", headerName: "Cuenta destino", minWidth: 150, flex: 1 },
  { field: "banco_2", headerName: "Banco destino", minWidth: 150, flex: 1 },
  { field: "descripcion", headerName: "Descripción", minWidth: 220, flex: 1.4 },
  { field: "tipo_transferencia", headerName: "Tipo transferencia", minWidth: 180, flex: 1 },
  { field: "clasificacion", headerName: "Clasificación", minWidth: 160, flex: 1 },
];

export function TransferReportsPanel() {
  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Cartolas de transferencias</Typography>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            autoHeight
            rows={[]}
            columns={transferColumns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            localeText={{
              noRowsLabel: "No hay transferencias procesadas.",
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
      </Paper>
    </Stack>
  );
}
