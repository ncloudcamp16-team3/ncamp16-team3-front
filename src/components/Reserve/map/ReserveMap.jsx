import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import Mappin from "../../../assets/images/Reserve/map-pin.svg";

const ReserveMap = ({ address, setAddress }) => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        // 카카오맵 API가 로드되었는지 확인
        const checkKakaoMap = setInterval(() => {
            if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
                clearInterval(checkKakaoMap);

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
            }
        }, 300);

        // 컴포넌트 언마운트 시 인터벌 정리
        return () => clearInterval(checkKakaoMap);
    }, []);

    // 주소가 변경될 때 해당 주소로 지도 이동
    useEffect(() => {
        if (address && window.kakao && window.kakao.maps && mapInstanceRef.current) {
            searchAndMove(address);
        }
    }, [address, mapInstanceRef.current]);

    const initMap = (center) => {
        const container = mapRef.current;
        const options = {
            center,
            level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);
        mapInstanceRef.current = map;

        window.kakao.maps.event.addListener(map, "click", function (mouseEvent) {
            const latlng = mouseEvent.latLng;
            placeMarker(latlng.getLat(), latlng.getLng());
        });

        // 초기 주소가 있으면 해당 위치로 이동
        if (address) {
            searchAndMove(address);
        }
    };

    const searchAndMove = (keyword) => {
        if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
            console.error("카카오맵 API가 로드되지 않았습니다.");
            return;
        }

        const ps = new window.kakao.maps.services.Places();

        ps.keywordSearch(keyword, function (data, status) {
            if (status === window.kakao.maps.services.Status.OK) {
                const firstResult = data[0];
                const lat = firstResult.y;
                const lng = firstResult.x;

                const newPosition = new window.kakao.maps.LatLng(lat, lng);
                mapInstanceRef.current.setCenter(newPosition);

                placeMarker(lat, lng);
            } else {
                console.warn("검색 결과가 없습니다:", keyword);
            }
        });
    };

    const placeMarker = (lat, lng) => {
        const map = mapInstanceRef.current;

        if (!map) return;

        if (markerRef.current) {
            markerRef.current.setMap(null);
        }

        const newPosition = new window.kakao.maps.LatLng(lat, lng);
        const marker = new window.kakao.maps.Marker({
            position: newPosition,
            map: map,
        });

        markerRef.current = marker;

        // 주소 정보 가져오기 (역지오코딩)
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2Address(lng, lat, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK && result[0]) {
                const addressResult = result[0].address.address_name;
                if (setAddress && typeof setAddress === "function") {
                    setAddress(addressResult);
                }
            }
        });
    };

    return (
        <Box>
            <div ref={mapRef} style={{ width: "100%", height: "350px" }} />
            {address && (
                <Box
                    sx={{
                        display: "flex",
                        m: "0 16px 16px 16px",
                        alignItems: "center",
                    }}
                >
                    <Box component="img" src={Mappin} alt="위치 마커" />
                    <Typography component="div" sx={{ m: "0 5px", fontSize: "20px" }}>
                        {address}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default ReserveMap;
