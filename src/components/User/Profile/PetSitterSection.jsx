import React from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import sitter from "/src/assets/images/User/petsit_req.svg";

/**
 * 펫시터 섹션 컴포넌트
 * @param {Object} props
 * @param {Object} props.sitterStatus 펫시터 상태 객체
 * @param {Function} props.onActionClick 액션 버튼 클릭 핸들러
 * @param {Function} props.onQuitClick 그만두기 버튼 클릭 핸들러
 */
const PetSitterSection = ({ sitterStatus, onActionClick, onQuitClick }) => {
  console.log("aaaa"+JSON.stringify(sitterStatus));
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                펫시터
            </Typography>
            <Card sx={{ bgcolor: "#FDF1E5", borderRadius: "12px", boxShadow: "none", maxWidth: "90%", mx: "auto" }}>
                <CardContent sx={{ p: 2 }}>
                    {sitterStatus.registered ? (
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
                                    src={sitterStatus.image || "/src/assets/images/User/profile-pic.jpg"}
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
                                <InfoRow label="연령대" value={sitterStatus.age || "40대"} />

                                <InfoRow
                                    label="반려동물"
                                    value={`${sitterStatus.petType || "강아지"} ${sitterStatus.petCount || "1마리"}`}
                                />

                                <InfoRow
                                    label="펫시터 경험"
                                    value={sitterStatus.experience === true || sitterStatus.sitterExp ? "있음" : "없음"}
                                />

                                <InfoRow label="주거 형태" value={sitterStatus.houseType || "오피스텔"} />

                                <InfoRow
                                    label="한마디"
                                    value={sitterStatus.comment || "제 아이라는 마음으로 돌봐드려요 😊"}
                                    isComment={true}
                                />
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={onActionClick}
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
                    ) : sitterStatus.status === "NONE" ? (
                        // 승인 대기 중인 펫시터의 경우
                        <>
                            <Box
                                component="img"
                                src={sitterStatus.image || "/src/assets/images/User/profile-pic.jpg"}
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
                                <InfoRow label="연령대" value={sitterStatus.age || "40대"} />

                                <InfoRow
                                    label="반려동물"
                                    value={`${sitterStatus.petType || "강아지"} ${sitterStatus.petCount || "1마리"}`}
                                />

                                <InfoRow
                                    label="펫시터 경험"
                                    value={sitterStatus.experience === true || sitterStatus.sitterExp ? "있음" : "없음"}
                                />
                            </Box>
                        </>
                    ) : sitterStatus.isPending ? (
                        <>
                            <Box
                                component="img"
                                src={sitterStatus.image || "/src/assets/images/User/profile-pic.jpg"}
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
                                    bgcolor: sitterStatus.isHold ? "rgba(244, 67, 54, 0.1)" : "rgba(255, 193, 7, 0.2)",
                                    p: 2,
                                    borderRadius: 2,
                                    mb: 2,
                                    border: sitterStatus.isHold ? "1px solid #F44336" : "1px solid #FFC107",
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    align="center"
                                    sx={{
                                        color: sitterStatus.isHold ? "#721c24" : "#856404",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {sitterStatus.isHold ? "검토 보류중입니다" : "승인 요청중입니다"}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    align="center"
                                    sx={{
                                        mt: 1,
                                        color: sitterStatus.isHold ? "#721c24" : "#856404",
                                    }}
                                >
                                    {sitterStatus.isHold
                                        ? "관리자가 신청 내용을 검토 후 보류 처리하였습니다.\n아래 정보를 수정하여 다시 신청해주세요."
                                        : "관리자가 신청 내용을 검토 중입니다.\n승인이 완료되면 펫시터 활동이 가능합니다."}
                                </Typography>
                            </Box>
                            {/* 정보 표시 및 수정 버튼 */}
                            {sitterStatus.isHold && (
                                <Button
                                    variant="contained"
                                    onClick={onActionClick}
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
                            )}
                        </>
                    ) : (
                        // 그 외의 경우 (기본값: 미등록 펫시터)
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
                                onClick={onActionClick}
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

// 정보 행 컴포넌트
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
