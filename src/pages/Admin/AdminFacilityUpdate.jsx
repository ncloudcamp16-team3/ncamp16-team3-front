import React from "react";
import { Box } from "@mui/material";
import Layout from "../../components/Admin/Layout.jsx";
import FacilityUpdate from "../../components/Admin/FacilityUpdate.jsx";

const AdminFacilityUpdate = () => {
    return (
        <Box height="100vh" backgroundColor="white">
            <Layout />
            <FacilityUpdate />
        </Box>
    );
};

export default AdminFacilityUpdate;
