import React, { useContext, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import KakaoMap from "./KakaoMap.jsx";
import Arrow from "../../assets/images/Global/arrow.svg";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";
import LocationConfigBtns from "./LocationConfigBtns.jsx";
import Distance from "./Disdance.jsx";
import { InfoModal } from "./PetMeetingModals.jsx";

const LocationConfig = () => {
    const { setView, pet, setPet } = useContext(PetMeetingContext);
    const [address, setAddress] = useState(null);
    const [dongName, setDongName] = useState(null);
    const [distance, setDistance] = useState(2);
    const [modalMessage, setModalMessage] = useState(null);
    const [modalTitle, setModalTitle] = useState(null);

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
            setModalMessage("위치 저장 완료");
        } else {
            setModalMessage("주소를 선택해주세요");
        }
    };

    return (
        <Box>
            <Box
                sx={{
                    width: "100%",
                    p: 0,
                    display: "flex",
                    alignItems: "center",
                    height: "55px",
                    position: "relative",
                }}
            >
                <Box
                    onClick={() => setView("petMeeting")}
                    sx={{
                        p: "20px",
                        display: "block",
                        cursor: "pointer",
                        position: "absolute",
                    }}
                >
                    <Box
                        component="img"
                        src={Arrow}
                        sx={{
                            width: "15px",
                            height: "15px",
                            display: "block", // inline 기본값이면 하단 여백 생길 수 있어요
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        width: "100%",
                        textAlign: "center",
                        justifyContent: "center",
                    }}
                >
                    <Typography sx={{ fontSize: "18px", fontWeight: "900" }}>내 위치정보 설정</Typography>
                </Box>
            </Box>

            <KakaoMap
                address={address}
                setAddress={setAddress}
                dongName={dongName}
                setDongName={setDongName}
                setModalMessage={setModalMessage}
                setModalTitle={setModalTitle}
            />
            <Distance dongName={dongName} distance={distance} setDistance={setDistance} />
            <LocationConfigBtns saveLocation={saveLocation} />
            {modalMessage && (
                <InfoModal
                    title={modalTitle}
                    message={modalMessage}
                    onClose={() => {
                        setModalMessage(null);
                        setModalTitle(null);
                    }} // 언마운트
                />
            )}
        </Box>
    );
};

export default LocationConfig;
