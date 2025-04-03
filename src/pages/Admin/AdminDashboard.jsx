import React from "react";
import DashBoard from "../../components/Admin/DashBoard.jsx";
import AdminHeader from "../../components/Admin/Layout.jsx";
import { Box } from "@mui/material";

const AdminDashboard = () => {
    return (
        <Box>
            <AdminHeader />
            <DashBoard />
        </Box>
    );
};

export default AdminDashboard;
