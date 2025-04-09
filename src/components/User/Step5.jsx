import React, { useState } from "react";
import { Box, Typography, Button, Avatar, Divider, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useRegister } from "./RegisterContext.jsx";

const Step5 = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const { nickname, petDataList, goToStep2, token, email, snsTypeId } = useRegister();

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // snsTypeId가 숫자인지 확인
            const snsTypeIdNum = snsTypeId ? Number(snsTypeId) : null;
            console.log("SNS 타입 ID 타입:", typeof snsTypeId, "값:", snsTypeId);

            // 폼 데이터 준비
            const formData = {
                snsAccountId: email,
                snsTypeId: snsTypeIdNum, // 숫자로 변환된 값 사용
                nickname: nickname,
                pets: petDataList.map((pet) => {
                    // File 객체를 URL로 변환
                    const petPhotos = pet.petPhotos
                        ? pet.petPhotos.map((photo) => {
                              if (photo instanceof File) {
                                  return URL.createObjectURL(photo);
                              }
                              return photo;
                          })
                        : [];

                    return {
                        name: pet.petName,
                        registrationNumber: pet.petRegistration,
                        gender: pet.petGender,
                        birthday: pet.petBirthday,
                        weight: pet.petWeight,
                        bodyType: pet.petBodyType,
                        introduction: pet.petIntroduction,
                        neutered: pet.petNeutered,
                        favoriteActivities: pet.petFavorite,
                        photos: petPhotos,
                        mainPhotoIndex: pet.mainPhotoIndex || 0,
                    };
                }),
            };

            console.log("전송할 데이터:", formData);

            // API 호출
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
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
        <Box display="flex" flexDirection="column" alignItems="center" width="90%" mx="auto" gap={3}>
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
                                    {pet.petBirthday && (
                                        <Typography variant="body2">
                                            생년월일: {dayjs(pet.petBirthday).format("YYYY년 MM월 DD일")}
                                        </Typography>
                                    )}
                                    {pet.petWeight && <Typography variant="body2">체중: {pet.petWeight}kg</Typography>}
                                </Box>
                            </Box>
                            {pet.petIntroduction && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="body1">{pet.petIntroduction}</Typography>
                                </>
                            )}
                        </Paper>
                    );
                })
            )}

            <Box width="100%" display="flex" gap={2} mt={2}>
                <Button
                    variant="outlined"
                    onClick={goToStep2}
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

            {/* 디버깅 정보 */}
            <Paper elevation={3} sx={{ p: 2, mt: 4, backgroundColor: "#f5f5f5", width: "100%" }}>
                <Typography variant="subtitle2" fontWeight="bold">
                    디버깅 정보 (Step 5)
                </Typography>
                <Typography variant="body2">토큰: {token || "없음"}</Typography>
                <Typography variant="body2">이메일: {email || "없음"}</Typography>
                <Typography variant="body2">닉네임: {nickname || "없음"}</Typography>
                <Typography variant="body2">
                    SNS 타입 ID: {snsTypeId || "없음"} (타입: {typeof snsTypeId})
                </Typography>
                <Typography variant="body2">반려동물 수: {petDataList.length}</Typography>
            </Paper>
        </Box>
    );
};

export default Step5;
