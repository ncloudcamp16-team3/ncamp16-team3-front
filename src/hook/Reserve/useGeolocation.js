import { useState, useEffect } from "react";

const useGeolocation = () => {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
        error: null,
        isLoaded: false,
        permission: null, // 'granted'(허용됨) | 'prompt'(요청됨) | 'denied'(거부됨) | null
    });

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
        } else {
            setLocation({
                ...location,
                error: "위치 정보 사용이 지원되지 않는 브라우저이므로 시설 안내 및 예약 서비스를 이용할 수 없습니다.",
                isLoaded: true,
            });
        }
    };

    const handleSuccess = (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
            latitude,
            longitude,
            error: null,
            isLoaded: true,
            permission: "granted",
        });
    };

    const handleError = (error) => {
        setLocation({
            latitude: null,
            longitude: null,
            error: error.message,
            isLoaded: true,
            permission: "denied",
        });
    };

    const checkPermission = async () => {
        if (navigator.permissions) {
            try {
                const permissionStatus = await navigator.permissions.query({ name: "geolocation" });
                if (permissionStatus.state === "granted") {
                    getLocation();
                } else if (permissionStatus.state === "prompt") {
                    // Geolocation permission not granted yet, asking for permission
                    getLocation();
                } else {
                    setLocation({
                        ...location,
                        error: "위치 정보 권한 요청이 거부되었습니다. 권한을 허용해주세요.",
                        isLoaded: true,
                    });
                }
            } catch (err) {
                console.error("Permission check failed", err);
                setLocation({ ...location, error: "위치 정보 권한 요청 중 오류가 발생했습니다.", isLoaded: true });
            }
        } else {
            getLocation(); // Fallback for browsers that don't support Permissions API
        }
    };

    useEffect(() => {
        checkPermission();
    }, []); // Only run once when component mounts

    return { location, getLocation }; // 반환값에 `getLocation` 메서드 추가
};

export default useGeolocation;
