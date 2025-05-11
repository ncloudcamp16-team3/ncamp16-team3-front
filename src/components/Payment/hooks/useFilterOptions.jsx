import dayjs from "dayjs";
import { useState } from "react";

export const useFilterOptions = () => {
    const today = dayjs().tz("Asia/Seoul").format("YYYY-MM-DD");

    const [periodSelect, setPeriodSelect] = useState(null);
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [searchTrigger, setSearchTrigger] = useState(0); // ✅ 추가

    const handlePeriodChange = (period) => {
        /* 그대로 */
    };
    const handleDateChange = (type, value) => {
        /* 그대로 */
    };

    const handleSearch = () => {
        // console.log(`${startDate} ~ ${endDate} 검색`);
        setSearchTrigger((prev) => prev + 1); // ✅ 여기에 포함
    };

    return {
        periodSelect,
        startDate,
        endDate,
        searchTrigger, // ✅ 함께 반환
        handlePeriodChange,
        handleDateChange,
        handleSearch,
    };
};
