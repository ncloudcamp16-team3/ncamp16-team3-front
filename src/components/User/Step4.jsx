import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Avatar, Divider, Paper, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRegister } from "./RegisterContext.jsx";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // ✅ 한글 로케일 불러오기
dayjs.locale("ko"); // ✅ 한글 설정

const Step4 = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); // 화면 이동시 스크롤 맨 위로

    const { nickname, petDataList, goToStep1, snsAccountId, snsTypeId } = useRegister();

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const snsTypeIdNum = snsTypeId ? Number(snsTypeId) : null;

            const dto = {
                nickname,
                snsAccountId,
                snsTypeId: snsTypeIdNum,
                fileId: 1, // 기본값

                pets: petDataList.map((pet) => {
                    const petPhotos = pet.petPhotos || []; // 파일 리스트
                    const mainIndex = pet.mainPhotoIndex ?? 0; // 대표 사진 인덱스 지정 (없으면 0번)

                    return {
                        petTypeId: pet.petTypeId || 1,
                        name: pet.petName,
                        gender: pet.petGender,
                        birth: pet.petBirth,
                        weight: pet.petWeight,
                        info: pet.petInfo,
                        neutered: pet.petNeutered === "Y",
                        activityStatus: "NONE",

                        photos: petPhotos.map((photo, index) => ({
                            type: "PHOTO",
                            path: photo.name,
                            thumbnail: index === mainIndex,
                        })),
                    };
                }),
            };

            const formData = new FormData();
            formData.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }));

            // 이미지 파일들 추출 후 append
            petDataList.forEach((pet) => {
                (pet.petPhotos || []).forEach((photo) => {
                    if (photo instanceof File) {
                        formData.append("images", photo);
                    }
                });
            });

            // API 호출
            const response = await fetch("/api/auth/register", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "회원가입 처리 중 오류가 발생했습니다.");
            }

            const result = await response.json();
            console.log("회원가입 성공:", result);

            // 성공 시 홈으로 이동
            navigate("/");
        } catch (error) {
            console.error("회원가입 오류:", error);
            setSubmitError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                width="90%"
                mx="auto"
                gap={3}
                mt={3}
                sx={{
                    position: "relative",
                }}
            >
                <Typography variant="h6" fontWeight="bold" textAlign="center">
                    입력한 정보를 확인하세요
                </Typography>

                <Box width="100%">
                    <Typography variant="h5" fontWeight="bold">
                        닉네임: {nickname}
                    </Typography>
                </Box>

                {petDataList.length === 0 ? (
                    <Typography>아직 등록된 반려동물이 없습니다.</Typography>
                ) : (
                    petDataList.map((pet, index) => {
                        const mainIndex = pet.mainPhotoIndex ?? 0;
                        const petPhotos = pet.petPhotos || [];
                        const mainPhoto = petPhotos[mainIndex];

                        const mainPhotoUrl = mainPhoto
                            ? mainPhoto instanceof File
                                ? URL.createObjectURL(mainPhoto)
                                : mainPhoto
                            : null;

                        return (
                            <Paper key={index} elevation={3} sx={{ p: 3, width: "100%" }}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar src={mainPhotoUrl} alt={pet.petName} sx={{ width: 80, height: 80 }} />
                                    <Box>
                                        <Typography variant="h6">{pet.petName}</Typography>
                                        <Typography variant="body2">
                                            {pet.petGender === "M" ? "수컷" : "암컷"} •{" "}
                                            {pet.petNeutered === "Y" ? "중성화 완료" : "중성화 미완료"}
                                        </Typography>
                                        {pet.petBirth && (
                                            <Typography variant="body2">
                                                생년월일: {dayjs(pet.petBirth).format("YYYY년 MM월 DD일")}
                                            </Typography>
                                        )}
                                        {pet.petWeight && (
                                            <Typography variant="body2">체중: {pet.petWeight}kg</Typography>
                                        )}
                                    </Box>
                                </Box>
                                {pet.petInfo && (
                                    <>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="body1">{pet.petInfo}</Typography>
                                    </>
                                )}
                            </Paper>
                        );
                    })
                )}
                {submitError && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {submitError}
                    </Typography>
                )}
            </Box>

            <Box
                sx={{
                    position: "fixed",
                    maxWidth: "500px",
                    bottom: 0,
                    width: "100%", // 화면 전체
                    backgroundColor: "#fff",
                    zIndex: 1000,
                    paddingX: 1,
                    paddingBottom: 1,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Grid container spacing={2} sx={{ width: "95%" }}>
                    <Grid item size={6}>
                        <Button
                            variant="outlined"
                            onClick={goToStep1}
                            sx={{
                                borderColor: "#E9A260",
                                color: "#E9A260",
                                width: "100%",
                            }}
                        >
                            추가
                        </Button>
                    </Grid>
                    <Grid item size={6}>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            sx={{ backgroundColor: "#E9A260", width: "100%" }}
                        >
                            {isSubmitting ? "처리 중..." : "가입"}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default Step4;
