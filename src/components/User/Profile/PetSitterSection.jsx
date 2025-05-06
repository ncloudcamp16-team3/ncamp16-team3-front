import React from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import sitter from "/src/assets/images/User/petsit_req.svg";

const PetSitterSection = ({ sitterInfo, onEditClick, onQuitClick, onApplyClick }) => {
    const isApproved = sitterInfo?.status === "APPROVE";
    const isPending = sitterInfo?.status === "NONE";
    const isHold = sitterInfo?.status === "PENDING";
    const isDeleted = sitterInfo?.status === "DELETE";

    const formatPetInfo = () => {
        if (!sitterInfo) return { types: "정보 없음", count: "정보 없음" };

        let petTypeDisplay = sitterInfo.petTypesFormatted || "정보 없음";
        let petCountDisplay = sitterInfo.petCount || "1마리";

        return {
            types: petTypeDisplay,
            count: petCountDisplay,
        };
    };

    // 반려동물 정보
    const petInfo = formatPetInfo();

    console.log("펫시터 정보:", sitterInfo);
    console.log("반려동물 정보:", petInfo);

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
                                    src={sitterInfo.image || "/src/assets/images/User/profile-pic.jpg"}
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
                                <InfoRow label="연령대" value={sitterInfo.age || "40대"} />
                                <InfoRow label="반려동물" value={petInfo.types} />
                                <InfoRow label="키우는 수" value={petInfo.count} />
                                <InfoRow label="펫시터 경험" value={sitterInfo.experience ? "있음" : "없음"} />
                                <InfoRow label="주거 형태" value={sitterInfo.houseType || "오피스텔"} />
                                <InfoRow
                                    label="한마디"
                                    value={sitterInfo.comment || "제 아이라는 마음으로 돌봐드려요 😊"}
                                    isComment={true}
                                />
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
                        // 영구 정지된 펫시터의 경우 (재신청 버튼 없음)
                        <>
                            <Box
                                component="img"
                                src={sitterInfo.image || "/src/assets/images/User/profile-pic.jpg"}
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
                                src={sitterInfo.image || "/src/assets/images/User/profile-pic.jpg"}
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
                                <InfoRow label="연령대" value={sitterInfo.age || "40대"} />
                                <InfoRow label="반려동물" value={petInfo.types} />
                                <InfoRow label="키우는 수" value={petInfo.count} />
                                <InfoRow label="펫시터 경험" value={sitterInfo.experience ? "있음" : "없음"} />
                            </Box>
                        </>
                    ) : isHold ? (
                        // 보류된 펫시터의 경우
                        <>
                            <Box
                                component="img"
                                src={sitterInfo.image || "/src/assets/images/User/profile-pic.jpg"}
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
