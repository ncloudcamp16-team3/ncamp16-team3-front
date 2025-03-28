import React from "react";
import "../../css/App.css"; // 파일 경로를 정확하게 지정

const Container = ({ children }) => {
    return <div className="mobile-view">{children}</div>;
};

export default Container;
