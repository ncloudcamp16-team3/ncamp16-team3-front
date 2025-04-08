import React from "react";
import Layout from "../../components/Admin/Layout.jsx";
import { Box } from "@mui/material";
import PetSitterDetail from "../../components/Admin/PetSitterDetail.jsx";

const AdminPetsitterDetail = () => {
    return (
        <Box height="100vh" width="auto" backgroundColor="white">
            <Layout />
            <PetSitterDetail />
        </Box>
    );
};

export default AdminPetsitterDetail;
