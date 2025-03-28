import React from "react";
import "../../css/App.css";
import board from "../../assets/images/board.svg";
import main from "../../assets/images/main.svg";
import petsta from "../../assets/images/petsta.svg";
import reserve from "../../assets/images/reserve.svg";
import petsitter from "../../assets/images/petsitter.svg";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();

    return (
        <div className="footer flex justify-between items-end">
            <div
                className="flex flex-col items-center bottom-button"
                onClick={() => navigate("/petsta")}
            >
                <img src={petsta} width="40px" />
                <span>펫스타</span>
            </div>
            <div
                className="flex flex-col items-center bottom-button"
                onClick={() => navigate("/board")}
            >
                <img src={board} className="w-fit h-fit" />
                <span>게시판</span>
            </div>
            <div
                className="transform translate-y-[-13px]"
                onClick={() => navigate("/")}
            >
                <img src={main} />
            </div>
            <div
                className="flex flex-col items-center bottom-button"
                onClick={() => navigate("/reserve")}
            >
                <img src={reserve} className="w-fit h-fit" />
                <span>예약</span>
            </div>
            <div
                className="flex flex-col items-center bottom-button"
                onClick={() => navigate("/petsitter")}
            >
                <img src={petsitter} className="w-fit h-fit" />
                <span>임보구해요</span>
            </div>
        </div>
    );
};

export default Footer;
