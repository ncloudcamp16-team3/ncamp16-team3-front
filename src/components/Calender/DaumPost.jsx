import React from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";

const postcodeScriptUrl = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

const DaumPost = ({ setAddressObj }) => {
    const open = useDaumPostcodePopup(postcodeScriptUrl);

    const handleComplete = (data) => {
        const fullAddress = data.address;
        let extraAddress = "";
        const localAddress = `${data.sido} ${data.sigungu}`;

        if (data.addressType === "R") {
            if (data.bname) extraAddress += data.bname;
            if (data.buildingName) {
                extraAddress += extraAddress ? `, ${data.buildingName}` : data.buildingName;
            }
        }

        const oneLineAddress =
            `${localAddress} ${fullAddress.replace(localAddress, "")}`.trim() +
            (extraAddress ? ` (${extraAddress})` : "");

        // 좌표 변환 (주소 -> 위도/경도)
        if (window.kakao?.maps?.services) {
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.addressSearch(fullAddress, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK && result[0]) {
                    const { x: longitude, y: latitude } = result[0];
                    setAddressObj({
                        address: oneLineAddress,
                        latitude,
                        longitude,
                    });
                } else {
                    console.error("좌표 변환 실패", result);
                    alert("좌표 변환에 실패했습니다.");
                    setAddressObj({ address: oneLineAddress });
                }
            });
        } else {
            alert("카카오 지도 API가 로드되지 않았습니다.");
            console.error("카카오 API 로드 실패");
        }
    };

    const handleClick = () => {
        open({ onComplete: handleComplete });
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            style={{
                marginLeft: "8px",
                padding: "6px 12px",
                backgroundColor: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
            }}
        >
            주소 찾기
        </button>
    );
};

export default DaumPost;
