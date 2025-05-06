export const getAvailableEndTimes = (startTime, timeOptions) => {
    if (!startTime || !Array.isArray(timeOptions)) return timeOptions;

    const startHour = parseInt(startTime.split(":")[0], 10);

    return timeOptions.filter(({ value }) => {
        const hour = parseInt(value.split(":")[0], 10);

        // 자정 넘김 고려: 예) 22시 이후 → 01시는 선택 가능
        if (startHour >= 20 && hour < 12) return true;

        return hour > startHour;
    });
};
