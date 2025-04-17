// 새 파일: src/pages/Admin/TestPage.jsx
import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import Layout from "../../components/Admin/Layout.jsx";

const TestPage = () => {
    return (
        <Layout>
            <Box sx={{ p: 3 }}>
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h4">테스트 페이지</Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        이 페이지가 보인다면 라우팅과 레이아웃이 정상입니다.
                    </Typography>
                </Paper>
            </Box>
        </Layout>
    );
};

export default TestPage;
