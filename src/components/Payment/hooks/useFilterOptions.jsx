import { useState } from "react";
import { formatDate } from "../utils/formatters.jsx";

export const useFilterOptions = () => {
    const today = formatDate(new Date());
    const [periodSelect, setPeriodSelect] = useState("15일");
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

    const handlePeriodChange = (period) => {
        setPeriodSelect(period);
    };

    const handleDateChange = (type, value) => {
        if (type === "start") {
            setStartDate(value);
        } else {
            setEndDate(value);
        }
    };

    const handleSearch = () => {
        console.log("Searching with:", { periodSelect, startDate, endDate });
    };

    return {
        periodSelect,
        startDate,
        endDate,
        handlePeriodChange,
        handleDateChange,
        handleSearch,
    };
};
