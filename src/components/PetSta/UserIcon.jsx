import React from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UserIcon = ({ userInfo }) => {
    const navigate = useNavigate();

    return (
        <Box
            position="relative"
            width="42px"
            height="42px"
            borderRadius="50%"
            onClick={() => navigate(`/petsta/user/${userInfo.userId}`)}
            sx={{ cursor: "pointer" }}
        >
            {/* 바깥 그라데이션 원 */}
            <Box
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                borderRadius="50%"
                sx={{
                    background:
                        userInfo.isView === "false"
                            ? "transparent"
                            : "linear-gradient(90deg, #C913B9 0%, #F9373F 50%, #FECD00 100%)",
                }}
            />

            {/* 중간 투명 공간 */}
            <Box
                position="absolute"
                top="2px"
                left="2px"
                width="38px"
                height="38px"
                borderRadius="50%"
                sx={{
                    backgroundColor: "transparent",
                }}
            />

            {/* 프로필 이미지 */}
            <Box
                position="absolute"
                top="3px"
                left="3px"
                width="36px"
                height="36px"
                borderRadius="50%"
                overflow="hidden"
                sx={{
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box
                    component="img"
                    src={`${userInfo.userPhoto}`}
                    alt="profile"
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        userSelect: "none",
                        pointerEvents: "none",
                    }}
                />
            </Box>
        </Box>
    );
};

export default UserIcon;
