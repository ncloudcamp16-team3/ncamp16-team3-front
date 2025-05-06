import React, { useMemo } from "react";
import { Box, Button, Container, Divider } from "@mui/material";
import CategoryFilter from "../filter/CategoryFilter.jsx";
import SortFilter from "../filter/SortFilter.jsx";
import ListContent from "../content/ListContent.jsx";
import { useFacilityListContext, useReserveRouteContext } from "../../../context/ReserveContext.jsx";
import { getFacilityListToReserve } from "../../../services/reserveService.js";
import FacilityListItem from "../item/FacilityListItem.jsx";
import useGeolocation from "../../../hook/Reserve/useGeolocation.js";

const FacilityListView = () => {
    const { goTo } = useReserveRouteContext();
    const { page, setPage, size, sortBy, category } = useFacilityListContext();
    const { location, getLocation } = useGeolocation();

    // 의존성 배열에 넣을 값들을 개별 변수로 추출
    const apiDependencies = useMemo(() => {
        if (!location.isLoaded || location.latitude == null || location.longitude == null) return [];
        return [sortBy, category, page, location];
    }, [sortBy, category, page, location]);

    return (
        <Container sx={{ maxWidth: 500 }}>
            <Box
                sx={{
                    maxWidth: 500,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2,
                    position: "fixed",
                    top: 122,
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "white",
                    zIndex: 10,
                }}
            >
                <CategoryFilter />
                <Box my={2} sx={{ display: "flex", justifyContent: "row", pl: 2, pr: 2, gap: 31, mb: 0 }}>
                    <SortFilter />
                    <Button sx={{ bgcolor: "#FFF", borderRadius: 2 }} onClick={() => goTo("/reserve")}>
                        내 예약 목록
                    </Button>
                </Box>
                <Divider />
            </Box>

            {!location.isLoaded || location.latitude == null || location.longitude == null ? (
                <Box textAlign="center" mt={4}>
                    위치 정보를 가져오는 중입니다...
                </Box>
            ) : location.error ? (
                <Box textAlign="center" mt={4} color="error.main">
                    위치 정보 오류: {location.error}
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Button variant="text" color="primary" onClick={() => setPage(0)} size="small">
                            새로고침
                        </Button>
                    </Box>
                </Box>
            ) : (
                <ListContent
                    apiFn={getFacilityListToReserve}
                    params={{
                        page,
                        size,
                        category,
                        sortBy,
                        setPage,
                        location,
                    }}
                    deps={apiDependencies}
                    isList={true}
                    noDataComment={"조건에 맞는 시설을 찾을 수 없습니다."}
                    itemComponent={FacilityListItem}
                />
            )}
        </Container>
    );
};

export default FacilityListView;
