import React from "react";
import Layout from "../../components/Admin/Layout.jsx";
import PostDetail from "../../components/Admin/PostDetail.jsx";
import { Box } from "@mui/material";

const AdminPostDetail = () => {
    return (
        <Box height="100vh" width="auto" backgroundColor="white">
            <Layout />
            <PostDetail />
        </Box>
    );
};

export default AdminPostDetail;
