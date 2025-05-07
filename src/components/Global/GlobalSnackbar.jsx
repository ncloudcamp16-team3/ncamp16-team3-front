import React from "react";
import { Alert, Snackbar } from "@mui/material";

const GlobalSnackbar = ({ open, message, severity, handleSnackbarClose }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            sx={{
                zIndex: 10000,
                mb: "135px",
            }}
        >
            <Alert onClose={handleSnackbarClose} severity={severity} sx={{ width: "100%" }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default GlobalSnackbar;
