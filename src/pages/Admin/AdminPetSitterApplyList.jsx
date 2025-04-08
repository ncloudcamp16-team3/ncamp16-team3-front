import React from "react";
import Layout from "../../components/Admin/Layout.jsx";
import { Box } from "@mui/material";
import PetSitterApplyList from "../../components/Admin/PetSitterApplyList.jsx";

const AdminPetsitterList = () => {
    return (
        <Box height="100vh" backgroundColor="white">
            <Layout />
            <PetSitterApplyList />
        </Box>
    );
};

export default AdminPetsitterList;
