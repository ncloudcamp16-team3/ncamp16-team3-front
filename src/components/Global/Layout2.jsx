import React from "react";
import Footer from "./Footer.jsx";
import "../../css/App.css";
import { Outlet } from "react-router-dom";
import Container from "./Container.jsx";
// 하단바만 있음
const Layout1 = () => {
    return (
        <Container>
            <div className="back-view2">
                <Outlet />
            </div>
            <Footer />
        </Container>
    );
};

export default Layout1;
