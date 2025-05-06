import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";

const ReserveMap = ({ lat, lng }) => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!lat || !lng) return;

        const checkKakaoMap = setInterval(() => {
            if (window.kakao && window.kakao.maps) {
                clearInterval(checkKakaoMap);

                const center = new window.kakao.maps.LatLng(lat, lng);
                initMap(center);
            }
        }, 300);

        return () => clearInterval(checkKakaoMap);
    }, [lat, lng]);

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

export default ReserveMap;
