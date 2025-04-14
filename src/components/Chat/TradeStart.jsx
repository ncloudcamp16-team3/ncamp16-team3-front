import React from "react";
import { Box, Typography } from "@mui/material";

const TradeStart = ({ image, title, price }) => {
    return (
        <Box display="flex" alignItems="center" bgcolor="#f5e7da" p={1} borderRadius="12px" width="100%" my={2}>
            <img
                src={`/mock/Global/images/${image}`}
                alt={title}
                style={{ width: 50, height: 50, borderRadius: 8, marginRight: 12 }}
            />
            <Box>
                <Typography fontWeight="bold">{title}</Typography>
                <Typography>{Number(price).toLocaleString()}원</Typography>
            </Box>
        </Box>
    );
};

export default TradeStart;
