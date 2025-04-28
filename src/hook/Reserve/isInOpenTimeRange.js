import dayjs from "dayjs";

/**
 * 주어진 요일에 대한 영업시간을 비교하여 현재 시간이 포함되는지 확인
 * @param {Object} timeRangeForWeek - 요일: "HH:mm - HH:mm" 형식의 객체
 * @param {dayjs.Dayjs} today - dayjs 오늘 날짜 객체
 * @returns {boolean} isInRange - 현재 시간이 영업시간 내에 있는지 여부
 */
const isInOpenTimeRange = (timeRangeForWeek, today) => {
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const todayName = dayNames[today.day()];
    const todayRange = timeRangeForWeek[todayName];

    if (!todayRange) return false; // 오늘 영업시간이 없으면 휴무

    const [openStr, closeStr] = todayRange.split(" - ");
    const openTime = dayjs(`${today.format("YYYY-MM-DD")}T${openStr}`);
    const closeTime = dayjs(`${today.format("YYYY-MM-DD")}T${closeStr}`);

    return today.isAfter(openTime) && today.isBefore(closeTime);
};

export default isInOpenTimeRange;
