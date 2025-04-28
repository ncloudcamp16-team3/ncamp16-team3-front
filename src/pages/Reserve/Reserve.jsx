import React, { useEffect, useState } from "react";
import CategoryTabs from "../../components/Reserve/tabs/CategoryTabs";
import SortFilter from "../../components/Reserve/filter/SortFilter";
import ReserveList from "../../components/Reserve/list/ReserveList";
import { Box, Button, CircularProgress, Container, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useNavigate } from "react-router-dom";
import { ReserveProvider, useReserveContext } from "../../context/ReserveContext";
import useScrollRestore from "../../hook/Reserve/useScrollRestore.js";
import useInfiniteScroll from "../../hook/Reserve/useInfiniteScroll.js";
import useGeolocation from "../../hook/Reserve/useGeolocation.js";
import useTodayTimer from "../../hook/Reserve/useTodayTimer.js";
import { getFacilityListsToReserve } from "../../services/reserveService.js";

const ReserveContent = () => {
    const {
        category,
        setCategory,
        sortBy,
        setSortBy,
        data,
        setData,
        page,
        setPage,
        size,
        setSize,
        getScrollY,
        setScrollY,
        location,
        setLocation,
    } = useReserveContext();

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    useScrollRestore(getScrollY, setScrollY);
    useInfiniteScroll(setPage);
    const today = useTodayTimer();

    const { latitude, longitude } = useGeolocation();

    useEffect(() => {
        if (latitude && longitude) {
            setLocation({ latitude, longitude });
        }
    }, [latitude, longitude, setLocation]);

    useEffect(() => {
        const fetchFacilities = async () => {
            setLoading(true); // 로딩 시작
            setError(null); // 에러 초기화
            try {
                const result = await getFacilityListsToReserve({
                    category,
                    sortBy,
                    page,
                    size,
                    location, // location 객체 전달
                    today, // 오늘 날짜 전달
                });
                if (page === 1) {
                    console.log(result);
                    console.log(result.content);
                    console.log(result.facilityCard);
                    setData(result.content); // 첫 페이지는 데이터 초기화
                } else {
                    setData((prev) => [...prev, ...result.content]); // 이후 페이지는 누적
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
    }, [page, size, sortBy, category, location, setData]); // 의존성 배열에 필요한 값들 추가

    // 로딩 상태 처리
    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    // 에러 처리
    if (error) {
        return (
            <Container>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container>
            <CategoryTabs category={category} setCategory={setCategory} />
            <Box my={2} sx={{ display: "flex", justifyContent: "space-between" }}>
                <SortFilter sortBy={sortBy} setSortBy={setSortBy} />
                <Button sx={{ bgcolor: "#FFF", borderRadius: 2 }} onClick={() => navigate("/reserve/list")}>
                    내 예약 목록
                </Button>
            </Box>
            <ReserveList
                data={data}
                setData={setData}
                page={page}
                setPage={setPage}
                size={size}
                setSize={setSize}
                location={location}
            />
        </Container>
    );
};

const Reserve = () => (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ReserveProvider>
            <ReserveContent />
        </ReserveProvider>
    </LocalizationProvider>
);

export default Reserve;
