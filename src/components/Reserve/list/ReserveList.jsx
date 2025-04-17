import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ReserveCard from "../card/ReserveCard";
import reserveData from "../../../mock/Reserve/reserve.json";
import "../../../css/reserve/list.css";

const ITEMS_PER_PAGE = 10;

const ReserveList = () => {
    const [visibleItems, setVisibleItems] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const loadItems = () => {
            const start = (page - 1) * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            const newItems = reserveData.slice(start, end);
            setVisibleItems((prev) => [...prev, ...newItems]);
        };
        loadItems();
    }, [page]);

    const handleScroll = () => {
        const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
        if (isBottom) {
            setPage((prev) => prev + 1);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <Box className="reserve-list card-wrapper">
            {visibleItems.map((item) => (
                <ReserveCard key={item.id} item={item} />
            ))}
        </Box>
    );
};

export default ReserveList;
