import { useState, useEffect } from "react";
import dayjs from "dayjs";

// 요일 문자열을 숫자로 매핑
const dayMap = {
    일: 0,
    월: 1,
    화: 2,
    수: 3,
    목: 4,
    금: 5,
    토: 6,
};

/**
 * 문자열로 주어진 요일+시간 범위 안에 현재 시간이 포함되는지 확인
 * @param {string} openTimeRange 요일+시간 범위 문자열. 예: "화–일 09:00 - 18:00"
 * @returns {boolean} isInRange
 */
const useInTimeRange = (openTimeRange) => {
    const [isInRange, setIsInRange] = useState(false);

    useEffect(() => {
        if (!openTimeRange) return;

        try {
            const dayPart = openTimeRange[0];
            const startTimeStr = openTimeRange[1];
            const endTimeStr = openTimeRange[2];

            let startDay, endDay;

            if (dayPart.includes("매일")) {
                startDay = 0;
                endDay = 6;
            } else {
                const [startDayStr, endDayStr] = dayPart.split("–");
                startDay = dayMap[startDayStr];
                endDay = dayMap[endDayStr];
            }

            const now = dayjs();
            const currentDay = now.day();
            const currentTime = now.hour() + now.minute() / 60;

            // 유효한 요일 목록 계산
            let validDays = [];
            if (startDay <= endDay) {
                validDays = Array.from({ length: endDay - startDay + 1 }, (_, i) => startDay + i);
            } else {
                // 요일이 순환되는 경우 (예: 금–월)
                validDays = [
                    ...Array.from({ length: 7 - startDay }, (_, i) => startDay + i),
                    ...Array.from({ length: endDay + 1 }, (_, i) => i),
                ];
            }
            // console.log("오픈시간: " + startTimeStr);
            // console.log("마감시간: " + endTimeStr);

            // 시간 계산
            const [startHour, startMin] = startTimeStr.split(":").map(Number);
            const [endHour, endMin] = endTimeStr.split(":").map(Number);
            const startTime = startHour + startMin / 60;
            const endTime = endHour + endMin / 60;

            // 포함 여부 확인
            const isValidDay = validDays.includes(currentDay);
            const isValidTime = currentTime >= startTime && currentTime < endTime;

            setIsInRange(isValidDay && isValidTime);
        } catch (error) {
            console.error("시간 범위 파싱 오류:", error);
            setIsInRange(false);
        }
    }, [openTimeRange]);

    return isInRange;
};

export default useInTimeRange;
