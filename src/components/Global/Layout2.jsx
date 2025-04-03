import React from "react";
import Footer from "./Footer.jsx";
import "../../css/App.css";
import { Outlet } from "react-router-dom";
// 하단바만 있음
const Layout1 = () => {
    return (
        <div>
            <div className="back-view2">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default Layout1;
