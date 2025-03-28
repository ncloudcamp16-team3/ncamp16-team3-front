import React from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import "../../css/App.css";
import { Outlet } from "react-router-dom";
//상단바, 하단바 있음
const Layout1 = () => {
    return (
        <div>
            <Header />
            <div className="back-view1">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default Layout1;
