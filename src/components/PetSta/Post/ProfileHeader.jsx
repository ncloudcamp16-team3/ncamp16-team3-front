import React from "react";
import { Box, Typography } from "@mui/material";
import LeftArrow from "../../../assets/images/Global/left-arrow-black.svg";
import { useNavigate } from "react-router-dom";

const ProfileHeader = ({ userName }) => {
    const navigate = useNavigate();
    return (
        <Box display="flex" alignItems="center" p={1}>
            <Box display="flex" onClick={() => navigate(-1)} sx={{ cursor: "pointer" }}>
                <img src={LeftArrow} alt="back" />
            </Box>
            <Typography fontWeight="bold" ml={2}>
                {userName}
            </Typography>
        </Box>
    );
};

export default ProfileHeader;
