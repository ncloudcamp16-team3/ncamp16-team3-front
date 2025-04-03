import React from "react";
import { Box, Button, Typography } from "@mui/material";

const PetRegister = () => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
            }}
        >
            <Box>
                <Typography variant="h5">산책 친구들</Typography>
            </Box>
            <Button
                sx={{
                    borderRadius: 5,
                    backgroundColor: "#E9A260",
                    fontWeight: 600,
                    padding: "7px 20px",
                    color: "white",
                }}
            >
                등록하기
            </Button>
        </Box>
    );
};

export default PetRegister;
