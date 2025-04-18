import React from "react";
import { Box } from "@mui/material";
import Layout from "../../components/Admin/Layout.jsx";
import FacilityAdd from "../../components/Admin/FacilityAdd.jsx";

const AdminFacilityAdd = () => {
    return (
        <Box height="100vh" backgroundColor="white">
            <Layout />
            <FacilityAdd />
        </Box>
    );
};

export default AdminFacilityAdd;
