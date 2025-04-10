import React from "react";
import Background from "../../components/Admin/Background.jsx";
import Login from "../../components/Admin/Login.jsx";
import { Box } from "@mui/material";

const Admin = () => {
    return (
        <Box sx={{ position: "relative", width: "100vw", height: "100vh" }}>
            <Background /> {/* 배경 */}
            <Box
                sx={{
                    position: "absolute", // 배경 위에 띄우기
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)", // 정확한 중앙 정렬
                }}
            >
                <Login /> {/* 로그인 창 */}
            </Box>
        </Box>
    );
};

export default Admin;
