import React, { useContext } from "react";
import { Box, Typography } from "@mui/material";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";

const ConfigBtn = ({ img, label, type }) => {
    const { setOpen, setView, view } = useContext(PetMeetingContext);
    const handleClick = () => {
        console.log(type);
        console.log(view);

        switch (type) {
            case "pet":
                setOpen(true);
                break;
            case "location":
                setView("locationConfig");
                break;
            case "play":
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
