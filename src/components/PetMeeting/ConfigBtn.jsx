import React from "react";
import { Box, Typography } from "@mui/material";

const ConfigBtn = ({ img, label, setOpen }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                margin: "5px 40px 5px 0",
                alignItems: "center",
                cursor: "pointer",
            }}
            onClick={() => setOpen(true)}
        >
            <Box
                component="img"
                src={img}
                alt={label}
                sx={{
                    width: 40,
                    height: 40,
                    objectFit: "contain",
                    marginBottom: "10px",
                }}
            />
            <Typography
                sx={{
                    color: "rgba(0, 0, 0, 0.4)",
                }}
            >
                {label}
            </Typography>
        </Box>
    );
};

export default ConfigBtn;
