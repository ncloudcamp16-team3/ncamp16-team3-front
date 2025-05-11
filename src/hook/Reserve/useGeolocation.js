import { useState, useEffect } from "react";

const useGeolocation = () => {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
        error: null,
    });

    useEffect(() => {
        // console.log("Geolocation hook 실행됨");

        if (!navigator.geolocation) {
            setLocation({ latitude: null, longitude: null, error: "Geolocation not supported" });
            return;
        }

        const handleSuccess = (position) => {
            const { latitude, longitude } = position.coords;
            // console.log("위치 성공:", latitude, longitude);
            setLocation({ latitude, longitude, error: null });
        };

        const handleError = (error) => {
            console.error("위치 실패:", error.message);
            setLocation({ latitude: null, longitude: null, error: error.message });
        };

        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        });
    }, []);

    return location;
};

export default useGeolocation;
