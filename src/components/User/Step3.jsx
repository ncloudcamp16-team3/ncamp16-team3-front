import React from "react";
import { useNavigate } from "react-router-dom";

const Step3 = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col">
            세번째페이지
            <button
                className="border border-black"
                onClick={() => navigate("/")}
            >
                제출
            </button>
        </div>
    );
};

export default Step3;
