// Product data type
export type Product = {
  Id: number;   // Application ID
  id?: number;  // Required by DataGrid component
  Name: string;
  Reference: string;
  Price: number;
  Rating: number;
};

// Snackbar notification type
export type SnackbarMessage = {
  children: string;
  severity: "success" | "error";
} | null;
