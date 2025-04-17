import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const SortFilter = ({ sortType, setSortType }) => {
    const handleSort = (event, newSort) => {
        if (newSort !== null) {
            setSortType(newSort);
        }
    };

    return (
        <ToggleButtonGroup value={sortType} exclusive onChange={handleSort}>
            <ToggleButton value="rating">평점순</ToggleButton>
            <ToggleButton value="distance">거리순</ToggleButton>
        </ToggleButtonGroup>
    );
};

export default SortFilter;
