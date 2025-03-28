import React from "react";

const Step2 = ({ nextStep }) => {
    return (
        <div className="flex flex-col">
            두번째페이지
            <button className="border border-black" onClick={nextStep}>
                다음
            </button>
        </div>
    );
};

export default Step2;
