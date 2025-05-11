import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Card,
    CardMedia,
    CardContent,
    Chip,
    Divider,
    Alert,
    CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllApprovedPetSitters, getApprovedPetSitters } from "../../services/petSitterService";
import GlobalSnackbar from "../../components/Global/GlobalSnackbar";

const PetSitterResults = ({ filteredPetsitters, error, showResults, resetSearch }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [allPetsitters, setAllPetsitters] = useState(null);
    const [loadAllError, setLoadAllError] = useState(null);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSitterClick = (sitterId) => {
        navigate(`/petsitter/${sitterId}`);
    };

    // 데이터 구조 확인 및 처리
    const getSittersList = () => {
        // 모든 펫시터 목록
        if (allPetsitters) {
            return getSittersFromResponse(allPetsitters);
        }

        if (!filteredPetsitters) return [];
        return getSittersFromResponse(filteredPetsitters);
    };

    const getSittersFromResponse = (response) => {
        if (response.content) {
            return response.content;
        } else if (Array.isArray(response)) {
            return response;
        } else {
            console.error("예상치 못한 데이터 구조:", response);
            return [];
        }
    };

    // 반려동물 정보 포맷팅
    const formatPetInfo = (sitter) => {
        // 반려동물 타입
        let petTypeDisplay = sitter.petTypesFormatted || "정보 없음";

        // 반려동물 수
        let petCountDisplay = sitter.petCount || "1마리";

        return {
            types: petTypeDisplay,
            count: petCountDisplay,
        };
    };

    const handleViewAllPetsitters = async () => {
        setIsLoading(true);
        setLoadAllError(null);

        try {
            const response = await getAllApprovedPetSitters();
            // console.log("모든 펫시터 목록 응답:", response);

            if (response && response.data) {
                setAllPetsitters(response.data);
            } else {
                throw new Error("펫시터 목록을 불러올 수 없습니다.");
            }
        } catch (error) {
            console.error("모든 펫시터 목록 조회 오류:", error);
            setLoadAllError("펫시터 목록을 불러오는데 실패했습니다.");

            setSnackbar({
                open: true,
                message: "펫시터 목록을 불러오는데 실패했습니다.",
                severity: "error",
            });

            try {
                const fallbackResponse = await getApprovedPetSitters({});
                if (fallbackResponse && fallbackResponse.data) {
                    setAllPetsitters(fallbackResponse.data);
                    setLoadAllError(null);

                    setSnackbar({
                        open: true,
                        message: "대체 목록을 성공적으로 불러왔습니다.",
                        severity: "success",
                    });
                }
            } catch (fallbackError) {
                console.error("대체 API 호출도 실패:", fallbackError);

                setSnackbar({
                    open: true,
                    message: "펫시터 목록을 가져오지 못했습니다. 잠시 후 다시 시도해주세요.",
                    severity: "error",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const sittersList = getSittersList();

    if (error || loadAllError) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error || loadAllError}
                </Alert>
                <Typography variant="body1" align="center" sx={{ my: 4 }}>
                    죄송합니다. 서버에서 펫시터 정보를 가져오는 중 오류가 발생했습니다.
                </Typography>
            </Box>
        );
    }

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <CircularProgress sx={{ color: "#E9A260" }} />
            </Box>
        );
    }

    if (!sittersList || sittersList.length === 0) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                    검색 결과
                </Typography>
                <Typography variant="body1" align="center" sx={{ my: 4 }}>
                    조건에 맞는 펫시터를 찾지 못했습니다. 다른 조건으로 다시 시도해보세요.
                </Typography>
                <Button
                    variant="contained"
                    sx={{
                        bgcolor: "#E9A260",
                        color: "white",
                        "&:hover": { bgcolor: "#d0905a" },
                        width: "100%",
                        mt: 2,
                    }}
                    onClick={handleViewAllPetsitters}
                >
                    모든 펫시터 보기
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" width="100%" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                        {allPetsitters ? "전체 펫시터 목록" : "검색 결과"} ({sittersList.length}명)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0 }}>
                        {allPetsitters
                            ? "모든 승인된 펫시터 목록입니다."
                            : `조건에 맞는 펫시터가 ${sittersList.length}명 검색되었습니다.`}
                    </Typography>
                </Box>
                {showResults && (
                    <Button
                        sx={{
                            minWidth: "56px",
                            width: "100px",
                            height: "40px",
                            bgcolor: "#E9A260",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1000,
                        }}
                        onClick={resetSearch}
                    >
                        다시 찾기
                    </Button>
                )}
            </Box>
            {sittersList.map((sitter) => {
                const petInfo = formatPetInfo(sitter);

                return (
                    <Card
                        key={sitter.id}
                        sx={{
                            mb: 3,
                            borderRadius: "12px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            cursor: "pointer",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                            },
                        }}
                        onClick={() => handleSitterClick(sitter.id)}
                    >
                        <Box sx={{ display: "flex", p: 2 }}>
                            <CardMedia
                                component="img"
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: "8px",
                                    objectFit: "cover",
                                }}
                                image={sitter.imagePath || "/src/assets/images/User/profile-pic.jpg"}
                                alt={sitter.nickname || "펫시터 이미지"}
                            />
                            <CardContent sx={{ flex: 1, p: 1, pl: 2 }}>
                                <Box
                                    sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
                                >
                                    <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                                        {sitter.nickname || "펫시터"}
                                    </Typography>
                                    <Chip
                                        label={sitter.age || "20대"}
                                        size="small"
                                        sx={{ bgcolor: "#F2DFCE", color: "#E9A260", fontWeight: "medium" }}
                                    />
                                </Box>

                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1, mb: 1.5 }}>
                                    <Chip
                                        label={`반려동물: ${petInfo.types}`}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontSize: "12px" }}
                                    />
                                    <Chip
                                        label={sitter.sitterExp ? "임시보호 경험 있음" : "임시보호 경험 없음"}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontSize: "12px" }}
                                    />
                                    <Chip
                                        label={sitter.houseType || "주거 정보 없음"}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontSize: "12px" }}
                                    />
                                </Box>

                                <Divider sx={{ my: 1 }} />

                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: "13px" }}>
                                    {sitter.comment || "자기소개가 없습니다."}
                                </Typography>
                            </CardContent>
                        </Box>
                    </Card>
                );
            })}

            {!allPetsitters && (
                <Button
                    variant="contained"
                    sx={{
                        bgcolor: "#E9A260",
                        color: "white",
                        "&:hover": { bgcolor: "#d0905a" },
                        width: "100%",
                        mt: 2,
                    }}
                    onClick={handleViewAllPetsitters}
                >
                    모든 펫시터 보기
                </Button>
            )}

            {/* GlobalSnackbar */}
            <GlobalSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                handleSnackbarClose={handleSnackbarClose}
            />
        </Box>
    );
};

export default PetSitterResults;
