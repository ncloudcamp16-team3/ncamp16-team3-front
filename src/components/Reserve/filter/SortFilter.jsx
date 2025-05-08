import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useReserveContext } from "../../../context/ReserveContext.jsx";

const SortFilter = () => {
    const { sortBy, setSortBy, setPage, setNoData, setLast } = useReserveContext();

    const handleSort = (event, newSort) => {
        if (newSort !== null) {
            setSortBy(newSort);
            setPage(0); // 페이지 초기화
            setNoData(false);
            setLast(false);
        }
    };

    return (
        <ToggleButtonGroup sx={{ minWidth: 120 }} value={sortBy} exclusive onChange={handleSort}>
            <ToggleButton value="starPoint">평점순</ToggleButton>
            <ToggleButton value="distance">거리순</ToggleButton>
        </ToggleButtonGroup>
    );
};

export default SortFilter;
