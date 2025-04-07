import React from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";

const postcodeScriptUrl = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

const DaumPost = ({ setAddressObj }) => {
    const open = useDaumPostcodePopup(postcodeScriptUrl);

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = "";
        const localAddress = `${data.sido} ${data.sigungu}`;

        if (data.addressType === "R") {
            if (data.bname) {
                extraAddress += data.bname;
            }
            if (data.buildingName) {
                extraAddress += extraAddress ? `, ${data.buildingName}` : data.buildingName;
            }
        }

        // 전체 주소 = 지역 주소 + 도로명/지번 주소 + (추가 주소)
        const oneLineAddress =
            `${localAddress} ${fullAddress.replace(localAddress, "")}`.trim() +
            (extraAddress ? ` (${extraAddress})` : "");

        setAddressObj(oneLineAddress);
    };

    const handleClick = () => {
        open({ onComplete: handleComplete });
    };

    return (
        <button type="button" onClick={handleClick}>
            주소 찾기
        </button>
    );
};

export default DaumPost;
