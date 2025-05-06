import { useEffect } from "react";
import { useFacilityListContext } from "../../context/ReserveContext.jsx";
import { useLocation } from "react-router-dom";

const useScrollRestore = () => {
    const { pathname } = useLocation();
    const { setScrollY, getScrollY } = useFacilityListContext();

    useEffect(() => {
        // 페이지 진입 시 스크롤 위치 복원
        const savedY = getScrollY(pathname);
        window.scrollTo(0, savedY);

        // 스크롤 이벤트 핸들러
        const handleScroll = () => {
            setScrollY(pathname, window.scrollY);
        };

        // 스크롤 이벤트 등록
        window.addEventListener("scroll", handleScroll);

        // 컴포넌트 언마운트 시 스크롤 이벤트 제거
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [pathname, getScrollY, setScrollY]); // 의존성에 getScrollY와 setScrollY 추가
};

export default useScrollRestore;
