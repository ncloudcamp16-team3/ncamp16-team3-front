import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";

const { kakao } = window;

const MapPreview = ({ latitude, longitude, mapId }) => {
    useEffect(() => {
        if (!kakao || !latitude || !longitude) return;

        const container = document.getElementById(mapId);
        const options = {
            center: new kakao.maps.LatLng(latitude, longitude),
            level: 3,
        };

        const map = new kakao.maps.Map(container, options);
        new kakao.maps.Marker({ map, position: options.center });
    }, [latitude, longitude, mapId]);

    return <div id={mapId} style={{ width: "100%", height: "150px", borderRadius: "8px" }} />;
};

const RenderMapAddress = ({ item }) => {
    if (!item?.address) return null;

    const mapId = `map-${item.id || item.title || Math.random()}`;

    return (
        <Box sx={{ mt: 1 }}>
            <MapPreview latitude={item.latitude} longitude={item.longitude} mapId={mapId} />
            <Typography sx={{ mt: 1 }}>
                <span style={{ color: "#A8A8A9" }}>장소 : </span>
                {item.address}
            </Typography>
        </Box>
    );
};

export default RenderMapAddress;
