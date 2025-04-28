import React from "react";
import { Box } from "@mui/material";
import ReserveCard from "../card/ReserveCard";
import "../../../css/reserve/list.css";
import { useReserveContext } from "../../../context/ReserveContext.jsx";

const ReserveList = () => {
    const { data } = useReserveContext();

    return (
        <Box className="reserve-list card-wrapper">
            {data.map((item) => (
                <ReserveCard key={item.id} item={item} />
            ))}
        </Box>
    );
};

export default ReserveList;
