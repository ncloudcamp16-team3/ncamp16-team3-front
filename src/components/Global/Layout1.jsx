import React from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import "../../css/App.css";
import { Outlet } from "react-router-dom";
import Container from "./Container.jsx";
//상단바, 하단바 있음
const Layout1 = () => {
    return (
        <Container>
            <Header />
            <div className="back-view1">
                <Outlet />
            </div>
            <Footer />
        </Container>
    );
};

export default Layout1;
