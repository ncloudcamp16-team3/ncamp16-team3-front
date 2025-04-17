import React from "react";
import { Tabs, Tab } from "@mui/material";

const CategoryTabs = ({ category, setCategory }) => {
    const handleChange = (event, newValue) => {
        setCategory(newValue);
    };

    return (
        <Tabs value={category} onChange={handleChange} centered>
            <Tab label="호텔" value="호텔" />
            <Tab label="미용실" value="미용실" />
            <Tab label="애견 카페" value="애견 카페" />
        </Tabs>
    );
};

export default CategoryTabs;
