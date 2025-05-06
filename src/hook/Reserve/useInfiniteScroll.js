import { useEffect } from "react";
import { throttle } from "lodash";

const useInfiniteScroll = (isLast, setPage) => {
    useEffect(() => {
        if (setPage === undefined || setPage === null) return;
        // 쓰로틀링을 사용하여 스크롤 이벤트 최적화
        const handleInfiniteScroll = throttle(() => {
            const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
            if (!isLast && isBottom) {
                setPage((prev) => prev + 1);
            }
        }, 200); // 200ms 간격으로 처리

        window.addEventListener("scroll", handleInfiniteScroll);

        return () => {
            window.removeEventListener("scroll", handleInfiniteScroll);
        };
    }, [isLast, setPage]);
};

export default useInfiniteScroll;
