import React from "react";
import Layout from "../../components/Admin/Layout.jsx";
import { Box } from "@mui/material";
import NoticeDetail from "../../components/Admin/NoticeDetail.jsx";

const AdminNoticeDetail = () => {
    return (
        <Box height="100vh" backgroundColor="white">
            <Layout />
            <NoticeDetail />
        </Box>
    );
};

export default AdminNoticeDetail;
