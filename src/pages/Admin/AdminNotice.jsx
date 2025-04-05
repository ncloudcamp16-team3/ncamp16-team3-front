import React from "react";
import Layout from "../../components/Admin/Layout.jsx";
import Notice from "../../components/Admin/Notice.jsx";
import { Box } from "@mui/material";

const AdminNotice = () => {
    return (
        <Box height="100vh" backgroundColor="white">
            <Layout />
            <Notice />
        </Box>
    );
};

export default AdminNotice;
