import React from "react";
import "../../css/App.css";
import icon from "../../assets/images/icon1.svg";
import notification from "../../assets/images/Notification2.svg";
import profile from "../../assets/images/haribo.jpg";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    return (
        <div className="header flex flex-row justify-between p-1 ps-3 pe-3">
            <div className="rounded-full border border-gray-400 overflow-hidden w-10 h-10">
                <img
                    src={profile}
                    alt="profile"
                    className="object-cover w-fit h-fit"
                />
            </div>
            <div className="flex items-center">
                <img src={icon} alt="아이콘" className="object-contain" />
                <span className="ms-2 whitespace-nowrap font-bold">
                    꼬리친구들
                </span>
            </div>
            <div onClick={() => navigate("/notification")}>
                <img
                    src={notification}
                    alt="종"
                    className="object-contain w-10 h-10"
                />
            </div>
        </div>
    );
};

export default Header;
