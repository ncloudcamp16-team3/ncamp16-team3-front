import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("ko");

export const useFilterOptions = () => {
    const today = dayjs().tz("Asia/Seoul").format("YYYY-MM-DD");

    const [periodSelect, setPeriodSelect] = useState(null);
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

    const handlePeriodChange = (period) => {
        setPeriodSelect(period);
        const todayObj = dayjs().tz("Asia/Seoul");
        const today = todayObj.format("YYYY-MM-DD");

        let newStartDate;

        if (period === "15일") {
            newStartDate = todayObj.subtract(15, "day").format("YYYY-MM-DD");
        } else if (period === "1개월") {
            newStartDate = todayObj.subtract(1, "month").format("YYYY-MM-DD");
        } else if (period === "3개월") {
            newStartDate = todayObj.subtract(3, "month").format("YYYY-MM-DD");
        } else {
            return;
        }

        setStartDate(newStartDate);
        setEndDate(today);

        console.log(`${newStartDate}일 부터 ${today}일까지의 데이터를 가져옵니다.`);
    };

    const handleDateChange = (type, value) => {
        let newStartDate = startDate;
        let newEndDate = endDate;

        if (type === "start") {
            newStartDate = value;
            setStartDate(value);
        } else {
            newEndDate = value;
            setEndDate(value);
        }

        // 날짜 차이 계산 후 자동 해제 로직
        const start = dayjs(newStartDate);
        const end = dayjs(newEndDate);

        if (periodSelect === "15일") {
            if (!start.isSame(end.subtract(15, "day"), "day")) {
                setPeriodSelect(null);
            }
        } else if (periodSelect === "1개월") {
            if (!start.isSame(end.subtract(1, "month"), "day")) {
                setPeriodSelect(null);
            }
        } else if (periodSelect === "3개월") {
            if (!start.isSame(end.subtract(3, "month"), "day")) {
                setPeriodSelect(null);
            }
        }
    };

    const handleSearch = () => {
        console.log(`${startDate}일 부터 ${endDate}일까지의 데이터를 가져옵니다.`);
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
