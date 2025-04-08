import React from "react";
import { Box } from "@mui/material";
import Layout from "../../components/Admin/Layout.jsx";
import FacilityList from "../../components/Admin/FacilityList.jsx";

const AdminFacilityList = () => {
    return (
        <Box height="100vh" backgroundColor="white">
            <Layout />
            <FacilityList />
        </Box>
    );
};

export default AdminFacilityList;
