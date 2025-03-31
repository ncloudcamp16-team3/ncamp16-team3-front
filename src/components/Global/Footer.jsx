import React from "react";
import "../../css/App.css";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import BottomButton from "./BottomButton.jsx";
import board from "../../assets/images/board.svg";
import main from "../../assets/images/main.svg";
import petsta from "../../assets/images/petsta.svg";
import reserve from "../../assets/images/reserve.svg";
import petsitter from "../../assets/images/petsitter.svg";

const Footer = () => {
    const navigate = useNavigate();

    return (
        <Box
            component="div"
            className="footer"
            display="flex"
            alignItems="end"
            justifyContent="space-between"
        >
            <BottomButton
                icon={petsta}
                label="펫스타"
                onClick={() => navigate("/petSta")}
            />
            <BottomButton
                icon={board}
                label="게시판"
                onClick={() => navigate("/board")}
            />
            <Box
                component="div"
                sx={{
                    transform: "translateY(-13px)",
                }}
                onClick={() => navigate("/")}
            >
                <img src={main} />
            </Box>
            <BottomButton
                icon={reserve}
                label="예약"
                onClick={() => navigate("/reserve")}
            />
            <BottomButton
                icon={petsitter}
                label="임보구해요"
                onClick={() => navigate("/petsitter")}
            />
        </Box>
    );
};

export default Footer;
