import React from "react";
import Layout from "../../components/Admin/Layout.jsx";
import { Box } from "@mui/material";
import PetsitterList from "../../components/Admin/PetsitterList.jsx";

const AdminPetsitterList = () => {
    return (
        <Box height="100vh" backgroundColor="white">
            <Layout />
            <PetsitterList />
        </Box>
    );
};

export default AdminPetsitterList;
