import React from "react";
import { Box, Chip, Typography } from "@mui/material";

const CardContentAboutTime = ({ openTimeRange, isOpened }) => {
    return (
        <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 1 }}>
            <Chip
                size="small"
                label={isOpened ? "영업중" : "영업종료"}
                color={isOpened ? "success" : "default"}
                className="open-chip"
            />
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: "bold", mt: 0.7 }}>
                {openTimeRange}
            </Typography>
        </Box>
    );
};

export default CardContentAboutTime;
