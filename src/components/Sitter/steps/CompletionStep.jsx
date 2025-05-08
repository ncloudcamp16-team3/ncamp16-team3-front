import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { getSelectedPetTypes } from "../utils/petSitterUtils";

const CompletionStep = ({ imagePreview, formData, onComplete }) => {
    const { selectedAges, hasPet, petTypes, petCount, sitterExperience, houseType, commentText } = formData;
    const selectedPetTypesStr = getSelectedPetTypes(petTypes).join(", ");
    const selectedPetCountStr = Object.keys(petCount).find((key) => petCount[key]) || "1마리";

    return (
        <Box
            sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                pt: 6,
            }}
        >
            <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                    mb: 4,
                    textAlign: "center",
                }}
            >
                등록이 완료되었어요!
            </Typography>

            {/* 프로필 이미지 */}
            <Box
                sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    overflow: "hidden",
                    mb: 3,
                }}
            >
                <Box
                    component="img"
                    src={imagePreview}
                    alt="프로필"
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </Box>

            {/* 등록 정보 테이블 */}
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    mb: 4,
                }}
            >
                <InfoRow label="연령대" value={Object.keys(selectedAges).find((key) => selectedAges[key]) || "20대"} />

                {hasPet["네, 키우고 있습니다"] ? (
                    <>
                        <InfoRow label="반려동물" value={selectedPetTypesStr} />
                        <InfoRow label="키우는 수" value={selectedPetCountStr} />
                    </>
                ) : (
                    <InfoRow label="반려동물" value="없음" />
                )}

                <InfoRow label="펫시터 경험" value={sitterExperience["네, 해본적 있습니다"] ? "있음" : "없음"} />

                <InfoRow label="주거 형태" value={Object.keys(houseType).find((key) => houseType[key]) || "아파트"} />

                <InfoRow label="한마디" value={commentText || "제 아이라는 마음으로 돌봐드려요 ☺️"} />
            </Box>

            {/* 홈으로 가기 버튼 */}
            <Button
                fullWidth
                variant="contained"
                onClick={onComplete}
                sx={{
                    bgcolor: "#E9A260",
                    color: "white",
                    "&:hover": {
                        bgcolor: "#d0905a",
                    },
                    borderRadius: "4px",
                    py: 1.5,
                    mb: 2,
                }}
            >
                마이페이지로 돌아가기
            </Button>
        </Box>
    );
};

const InfoRow = ({ label, value }) => (
    <Box
        sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
        }}
    >
        <Typography fontWeight="bold">{label}</Typography>
        <Typography
            noWrap={label === "한마디"}
            sx={{
                maxWidth: label === "한마디" ? "70%" : "auto",
                textOverflow: "ellipsis",
            }}
        >
            {value}
        </Typography>
    </Box>
);

export default CompletionStep;
