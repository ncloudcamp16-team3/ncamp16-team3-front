import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const TradeStart = ({ image, title, price, postId }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/board/${postId}`);
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            bgcolor="#f5e7da"
            p={1}
            borderRadius="12px"
            width="100%"
            my={2}
            sx={{ cursor: "pointer" }}
            onClick={handleClick}
        >
            <img src={image} alt={title} style={{ width: 50, height: 50, borderRadius: 8, marginRight: 12 }} />
            <Box>
                <Typography fontWeight="bold">{title}</Typography>
                <Typography>{Number(price).toLocaleString()}원</Typography>
            </Box>
        </Box>
    );
};

export default TradeStart;
