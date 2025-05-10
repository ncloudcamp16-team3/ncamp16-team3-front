import React from "react";
import { Box, Button } from "@mui/material";

const LocationConfigBtns = ({ saveLocation }) => {
    return (
        <Box
            sx={{
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                m: "20px",
            }}
        >
            <Button
                sx={{
                    backgroundColor: "#E9A260",
                    borderRadius: 2,
                    color: "white",
                    width: "100%",
                    padding: "10px",
                    fontWeight: "bold",
                    fontSize: "15px",
                }}
                onClick={() => saveLocation()}
            >
                위치저장
            </Button>
        </Box>
    );
};

export default LocationConfigBtns;
