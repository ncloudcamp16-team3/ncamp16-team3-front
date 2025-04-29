import React, { useContext, useEffect, useRef } from "react";
import { Box, Button, InputBase, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Mappin from "../../assets/images/PetMeeting/map-pin.svg";
import { Context } from "../../context/Context.jsx";

const KakaoMap = ({ address, setAddress, setDongName, setLatitude, setLongitude }) => {
    const { showModal, user } = useContext(Context);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const searchKeyword = useRef("");

    useEffect(() => {
        if (!window.kakao || !window.kakao.maps) return;

        const initMap = (center) => {
            const options = {
                center,
                level: 3,
            };

            const map = new window.kakao.maps.Map(mapRef.current, options);
            mapInstanceRef.current = map;

            window.kakao.maps.event.addListener(map, "click", function (mouseEvent) {
                const latlng = mouseEvent.latLng;

                placeMarker(latlng.getLat(), latlng.getLng());
            });
        };

        if (user?.latitude && user.longitude) {
            const center = new window.kakao.maps.LatLng(user?.latitude, user.longitude);

            initMap(center);
            placeMarker(user?.latitude, user.longitude);
        } else {
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
    }, []);

    const searchAndMove = () => {
        const keyword = searchKeyword.current;

        addressToMarker(keyword);
    };

    const addressToMarker = (keyword) => {
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
                showModal(keyword, "검색 결과가 없습니다.");
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

        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2Address(lng, lat, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK && result[0]) {
                const address = result[0].address.address_name;
                const dong = result[0].address.region_3depth_name;

                setAddress(address);
                setDongName(dong);
                setLatitude(lat);
                setLongitude(lng);
            }
        });
    };

    const currentCenter = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const center = new window.kakao.maps.LatLng(lat, lng);
            mapInstanceRef.current.panTo(center);

            placeMarker(lat, lng);
        });
    };

    return (
        <Box>
            <div ref={mapRef} style={{ width: "100%", height: "350px" }}>
                <Box
                    onClick={currentCenter}
                    sx={{
                        position: "absolute",
                        display: "flex",
                        bottom: "10px",
                        right: "10px",
                        zIndex: 9999,
                        backgroundColor: "white",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                    }}
                >
                    <Box
                        component="img"
                        src="/mock/PetMeeting/images/myLocation.png"
                        sx={{
                            width: "20px",
                            height: "20px",
                        }}
                    />
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
                        paddingX: 2,
                        paddingY: 0.5,
                        width: "90%",
                        p: "10px",
                        m: 2,
                        justifyContent: "space-between",
                        position: "relative",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
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
                                    searchAndMove();
                                }
                            }}
                            onChange={(e) => {
                                searchKeyword.current = e.target.value;
                            }}
                        />
                    </Box>
                    <Button
                        onClick={() => searchAndMove()}
                        sx={{
                            position: "absolute",
                            right: "0",
                            top: "50%",
                            transform: "translateY(-50%)",
                            height: "100%",
                            borderRadius: "30px",
                            backgroundColor: "#E9A260",
                            color: "white",
                            px: 2,
                            minWidth: "unset",
                            width: "100px",
                        }}
                    >
                        검색
                    </Button>
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
