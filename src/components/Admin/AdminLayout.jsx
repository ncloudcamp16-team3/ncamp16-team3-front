import React from "react";
import { Outlet } from "react-router-dom";
import { AdminProvider } from "./AdminContext.jsx";

const AdminLayout = () => {
    console.log("AdminLayout 렌더링");

    return (
        <AdminProvider>
            <Outlet />
        </AdminProvider>
    );
};

export default AdminLayout;
