import React, { useEffect, useState } from "react";
import "../../css/App.css";
import MainPageHeader from "../../components/PetMeeting/MainPageHeader.jsx";
import Pet from "../../mock/Main/pet.json";
import FriendType from "../../components/PetMeeting/FriendType.jsx";
import Scheduler from "../../components/PetMeeting/Scheduler.jsx";
import { Box } from "@mui/material";
import FindFriend from "../../components/PetMeeting/FindFriend.jsx";
import PetConfigModal from "../../components/PetMeeting/PetConfigModal.jsx";

const PetMeeting = () => {
    const [pet, setPet] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setPet(Pet);
    }, []);

    useEffect(() => {
        if (open) {
            document.body.classList.add("modal-open"); // 모달이 열리면 적용
        } else {
            document.body.classList.remove("modal-open"); // 모달이 닫히면 해제
        }
        return () => {
            document.body.classList.remove("modal-open"); // 언마운트 시 해제
        };
    }, [open]);

    if (!pet) return <div>Loading...</div>;

    return (
        <Box
            sx={{
                margin: "0 10px",
            }}
        >
            <MainPageHeader petName={pet.name} />
            <FriendType />
            <Scheduler petName={pet.name} />
            <FindFriend pet={pet} setPet={setPet} setOpen={setOpen} />

            <PetConfigModal open={open} handleClose={() => setOpen(false)} pet={pet} setPet={setPet} />
        </Box>
    );
};

export default PetMeeting;
