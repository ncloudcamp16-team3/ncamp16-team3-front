import React from "react";
import { Tabs, Tab } from "@mui/material";
import { useReserveContext } from "../../../context/ReserveContext.jsx";

const CategoryFilter = () => {
    const { category, setCategory, setPage, setNoData, setLast } = useReserveContext();

    const handleChange = (event, newValue) => {
        setCategory(newValue);
        setPage(0); // 페이지 초기화
        setNoData(false); // 데이터 초기화
        setLast(false); // 마지막 페이지 여부 초기화
    };

    return (
        <Tabs value={category} onChange={handleChange} centered>
            <Tab label="호텔" value="HOTEL" />
            <Tab label="미용실" value="BEAUTY" />
            <Tab label="애견 카페" value="CAFE" />
        </Tabs>
    );
};

export default CategoryFilter;
