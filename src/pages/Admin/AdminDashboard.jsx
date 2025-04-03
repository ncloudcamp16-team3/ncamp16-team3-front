import React from "react";
import DashBoard from "../../components/Admin/DashBoard.jsx";
import { Box } from "@mui/material";
import Layout from "../../components/Admin/Layout.jsx";

const AdminDashboard = () => {
    return (
        <Box>
            <Layout />
            <DashBoard />
        </Box>
    );
};

export default AdminDashboard;
