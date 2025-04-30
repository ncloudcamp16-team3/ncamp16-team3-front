import isInOpenTimeRange from "./isInOpenTimeRange"; // 공통 함수 import

const getOpenTime = (timeRangeForWeek, today) => {
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const todayName = dayNames[today.day()];
    const todayRange = timeRangeForWeek[todayName];

    if (todayRange && isInOpenTimeRange(timeRangeForWeek, today)) {
        return `오늘(${todayName}) 영업시간: ${todayRange}`;
    }

    // 다음 오픈 요일 탐색
    for (let i = 1; i <= 7; i++) {
        const future = today.add(i, "day");
        const futureName = dayNames[future.day()];
        const futureRange = timeRangeForWeek[futureName];

        if (futureRange) {
            const label = i === 1 ? "내일" : i === 2 ? "모레" : `다음 주(${futureName})`;

            return `${label}(${futureName}) 영업시간: ${futureRange}`;
        }
    }

    return "휴무";
};

export default getOpenTime;
