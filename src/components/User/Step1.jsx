import React from "react";

const Step1 = ({ nextStep }) => {
    return (
        <div className="flex flex-col">
            첫번째페이지
            <button className="border border-black" onClick={nextStep}>
                다음
            </button>
        </div>
    );
};

export default Step1;
