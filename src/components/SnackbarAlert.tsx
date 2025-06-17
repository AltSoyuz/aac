import { Alert, Snackbar } from "@mui/material";
import type { SnackbarMessage } from "../types";

interface SnackbarAlertProps {
  snackbar: SnackbarMessage;
  onClose: () => void;
}

export const SnackbarAlert = ({ snackbar, onClose }: SnackbarAlertProps) => {
  if (!snackbar) return null;

  return (
    <Snackbar
      open
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={onClose}
        severity={snackbar.severity}
        sx={{ width: "100%" }}
      >
        {snackbar.children}
      </Alert>
    </Snackbar>
  );
};
