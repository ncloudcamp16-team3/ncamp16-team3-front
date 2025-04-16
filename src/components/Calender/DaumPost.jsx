import React from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { Button } from "@mui/material";

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
        <Button
            onClick={handleClick}
            variant="contained"
            size="small"
            sx={{
                ml: 1,
                mt: 1,
                borderRadius: "8px",
                backgroundColor: "#1976d2",
                color: "#fff",
                textTransform: "none",
                "&:hover": {
                    backgroundColor: "#115293",
                },
            }}
        >
            찾기
        </Button>
    );
};

export default DaumPost;
