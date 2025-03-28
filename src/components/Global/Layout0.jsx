import React from "react";
import "../../css/App.css";
import { Outlet } from "react-router-dom";
//상단바, 하단바 없음
const Layout0 = () => {
    return (
        <div>
            <div className="back-view0">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout0;
