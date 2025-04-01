import React from "react";
import { Box } from "@mui/material";

const UserIcon = ({ userInfo }) => {
    return (
        <Box
            sx={{
                borderRadius: "50%",
                padding: "2px",
                background:
                    userInfo.is_view === "true"
                        ? "none"
                        : "linear-gradient(90deg, #C913B9 0%, #F9373F 50%, #FECD00 100%)",
            }}
        >
            <Box
                sx={{
                    borderRadius: "50%",
                    border: "2px solid #FFFFFF",
                    overflow: "hidden",
                    width: "42px",
                    height: "42px",
                    flex: "0 0 auto",
                }}
            >
                <Box
                    component="img"
                    src={`./mock/PetSta/images/${userInfo.file_name}`} // 템플릿 리터럴 사용
                    alt="profile"
                    sx={{
                        maxWidth: "100%",
                        userSelect: "none",
                        pointerEvents: "none",
                    }}
                />
            </Box>
        </Box>
    );
};

export default UserIcon;
