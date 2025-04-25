import React from "react";
import { Box, Button } from "@mui/material";

const RenderButtonGroup = ({ buttons = [] }) => {
    return (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mx: 1, my: 1 }}>
            {buttons.map(({ label, color, onClick }, index) => (
                <Button
                    key={index}
                    sx={{
                        backgroundColor: color,
                        borderRadius: "50px",
                        ml: index > 0 ? 1 : 0,
                    }}
                    onClick={onClick}
                    variant="contained"
                >
                    {label}
                </Button>
            ))}
        </Box>
    );
};

export default RenderButtonGroup;
