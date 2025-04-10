import React, { useContext, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import KakaoMap from "./KakaoMap.jsx";
import Arrow from "../../assets/images/Global/arrow.svg";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";
import LocationConfigBtns from "./LocationConfigBtns.jsx";
import Distance from "./Disdance.jsx";

const LocationConfig = () => {
    const { setView, pet, setPet } = useContext(PetMeetingContext);
    const [address, setAddress] = useState(null);
    const [dongName, setDongName] = useState(null);
    const [distance, setDistance] = useState(2);

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
                ...prev.owner,
                address: address,
                dongName: dongName,
                distance: distance,
            },
        }));
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

            <KakaoMap address={address} setAddress={setAddress} dongName={dongName} setDongName={setDongName} />
            <Distance dongName={dongName} distance={distance} setDistance={setDistance} />
            <LocationConfigBtns saveLocation={saveLocation} />
        </Box>
    );
};

export default LocationConfig;
