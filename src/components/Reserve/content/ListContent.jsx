import React, { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import FacilityCards from "./FacilityCards.jsx";
import { useReserveContext } from "../../../context/ReserveContext.jsx";
import useInfiniteScroll from "../../../hook/Reserve/useInfiniteScroll.js";
import useTodayTimer from "../../../hook/Reserve/useTodayTimer.js";
import useGeolocation from "../../../hook/Reserve/useGeolocation.js";
import { getFacilityListsToReserve } from "../../../services/reserveService.js";
import Loading from "../../Global/Loading.jsx";

const ListContent = () => {
    const {
        category,
        sortBy,
        data,
        setData,
        page,
        setPage,
        size,
        location,
        setLocation,
        noData,
        setNoData,
        last,
        setLast,
    } = useReserveContext();

    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    useInfiniteScroll(setPage);
    const today = useTodayTimer().locale("en").format("ddd");

    const geolocation = useGeolocation();

    useEffect(() => {
        if (geolocation.latitude && geolocation.longitude) {
            setLocation({ latitude: geolocation.latitude, longitude: geolocation.longitude });
        }
    }, [geolocation.latitude, geolocation.longitude]);

    useEffect(() => {
        const fetchFacilities = async () => {
            setLoading(true); // 로딩 시작
            setError(null); // 에러 초기화

            console.log(noData);
            console.log(last);
            try {
                if (noData || last) return;
                const result = await getFacilityListsToReserve({
                    category,
                    sortBy,
                    page,
                    size,
                    location, // location 객체 전달
                    today, // 오늘 날짜 전달
                });

                if (!result || !Array.isArray(result.content)) {
                    setError("서버 데이터 형식 오류");
                }

                if (result.content.length === 0 && page === 0) {
                    setNoData(true);
                } else {
                    setNoData(false);
                }
                const { content, last: isLast } = result;
                setLast(isLast);

                if (page === 0) {
                    setData(content); // 첫 페이지는 데이터 초기화
                } else {
                    setData((prev) => [...prev, ...content]); // 이후 페이지는 누적
                }
            } catch (err) {
                setError(err + "시설 목록을 불러오는 데 실패했습니다."); // 에러 처리
            } finally {
                setLoading(false); // 로딩 종료
            }
        };

        if (location.latitude && location.longitude) {
            fetchFacilities(); // 위치 정보가 있을 때만 데이터 가져오기
        }
    }, [page, sortBy, category, location]); // 의존성 배열에 필요한 값들 추가

    useEffect(() => {
        const interval = setInterval(() => {
            // console.log("[5초 주기] 현재 시설 데이터:", data);
            // console.log("geolocation latitude:", geolocation.latitude);
            // console.log("geolocation longitude:", geolocation.longitude);
        }, 3000);

        return () => clearInterval(interval); // 언마운트 시 인터벌 정리
    }, [data]);

    if (loading) {
        return (
            <Container
                sx={{ height: "calc(100vh - 250px)", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
                <Loading />
            </Container>
        );
    }
    if (error) {
        return (
            <Container
                sx={{ height: "calc(100vh - 250px)", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }
    return (
        <Container disableGutters sx={{ paddingTop: "160px" }}>
            {data.map((item) => (
                <FacilityCards key={item.id} item={item} />
            ))}
        </Container>
    );
};

export default ListContent;
