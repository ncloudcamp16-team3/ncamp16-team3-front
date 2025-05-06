export const generateTimeOptions = (openTime, closeTime) => {
    // 기본: 00:00 ~ 23:00 객체 배열
    const defaultTimes = Array.from({ length: 24 }, (_, hour) => {
        const label = hour.toString().padStart(2, "0") + ":00";
        return { label, value: label };
    });

    if (!openTime || !closeTime) return defaultTimes;

    try {
        const [startHour, startMinute] = openTime.split(":").map(Number);
        const [endHour, endMinute] = closeTime.split(":").map(Number);

        let start = startHour;
        let end = endHour;

        if (end < start || (end === start && endMinute <= startMinute)) {
            end += 24; // 자정 넘김
        }

        const timeOptions = [];

        for (let hour = start; hour <= end; hour++) {
            const displayHour = hour % 24;
            const timeStr = displayHour.toString().padStart(2, "0") + ":00";
            timeOptions.push({ label: timeStr, value: timeStr });
        }

        return timeOptions;
    } catch (e) {
        console.error("시간 파싱 오류:", e);
        return defaultTimes;
    }
};
