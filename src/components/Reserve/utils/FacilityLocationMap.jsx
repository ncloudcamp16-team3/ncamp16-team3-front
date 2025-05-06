import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";

const FacilityLocationMap = ({ latitude, longitude }) => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!latitude || !longitude) return;

        const checkKakaoMap = setInterval(() => {
            if (window.kakao && window.kakao.maps) {
                clearInterval(checkKakaoMap);

                const center = new window.kakao.maps.LatLng(latitude, longitude);
                initMap(center);
            }
        }, 300);

        return () => clearInterval(checkKakaoMap);
    }, [latitude, longitude]);

    const initMap = (center) => {
        const container = mapRef.current;
        const options = {
            center,
            level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);
        mapInstanceRef.current = map;

        placeMarker(center);
    };

    const placeMarker = (position) => {
        const map = mapInstanceRef.current;
        if (!map) return;

        if (markerRef.current) {
            markerRef.current.setMap(null);
        }

        const marker = new window.kakao.maps.Marker({
            position,
            map,
        });

        markerRef.current = marker;
    };

    return (
        <Box>
            <div ref={mapRef} style={{ width: "100%", height: "350px" }} />
        </Box>
    );
};

export default FacilityLocationMap;
