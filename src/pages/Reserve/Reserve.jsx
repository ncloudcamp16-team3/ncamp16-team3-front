import React, { useState } from "react";
import CategoryTabs from "../../components/Reserve/tabs/CategoryTabs";
import SortFilter from "../../components/Reserve/filter/SortFilter";
import ReserveList from "../../components/Reserve/list/ReserveList";
import ReserveMap from "../../components/Reserve/map/ReserveMap";
import useReserveFilter from "../../components/Reserve/hooks/useReserveFilter";
import data from "../../mock/Reserve/reserve.json";
import { Box, Container } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const Reserve = () => {
    const [category, setCategory] = useState("호텔");
    const [sortType, setSortType] = useState("rating");
    const filteredData = useReserveFilter(data, category, sortType);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container>
                <CategoryTabs category={category} setCategory={setCategory} />
                <Box my={2}>
                    <SortFilter sortType={sortType} setSortType={setSortType} />
                </Box>
                <ReserveList data={filteredData} />
                <Box mt={4}>
                    <ReserveMap data={filteredData} />
                </Box>
            </Container>
        </LocalizationProvider>
    );
};

export default Reserve;
