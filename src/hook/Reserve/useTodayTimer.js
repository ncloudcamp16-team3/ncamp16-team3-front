import { useEffect, useState } from "react";
import dayjs from "dayjs";

const useTodayTimer = () => {
    const [today, setToday] = useState(dayjs());

    useEffect(() => {
        const interval = setInterval(() => {
            const now = dayjs();
            if (!now.isSame(today, "day")) {
                setToday(now);
            }
        }, 60 * 1000);

        return () => clearInterval(interval);
    }, [today]);

    return today;
};

export default useTodayTimer;