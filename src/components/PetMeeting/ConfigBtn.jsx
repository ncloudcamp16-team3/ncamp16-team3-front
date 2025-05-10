import React, { useContext } from "react";
import { Box, Typography } from "@mui/material";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";
import { Context } from "../../context/Context.jsx";
import { useNavigate } from "react-router-dom";

const ConfigBtn = ({ img, label, type }) => {
    const { setOpenPetConfigModal, setView, setOpenActivityModal } = useContext(PetMeetingContext);
    const { pet } = useContext(Context);
    const navigate = useNavigate();
    const handleClick = () => {
        switch (type) {
            case "pet":
                setOpenPetConfigModal(true);
                break;
            case "location":
                navigate("/location");
                break;
            case "activity":
                if (pet?.activityStatus === "NONE" || pet?.activityStatus === undefined || pet?.id == null) {
                    setOpenPetConfigModal(true);
                } else {
                    setOpenActivityModal(true);
                }
                break;
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                margin: "5px 0",
                alignItems: "center",
                cursor: "pointer",
                // borderRadius: 2,
                // border: "1px solid black",
            }}
            onClick={handleClick}
        >
            <Box
                component="img"
                src={img}
                alt={label}
                sx={{
                    width: 40,
                    height: 40,
                    objectFit: "contain",
                    marginBottom: "10px",
                }}
            />
            <Typography
                sx={{
                    color: "rgba(0, 0, 0, 0.4)",
                }}
            >
                {label}
            </Typography>
        </Box>
    );
};

export default ConfigBtn;
