import React, { useState } from "react";
import { Box, Typography, Button, Avatar, Divider, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useRegister } from "./RegisterContext.jsx";

const Step4 = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const { nickname, petDataList, goToStep1, snsAccountId, snsTypeId } = useRegister();

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const snsTypeIdNum = snsTypeId ? Number(snsTypeId) : null;

            const formData = {
                nickname: nickname,
                snsAccountId: snsAccountId,
                snsTypeId: snsTypeIdNum,
                fileId: 1, // 기본 파일

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
                            uuid: "", // 서버에서 UUID 생성
                            thumbnail: index === mainIndex,
                        })),
                    };
                }),
            };

            console.log("📦 전송할 formData:", formData);

            // API 호출
            const response = await fetch(`/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // ✅ 필수!
                body: JSON.stringify(formData),
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
                minHeight: "100vh",
                paddingBottom: "80px",
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
                                    {pet.petWeight && <Typography variant="body2">체중: {pet.petWeight}kg</Typography>}
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

            <Box
                sx={{
                    position: "fixed",
                    maxWidth: "500px",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "100%", // 화면 전체
                    backgroundColor: "#fff",
                    zIndex: 1000,
                    p: 1,
                }}
            >
                <Box width="100%" display="flex" gap={2} mt={2}>
                    <Button
                        variant="outlined"
                        onClick={goToStep1}
                        sx={{ flex: 1, borderColor: "#E9A260", color: "#E9A260" }}
                    >
                        반려동물 추가
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        sx={{ flex: 1, backgroundColor: "#E9A260" }}
                    >
                        {isSubmitting ? "처리 중..." : "가입 완료"}
                    </Button>
                </Box>

                {submitError && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {submitError}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default Step4;
