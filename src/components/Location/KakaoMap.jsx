import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, InputBase, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Mappin from "../../assets/images/PetMeeting/map-pin.svg";
import myLocation from "../../assets/images/PetMeeting/myLocation.png";
import { Context } from "../../context/Context.jsx";

const KakaoMap = ({ address, setAddress, setDongName, setLatitude, setLongitude }) => {
    const { showModal, user } = useContext(Context);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const searchKeyword = useRef("");
    const [sdkLoaded, setSdkLoaded] = useState(false);

    // 1. Kakao SDK 비동기 로딩
    useEffect(() => {
        if (window.kakao && window.kakao.maps) {
            setSdkLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_KEY&libraries=services`;
        script.async = true;
        script.onload = () => {
            setSdkLoaded(true);
        };
        document.head.appendChild(script);
    }, []);

    // 2. SDK 로딩 완료 후 지도 초기화
    useEffect(() => {
        if (!sdkLoaded) return;

        const initMap = (center) => {
            const options = {
                center,
                level: 3,
            };

            const map = new window.kakao.maps.Map(mapRef.current, options);
            mapInstanceRef.current = map;

            window.kakao.maps.event.addListener(map, "click", (mouseEvent) => {
                const latlng = mouseEvent.latLng;
                placeMarker(latlng.getLat(), latlng.getLng());
            });
        };

        if (user?.latitude && user.longitude) {
            const center = new window.kakao.maps.LatLng(user.latitude, user.longitude);
            initMap(center);
            placeMarker(user.latitude, user.longitude);
        } else {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const center = new window.kakao.maps.LatLng(latitude, longitude);
                    initMap(center);
                    placeMarker(latitude, longitude);
                },
                () => {
                    const fallback = new window.kakao.maps.LatLng(37.5665, 126.978);
                    initMap(fallback);
                },
                { timeout: 5000 } // ⏱️ 위치 허용 대기 제한
            );
        }
    }, [sdkLoaded]);

    const searchAndMove = () => {
        const keyword = searchKeyword.current;
        const ps = new window.kakao.maps.services.Places();
        ps.keywordSearch(keyword, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const first = data[0];
                const lat = parseFloat(first.y);
                const lng = parseFloat(first.x);
                const newPos = new window.kakao.maps.LatLng(lat, lng);
                mapInstanceRef.current.setCenter(newPos);
                placeMarker(lat, lng);
            } else {
                showModal(keyword, "검색 결과가 없습니다.");
            }
        });
    };

    const placeMarker = (lat, lng) => {
        const map = mapInstanceRef.current;
        if (!map) return;

        if (markerRef.current) markerRef.current.setMap(null);

        const pos = new window.kakao.maps.LatLng(lat, lng);
        const marker = new window.kakao.maps.Marker({ position: pos, map });
        markerRef.current = marker;

        // 주소 역변환은 약간 지연 (모바일 속도 보완)
        setTimeout(() => {
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.coord2Address(lng, lat, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK && result[0]) {
                    const addr = result[0].address.address_name;
                    const dong = result[0].address.region_3depth_name;
                    setAddress(addr);
                    setDongName(dong);
                    setLatitude(lat);
                    setLongitude(lng);
                }
            });
        }, 100);
    };

    const currentCenter = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const center = new window.kakao.maps.LatLng(lat, lng);
            mapInstanceRef.current.panTo(center);
            placeMarker(lat, lng);
        });
    };

    return (
        <Box>
            <div ref={mapRef} style={{ width: "100%", height: "350px", position: "relative" }}>
                <Box
                    onClick={currentCenter}
                    sx={{
                        position: "absolute",
                        bottom: "10px",
                        right: "10px",
                        zIndex: 9999,
                        backgroundColor: "white",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                    }}
                >
                    <Box component="img" src={myLocation} sx={{ width: "20px", height: "20px" }} />
                </Box>
            </div>

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
                        px: 2,
                        py: 0.5,
                        width: "90%",
                        m: 2,
                        justifyContent: "space-between",
                        position: "relative",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                        <SearchIcon sx={{ color: "#000", mr: 1 }} />
                        <InputBase
                            placeholder="장소 검색"
                            sx={{ color: "black", flex: 1 }}
                            onKeyDown={(e) => e.key === "Enter" && searchAndMove()}
                            onChange={(e) => (searchKeyword.current = e.target.value)}
                        />
                        <Button
                            onClick={searchAndMove}
                            sx={{
                                position: "absolute",
                                right: 0,
                                top: "50%",
                                transform: "translateY(-50%)",
                                borderRadius: "30px",
                                backgroundColor: "#E9A260",
                                color: "white",
                                px: 2,
                                minWidth: "unset",
                                width: "80px",
                                height: "100%",
                            }}
                        >
                            검색
                        </Button>
                    </Box>
                </Box>
            </Box>

            {address && (
                <Box sx={{ display: "flex", m: "0 16px 16px 16px" }}>
                    <Box component="img" src={Mappin}></Box>
                    <Typography sx={{ m: "0 5px", fontSize: "20px" }}>{address}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default KakaoMap;
