import React, { useEffect, useRef } from "react";
import { Box, InputBase, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Mappin from "../../assets/images/PetMeeting/map-pin.svg";

const KakaoMap = ({ address, setAddress, setDongName }) => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!window.kakao || !window.kakao.maps) return;

        const container = mapRef.current;

        // 현재 위치 가져오기
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const center = new window.kakao.maps.LatLng(lat, lng);

                initMap(center);
            },
            () => {
                const fallbackCenter = new window.kakao.maps.LatLng(37.5665, 126.978);
                initMap(fallbackCenter);
            }
        );

        const initMap = (center) => {
            const options = {
                center,
                level: 3,
            };

            const map = new window.kakao.maps.Map(container, options);
            mapInstanceRef.current = map;

            // 클릭 이벤트 등록
            window.kakao.maps.event.addListener(map, "click", function (mouseEvent) {
                const latlng = mouseEvent.latLng;

                // 기존 마커 제거
                if (markerRef.current) {
                    markerRef.current.setMap(null);
                }

                // 새 마커 생성
                const marker = new window.kakao.maps.Marker({
                    position: latlng,
                });

                marker.setMap(map);
                markerRef.current = marker;
            });
        };
    }, []);

    const searchAndMove = (keyword) => {
        const ps = new window.kakao.maps.services.Places();

        ps.keywordSearch(keyword, function (data, status) {
            if (status === window.kakao.maps.services.Status.OK) {
                const firstResult = data[0];
                const lat = firstResult.y;
                const lng = firstResult.x;
                const newPosition = new window.kakao.maps.LatLng(lat, lng);

                mapInstanceRef.current.setCenter(newPosition);
            } else {
                alert("검색 결과가 없습니다.");
            }
        });
    };

    return (
        <Box>
            <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#ddd",
                        borderRadius: "30px",
                        paddingX: 2,
                        paddingY: 0.5,
                        width: "90%",
                        p: "10px",
                        m: 2,
                    }}
                >
                    <SearchIcon sx={{ color: "#000", m: "0 10px" }} />
                    <InputBase
                        placeholder="장소 검색"
                        sx={{
                            color: "black",
                            "& input": {
                                padding: 0,
                            },
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                searchAndMove(e.target.value);
                            }
                        }}
                    />
                </Box>
            </Box>
            {address && (
                <Box
                    sx={{
                        display: "flex",
                        m: "0 16px 16px 16px",
                    }}
                >
                    <Box component="img" src={Mappin}></Box>
                    <Typography sx={{ m: "0 5px", fontSize: "20px" }}>{address}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default KakaoMap;
