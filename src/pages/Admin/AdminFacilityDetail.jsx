import React from "react";
import { Box } from "@mui/material";
import Layout from "../../components/Admin/Layout.jsx";
import FacilityDetail from "../../components/Admin/FacilityDetail.jsx";

const AdminFacilityDetail = () => {
    return (
        <Box height="100vh" backgroundColor="white">
            <Layout />
            <FacilityDetail />
        </Box>
    );
};

export default AdminFacilityDetail;
