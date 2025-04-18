import React from "react";
import { useNavigate } from "react-router-dom";
import Arrow from "../../assets/images/Global/left-arrow-brand.svg";
import { Box, Typography } from "@mui/material";

const TitleBar = ({ name, onBack, children }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack(); // prop으로 받은 함수 실행
        } else {
            navigate(-1); // 기본 동작
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" position="relative" height="60px">
            <Box position="absolute" left={10} onClick={handleBack} sx={{ cursor: "pointer" }}>
                <img src={Arrow} width="26px" height="26px" alt="back" />
            </Box>
            <Box>
                <Typography fontWeight="bold" fontSize="20px">
                    {name}
                </Typography>
            </Box>
            <Box position="absolute" right={10} pr={1}>
                {children}
            </Box>
        </Box>
    );
};

export default TitleBar;
