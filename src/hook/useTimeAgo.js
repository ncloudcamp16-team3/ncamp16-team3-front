import { useEffect, useState } from "react";

const getTimeAgoString = (dateString) => {
    const targetDate = new Date(dateString);
    const currentDate = new Date();
    let timeDifference = currentDate - targetDate;

    if (timeDifference < 0) timeDifference = 0;

    const seconds = Math.floor(timeDifference / 1000);
    if (seconds < 60) return `방금 전`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}분 전`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}일 전`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months}개월 전`;

    const years = Math.floor(months / 12);
    return `${years}년 전`;
};

const useTimeAgo = (dateString) => {
    const [timeAgo, setTimeAgo] = useState(() => getTimeAgoString(dateString));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeAgo(getTimeAgoString(dateString));
        }, 60 * 1000);

        return () => clearInterval(interval);
    }, [dateString]);

    return timeAgo;
};

export default useTimeAgo;
