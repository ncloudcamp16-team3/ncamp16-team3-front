import React from "react";
import { Tabs, Tab } from "@mui/material";
import { useFacilityListContext } from "../../../context/ReserveContext.jsx";

const CategoryFilter = () => {
    const { category, setCategory } = useFacilityListContext();

    const handleChange = (event, newValue) => {
        setCategory(newValue);
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
