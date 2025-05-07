import React from "react";
import Layout from "../../components/Admin/Layout.jsx";
import { Box } from "@mui/material";
import NoticeList from "../../components/Admin/NoticeList.jsx";

const AdminNoticeList = () => {
    return (
        <Box height="100vh" backgroundColor="white">
            <Layout />
            <NoticeList />
        </Box>
    );
};

export default AdminNoticeList;
