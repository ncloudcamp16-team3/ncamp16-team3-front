import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useFacilityListContext } from "../../../context/ReserveContext.jsx";

const SortFilter = () => {
    const { sortBy, setSortBy } = useFacilityListContext();

    const handleSort = (event, newSort) => {
        setSortBy(newSort);
    };

    return (
        <ToggleButtonGroup value={sortBy} exclusive onChange={handleSort}>
            <ToggleButton value="starPoint">평점순</ToggleButton>
            <ToggleButton value="distance">거리순</ToggleButton>
        </ToggleButtonGroup>
    );
};

export default SortFilter;
