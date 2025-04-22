import React from "react";
import { Outlet } from "react-router-dom";
import { AdminProvider } from "./AdminContext.jsx";

const AdminLayout = () => {
    return (
        <AdminProvider>
            <Outlet />
        </AdminProvider>
    );
};

export default AdminLayout;
