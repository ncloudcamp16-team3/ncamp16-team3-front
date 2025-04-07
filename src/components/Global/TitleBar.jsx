import React from "react";
import { useNavigate } from "react-router-dom";
import Arrow from "../../assets/images/Global/left-arrow-brand.svg";
import { Box, Typography } from "@mui/material";

const TitleBar = ({ name }) => {
    const navigate = useNavigate();
    return (
        <Box display="flex" justifyContent="center" alignItems="center" position="relative" height="60px">
            <Box position="absolute" left={10} onClick={() => navigate(-1)}>
                <img src={Arrow} width="26px" height="26px" />
            </Box>
            <Box>
                <Typography fontSize="20px">{name}</Typography>
            </Box>
        </Box>
    );
};

export default TitleBar;
