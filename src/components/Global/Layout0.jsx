import React from "react";
import "../../css/App.css";
import { Outlet } from "react-router-dom";
import Container from "./Container.jsx";
//상단바, 하단바 없음
const Layout0 = () => {
    return (
        <Container>
            <div className="back-view0">
                <Outlet />
            </div>
        </Container>
    );
};

export default Layout0;
