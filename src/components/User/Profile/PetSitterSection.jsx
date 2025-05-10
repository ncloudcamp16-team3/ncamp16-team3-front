import React, { useEffect } from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import sitter from "/src/assets/images/User/petsit_req.svg";

const PetSitterSection = ({ sitterInfo, onEditClick, onQuitClick, onApplyClick }) => {
    const isApproved = sitterInfo?.status === "APPROVE";
    const isPending = sitterInfo?.status === "NONE";
    const isHold = sitterInfo?.status === "PENDING";
    const isDeleted = sitterInfo?.status === "DELETE";

    // 디버깅을 위한 로그 추가
    useEffect(() => {
        if (sitterInfo) {
            console.log("PetSitterSection - sitterInfo:", sitterInfo);
            console.log("grown 값:", sitterInfo.grown);
            console.log("grown 타입:", typeof sitterInfo.grown);
            console.log("petTypesFormatted:", sitterInfo.petTypesFormatted);

            // 로컬 스토리지에서 펫시터 정보 로깅
            try {
                const localInfo = localStorage.getItem("petSitterInfo");
                if (localInfo) {
                    const parsedInfo = JSON.parse(localInfo);
                    console.log("로컬 스토리지의 펫시터 정보:", parsedInfo);
                    console.log("로컬 스토리지의 petTypesFormatted:", parsedInfo.petTypesFormatted);
                }
            } catch (e) {
                console.error("로컬 스토리지 로깅 오류:", e);
            }
        }
    }, [sitterInfo]);

    // LocalStorage에서 펫시터 정보를 가져옴
    const getSitterInfoFromLocalStorage = () => {
        try {
            const savedInfo = localStorage.getItem("petSitterInfo");
            if (savedInfo) {
                return JSON.parse(savedInfo);
            }
        } catch (error) {
            console.error("로컬스토리지 펫시터 정보 읽기 오류:", error);
        }
        return null;
    };

    // 서버 정보가 없거나 이미지가 없는 경우 로컬스토리지에서 보완
    const getLocalImageIfNeeded = () => {
        if (!sitterInfo || !sitterInfo.image) {
            const localInfo = getSitterInfoFromLocalStorage();
            return localInfo?.image || null;
        }
        return sitterInfo.image;
    };

    // 이미지 URL (서버 정보 또는 로컬스토리지에서 가져옴)
    const imageUrl = getLocalImageIfNeeded();

    // 반려동물 정보 가져오기
    const getPetInfo = () => {
        // 1. 서버에서 전달받은 sitterInfo에서 확인
        if (sitterInfo?.petTypesFormatted && sitterInfo.petTypesFormatted.trim() !== "") {
            return {
                types: sitterInfo.petTypesFormatted,
                count: sitterInfo.petCount || "정보 없음",
                hasPet: true,
            };
        }

        // 2. 로컬 스토리지에서 확인
        const localInfo = getSitterInfoFromLocalStorage();
        if (localInfo?.petTypesFormatted && localInfo.petTypesFormatted.trim() !== "") {
            return {
                types: localInfo.petTypesFormatted,
                count: localInfo.petCount || "정보 없음",
                hasPet: true,
            };
        }

        // 3. 로컬 스토리지에 petTypes 배열이 있는 경우
        if (localInfo?.petTypes && Array.isArray(localInfo.petTypes) && localInfo.petTypes.length > 0) {
            return {
                types: localInfo.petTypes.join(", "),
                count: localInfo.petCount || "정보 없음",
                hasPet: true,
            };
        }

        // 4. 반려동물 정보가 없는 경우
        return {
            types: "없음",
            count: "0마리",
            hasPet: false,
        };
    };

    // 펫 정보 가져오기
    const petInfo = getPetInfo();

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                펫시터
            </Typography>
            <Card sx={{ bgcolor: "#FDF1E5", borderRadius: "12px", boxShadow: "none", maxWidth: "90%", mx: "auto" }}>
                <CardContent sx={{ p: 2 }}>
                    {isApproved ? (
                        // 승인된 펫시터의 경우
                        <>
                            {/* 프로필 이미지 */}
                            <Box
                                sx={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    mb: 3,
                                    mx: "auto",
                                }}
                            >
                                <Box
                                    component="img"
                                    src={imageUrl || "/src/assets/images/User/profile-pic.jpg"}
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
                                    mb: 3,
                                }}
                            >
                                <InfoRow label="연령대" value={sitterInfo.age} />

                                {/* 반려동물 정보 - petInfo 객체 사용 */}
                                {petInfo.hasPet ? (
                                    <>
                                        <InfoRow label="반려동물" value={petInfo.types} />
                                        <InfoRow label="키우는 수" value={petInfo.count} />
                                    </>
                                ) : (
                                    <InfoRow label="반려동물" value="없음" />
                                )}

                                <InfoRow label="임시보호 경험" value={sitterInfo.sitterExp ? "있음" : "없음"} />
                                <InfoRow label="주거 형태" value={sitterInfo.houseType} />
                                <Box
                                    sx={{
                                        py: 2,
                                        borderBottom: "1px solid #F0F0F0",
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        {sitterInfo.comment || "자기소개가 없습니다."}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={onQuitClick}
                                    sx={{
                                        width: "100%",
                                        bgcolor: "#f44336",
                                        color: "white",
                                        "&:hover": { bgcolor: "#d32f2f" },
                                        borderRadius: "4px",
                                        py: 0.7,
                                        fontSize: "0.9rem",
                                        boxShadow: "none",
                                    }}
                                >
                                    펫시터 그만두기
                                </Button>
                            </Box>
                        </>
                    ) : isDeleted ? (
                        // 영구 정지된 펫시터의 경우
                        <>
                            <Box
                                component="img"
                                src={imageUrl || "/src/assets/images/User/profile-pic.jpg"}
                                alt="펫시터 프로필"
                                sx={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    mb: 3,
                                    mx: "auto",
                                    display: "block",
                                    opacity: 0.5,
                                    filter: "grayscale(100%)",
                                }}
                            />
                            <Box
                                sx={{
                                    bgcolor: "rgba(244, 67, 54, 0.1)",
                                    p: 2,
                                    borderRadius: 2,
                                    mb: 2,
                                    border: "1px solid #F44336",
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    align="center"
                                    sx={{ color: "#721c24", fontWeight: "bold" }}
                                >
                                    펫시터 자격이 영구 정지되었습니다
                                </Typography>
                                <Typography variant="body2" align="center" sx={{ mt: 1, color: "#721c24" }}>
                                    서비스 이용 규정 위반으로 인해
                                    <br />
                                    펫시터 자격이 영구적으로 정지되었습니다.
                                </Typography>
                            </Box>
                            {/* 재신청 버튼 제거됨 */}
                        </>
                    ) : isPending ? (
                        // 승인 대기 중인 펫시터의 경우
                        <>
                            <Box
                                component="img"
                                src={imageUrl || "/src/assets/images/User/profile-pic.jpg"}
                                alt="펫시터 프로필"
                                sx={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    mb: 3,
                                    mx: "auto",
                                    display: "block",
                                }}
                            />
                            <Box
                                sx={{
                                    bgcolor: "rgba(255, 193, 7, 0.2)",
                                    p: 2,
                                    borderRadius: 2,
                                    mb: 2,
                                    border: "1px solid #FFC107",
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    align="center"
                                    sx={{ color: "#856404", fontWeight: "bold" }}
                                >
                                    승인 요청중입니다
                                </Typography>
                                <Typography variant="body2" align="center" sx={{ mt: 1, color: "#856404" }}>
                                    관리자가 신청 내용을 검토 중입니다.
                                    <br />
                                    승인이 완료되면 펫시터 활동이 가능합니다.
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    mb: 3,
                                }}
                            >
                                <InfoRow
                                    label="연령대"
                                    value={sitterInfo?.age || getSitterInfoFromLocalStorage()?.age || "정보 없음"}
                                />

                                {/* 반려동물 정보 - petInfo 객체 사용 */}
                                {petInfo.hasPet ? (
                                    <>
                                        <InfoRow label="반려동물" value={petInfo.types} />
                                        <InfoRow label="키우는 수" value={petInfo.count} />
                                    </>
                                ) : (
                                    <InfoRow label="반려동물" value="없음" />
                                )}

                                <InfoRow
                                    label="펫시터 경험"
                                    value={
                                        sitterInfo?.sitterExp || getSitterInfoFromLocalStorage()?.sitterExp
                                            ? "있음"
                                            : "없음"
                                    }
                                />
                                <InfoRow
                                    label="주거 형태"
                                    value={
                                        sitterInfo?.houseType ||
                                        getSitterInfoFromLocalStorage()?.houseType ||
                                        "정보 없음"
                                    }
                                />
                            </Box>
                        </>
                    ) : isHold ? (
                        // 보류된 펫시터의 경우
                        <>
                            <Box
                                component="img"
                                src={imageUrl || "/src/assets/images/User/profile-pic.jpg"}
                                alt="펫시터 프로필"
                                sx={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    mb: 3,
                                    mx: "auto",
                                    display: "block",
                                }}
                            />
                            <Box
                                sx={{
                                    bgcolor: "rgba(244, 67, 54, 0.1)",
                                    p: 2,
                                    borderRadius: 2,
                                    mb: 2,
                                    border: "1px solid #F44336",
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    align="center"
                                    sx={{ color: "#721c24", fontWeight: "bold" }}
                                >
                                    검토 보류중입니다
                                </Typography>
                                <Typography variant="body2" align="center" sx={{ mt: 1, color: "#721c24" }}>
                                    관리자가 신청 내용을 검토 후 보류 처리하였습니다.
                                    <br />
                                    아래 정보를 수정하여 다시 신청해주세요.
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    mb: 3,
                                }}
                            >
                                <InfoRow
                                    label="연령대"
                                    value={sitterInfo?.age || getSitterInfoFromLocalStorage()?.age || "정보 없음"}
                                />

                                {/* 반려동물 정보 - petInfo 객체 사용 */}
                                {petInfo.hasPet ? (
                                    <>
                                        <InfoRow label="반려동물" value={petInfo.types} />
                                        <InfoRow label="키우는 수" value={petInfo.count} />
                                    </>
                                ) : (
                                    <InfoRow label="반려동물" value="없음" />
                                )}

                                <InfoRow
                                    label="펫시터 경험"
                                    value={
                                        sitterInfo?.sitterExp || getSitterInfoFromLocalStorage()?.sitterExp
                                            ? "있음"
                                            : "없음"
                                    }
                                />
                                <InfoRow
                                    label="주거 형태"
                                    value={
                                        sitterInfo?.houseType ||
                                        getSitterInfoFromLocalStorage()?.houseType ||
                                        "정보 없음"
                                    }
                                />
                            </Box>
                            <Button
                                variant="contained"
                                onClick={onEditClick}
                                sx={{
                                    width: "100%",
                                    bgcolor: "#E9A260",
                                    "&:hover": { bgcolor: "#d0905a" },
                                    borderRadius: "4px",
                                    py: 0.7,
                                    fontSize: "0.9rem",
                                    boxShadow: "none",
                                }}
                            >
                                펫시터 정보 수정
                            </Button>
                        </>
                    ) : (
                        // 펫시터가 아닌 경우 (등록하지 않은 상태)
                        <>
                            <Box
                                component="img"
                                src={sitter}
                                alt="펫시터 이미지"
                                sx={{
                                    width: "100%",
                                    height: "auto",
                                    mb: 2,
                                    maxWidth: "200px",
                                    mx: "auto",
                                    display: "block",
                                }}
                            />
                            <Typography variant="body2" align="center" sx={{ mb: 1.5 }}>
                                소중한 반려동물들에게
                                <br />
                                펫시터가 찾아갑니다!
                            </Typography>

                            <Button
                                variant="contained"
                                fullWidth
                                onClick={onApplyClick}
                                sx={{
                                    bgcolor: "#E9A260",
                                    "&:hover": { bgcolor: "#d0905a" },
                                    borderRadius: "4px",
                                    py: 0.7,
                                    fontSize: "0.9rem",
                                    boxShadow: "none",
                                }}
                            >
                                펫시터 신청
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

const InfoRow = ({ label, value, isComment = false }) => (
    <Box
        sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
        }}
    >
        <Typography fontWeight="bold">{label}</Typography>
        <Typography
            noWrap={isComment}
            sx={{
                maxWidth: isComment ? "70%" : "auto",
                textOverflow: "ellipsis",
            }}
        >
            {value}
        </Typography>
    </Box>
);

export default PetSitterSection;
