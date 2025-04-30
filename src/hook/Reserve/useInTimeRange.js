import { useState, useEffect } from "react";
import isInOpenTimeRange from "./isInOpenTimeRange"; // 공통 함수 import

const useInTimeRange = (timeRangeForWeek, today) => {
    const [isInRange, setIsInRange] = useState(false);

    useEffect(() => {
        if (!timeRangeForWeek) return;

        try {
            const isOpen = isInOpenTimeRange(timeRangeForWeek, today);
            setIsInRange(isOpen);
        } catch (error) {
            console.error("영업시간 판별 오류:", error);
            setIsInRange(false);
        }
    }, [timeRangeForWeek, today]);

    return isInRange;
};

export default useInTimeRange;
