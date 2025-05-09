import React from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import "../../css/App.css";
import { Outlet, useLocation } from "react-router-dom";
import Container from "./Container.jsx";

const Layout1 = () => {
    const location = useLocation();

    // 헤더 없이 보여야 할 경로들 정의
    const noHeaderRoutes = [/^\/petsta\/post\/\d+$/];

    const showHeader = !noHeaderRoutes.some((regex) => regex.test(location.pathname));
    const backViewClass = showHeader ? "back-view1" : "back-view2";

    return (
        <Container>
            {showHeader && <Header />}
            <div className={backViewClass}>
                <Outlet />
            </div>
            <Footer />
        </Container>
    );
};

export default Layout1;
