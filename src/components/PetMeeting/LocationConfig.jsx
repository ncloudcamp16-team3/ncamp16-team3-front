import React, { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import KakaoMap from "./KakaoMap.jsx";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";
import LocationConfigBtns from "./LocationConfigBtns.jsx";
import Distance from "./Disdance.jsx";
import TitleBar from "../Global/TitleBar.jsx";
import { Context } from "../../context/Context.jsx";

const LocationConfig = () => {
    const { setView, pet, setPet } = useContext(PetMeetingContext);
    const [address, setAddress] = useState(null);
    const [dongName, setDongName] = useState(null);
    const [distance, setDistance] = useState(2);
    const { showModal } = useContext(Context);

    useEffect(() => {
        if (pet?.owner) {
            setAddress(pet.owner?.address || null);
            setDongName(pet.owner?.dongName || null);
            setDistance(pet.owner?.distance || 2);
        }
    }, []);

    const saveLocation = () => {
        setPet((prev) => ({
            ...prev,
            owner: {
                address: address,
                dongName: dongName,
                distance: distance,
            },
        }));

        if (address && dongName && distance) {
            showModal(null, "위치 저장 완료");
        } else {
            showModal(null, "주소를 선택해주세요");
        }
    };

    return (
        <Box>
            <TitleBar name={"내 위치정보 설정"} onBack={() => setView("petMeeting")} />

            <KakaoMap address={address} setAddress={setAddress} dongName={dongName} setDongName={setDongName} />
            <Distance dongName={dongName} distance={distance} setDistance={setDistance} />
            <LocationConfigBtns saveLocation={saveLocation} />
        </Box>
    );
};

export default LocationConfig;
