import React, { useContext, useEffect, useRef } from "react";
import { Box, Button, InputBase, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Mappin from "../../assets/images/PetMeeting/map-pin.svg";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";

const KakaoMap = ({ address, setAddress, setDongName, setModalMessage, setModalTitle }) => {
    const { pet } = useContext(PetMeetingContext);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const searchKeyword = useRef("");

    useEffect(() => {
        if (!window.kakao || !window.kakao.maps) return;

        const container = mapRef.current;

        const currentCenter = () => {
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
        };

        const initMap = (center) => {
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
        };

        if (pet?.owner?.address) {
            const ps = new window.kakao.maps.services.Places();

            ps.keywordSearch(pet?.owner?.address, function (data, status) {
                if (status === window.kakao.maps.services.Status.OK) {
                    const firstResult = data[0];
                    const lat = firstResult.y;
                    const lng = firstResult.x;

                    const center = new window.kakao.maps.LatLng(lat, lng);
                    alert(center);
                    initMap(center);
                    placeMarker(lat, lng);
                } else {
                    currentCenter();
                }
            });
        } else {
            currentCenter();
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
                setModalTitle(keyword);
                setModalMessage("검색 결과가 없습니다.");
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
            }
        });
    };

    return (
        <Box>
            <div ref={mapRef} style={{ width: "100%", height: "350px" }} />
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
