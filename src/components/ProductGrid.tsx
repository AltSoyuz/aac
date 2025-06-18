import { DataGrid, useGridApiContext } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams, GridValidRowModel } from "@mui/x-data-grid";
import { Box, Rating } from "@mui/material";
import { useRef } from "react";
import useEnhancedEffect from "@mui/utils/useEnhancedEffect";
import type { Product } from "../types";

// Render Rating stars in cell (read-only)
function renderRating(params: GridRenderCellParams<GridValidRowModel, number>) {
  return <Rating readOnly value={params.value ?? 0} precision={1} />;
}

// Editable Rating stars input cell
function RatingEditInputCell(props: GridRenderCellParams<GridValidRowModel, number>) {
  const { id, value, field, hasFocus } = props;
  const apiRef = useGridApiContext();
  const ref = useRef<HTMLSpanElement>(null);

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: number | null
  ) => {
    apiRef.current.setEditCellValue({ id, field, value: newValue }, _event);
  };

  useEnhancedEffect(() => {
    if (hasFocus && ref.current) {
      const input = ref.current.querySelector<HTMLInputElement>("input");
      input?.focus();
    }
  }, [hasFocus]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", pr: 2 }}>
      <Rating
        ref={ref}
        name={`rating-${id}`}
        precision={1}
        value={value ?? 0}
        onChange={handleChange}
        autoFocus={hasFocus}
      />
    </Box>
  );
}

interface ProductGridProps {
  rows: Product[];
  onRowUpdate: (newRow: Product) => Promise<Product>;
  onProcessRowUpdateError: (error: Error) => void;
}

export const ProductGrid = ({
  rows,
  onRowUpdate,
  onProcessRowUpdateError,
}: ProductGridProps) => {
  const columns: GridColDef[] = [
    {
      field: "Id",
      headerName: "ID",
      width: 90,
      editable: false,
      minWidth: 90,
    },
    {
      field: "Name",
      headerName: "Name",
      width: 20,
      editable: true,
      minWidth: 120,
    },
    {
      field: "Reference",
      headerName: "Reference",
      width: 20,
      editable: true,
      minWidth: 120,
    },
    {
      field: "Price",
      headerName: "Price",
      type: "number",
      width: 15,
      editable: true,
      minWidth: 120,
    },
    {
      field: "Rating",
      headerName: "Rating",
      type: "number",
      width: 15,
      editable: true,
      minWidth: 200,
      renderCell: renderRating,
      renderEditCell: (params) => <RatingEditInputCell {...params} />,
    },
  ];

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      processRowUpdate={onRowUpdate}
      onProcessRowUpdateError={onProcessRowUpdateError}
    />
  );
};
