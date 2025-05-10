import React, { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import KakaoMap from "../../components/Location/KakaoMap.jsx";
import LocationConfigBtns from "../../components/Location/LocationConfigBtns.jsx";
import Distance from "../../components/Location/Disdance.jsx";
import TitleBar from "../../components/Global/TitleBar.jsx";
import { Context } from "../../context/Context.jsx";
import { saveUserData } from "../../services/memberService.js";
import { useNavigate } from "react-router-dom";

const LocationConfig = () => {
    const { user, setUser } = useContext(Context);
    const [address, setAddress] = useState(null);
    const [dongName, setDongName] = useState(null);
    const [distance, setDistance] = useState("LEVEL2");
    const { showModal } = useContext(Context);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const navigete = useNavigate();

    useEffect(() => {
        if (user) {
            setAddress(user.address || null);
            setDongName(user.dongName || null);
            setDistance(user.distance || "LEVEL2");
        }
    }, []);

    const saveLocation = async () => {
        if (address && dongName && distance) {
            const updatedUser = {
                ...user,
                address,
                dongName,
                distance,
                latitude,
                longitude,
            };

            setUser(updatedUser);

            saveUserData(updatedUser)
                .then(() => {
                    showModal(null, "위치 저장 완료", () => navigete("/"));
                })
                .catch((err) => {
                    console.error("에러 발생:", err.message);
                    showModal(null, err.message);
                });
        } else {
            showModal(null, "주소를 선택해주세요");
        }
    };

    return (
        <Box>
            <TitleBar name={"내 위치정보 설정"} onBack={() => navigete("/")} />

            <KakaoMap
                address={address}
                setAddress={setAddress}
                setDongName={setDongName}
                setLatitude={setLatitude}
                setLongitude={setLongitude}
            />
            <Distance dongName={dongName} distance={distance} setDistance={setDistance} />
            <LocationConfigBtns saveLocation={saveLocation} />
        </Box>
    );
};

export default LocationConfig;
