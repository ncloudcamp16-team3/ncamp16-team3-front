import { useState, useEffect } from "react";

// 커스텀 훅을 사용하여 위치 정보 받아오기
const useGeolocation = () => {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
        error: null,
    });

    useEffect(() => {
        const handleSuccess = (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude, error: null });
        };

        const handleError = (error) => {
            setLocation({ latitude: null, longitude: null, error: error.message });
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
        } else {
            setLocation({ latitude: null, longitude: null, error: "Geolocation not supported" });
        }

        // 컴포넌트가 unmount될 때 위치 정보 가져오는 작업을 정리
        return () => {
            setLocation({ latitude: null, longitude: null, error: null });
        };
    }, []);

    return location;
};

export default useGeolocation;
