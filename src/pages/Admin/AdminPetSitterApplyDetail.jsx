import React from "react";
import { Box } from "@mui/material";
import Layout from "../../components/Admin/Layout.jsx";
import PetSitterApply from "../../components/Admin/PetSitterApply.jsx";

const AdminPetSitterApplyDetail = () => {
    return (
        <Box height="100vh" width="auto" backgroundColor="white">
            <Layout />
            <PetSitterApply />
        </Box>
    );
};

export default AdminPetSitterApplyDetail;
