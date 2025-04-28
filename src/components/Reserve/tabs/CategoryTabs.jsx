import React from "react";
import { Tabs, Tab } from "@mui/material";
import { useReserveContext } from "../../../context/ReserveContext.jsx";

const CategoryTabs = () => {
    const { category, setCategory, setPage } = useReserveContext();

    const handleChange = (event, newValue) => {
        setCategory(newValue);
        setPage(1); // 페이지 초기화
    };

    return (
        <Tabs value={category} onChange={handleChange} centered>
            <Tab label="호텔" value="HOTEL" />
            <Tab label="미용실" value="SALON" />
            <Tab label="애견 카페" value="CAFE" />
        </Tabs>
    );
};

export default CategoryTabs;
