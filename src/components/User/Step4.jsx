import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Avatar, Divider, Paper, Grid, Alert, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRegister } from "./RegisterContext.jsx";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { registration } from "../../services/authService.js"; // ✅ 한글 로케일 불러오기
dayjs.locale("ko"); // ✅ 한글 설정

const Step4 = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [showPetMessage, setShowPetMessage] = useState(false); // Pet message visibility state

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); // 화면 이동시 스크롤 맨 위로

    const { nickname, formData, prevStep, snsAccountId, snsTypeId } = useRegister();

    const handleSubmit = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        setShowSnackbar(false);

        try {
            const snsTypeIdNum = snsTypeId ? Number(snsTypeId) : null;

            const petPhotos = formData.petPhotos || [];
            const mainIndex = formData.mainPhotoIndex ?? 0;

            const dto = {
                nickname,
                snsAccountId,
                snsTypeId: snsTypeIdNum,
                fileId: 1,
                pets: [
                    {
                        petTypeId: formData.petTypeId,
                        name: formData.petName,
                        gender: formData.petGender,
                        birth: formData.petBirth,
                        weight: formData.petWeight,
                        info: formData.petInfo,
                        neutered: formData.petNeutered === "" ? null : formData.petNeutered,
                        activityStatus: "NONE",
                        photos: petPhotos.map((photo, index) => ({
                            type: "PHOTO",
                            path: photo.name,
                            thumbnail: index === mainIndex,
                        })),
                    },
                ],
            };

            const formDataToSubmit = new FormData();
            formDataToSubmit.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }));

            petPhotos.forEach((photo) => {
                if (photo instanceof File) {
                    formDataToSubmit.append("images", photo);
                }
            });

            const result = await registration(formDataToSubmit);

            if (!result) {
                throw new Error("회원가입 처리 중 오류가 발생했습니다.");
            }

            // Show the message to add a pet after successful registration
            setShowPetMessage(true);

            // Navigate after the message
            setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds
        } catch (error) {
            console.error("회원가입 오류:", error);
            setSnackbarMessage(error.message || "알 수 없는 오류가 발생했습니다.");
            setShowSnackbar(true);
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

                {!formData.petName ? (
                    <Typography>아직 등록된 반려동물이 없습니다.</Typography>
                ) : (
                    <Paper elevation={3} sx={{ p: 3, width: "100%" }}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar
                                src={
                                    formData.petPhotos?.[formData.mainPhotoIndex ?? 0] instanceof File
                                        ? URL.createObjectURL(formData.petPhotos[formData.mainPhotoIndex ?? 0])
                                        : formData.petPhotos?.[formData.mainPhotoIndex ?? 0] || null
                                }
                                alt={formData.petName}
                                sx={{ width: 80, height: 80 }}
                            />
                            <Box>
                                <Typography variant="h6">{formData.petName}</Typography>
                                <Typography variant="body2">
                                    {formData.petGender === "남아" ? "수컷" : "암컷"} •{" "}
                                    {formData.petNeutered == null
                                        ? "중성화 여부 미선택"
                                        : formData.petNeutered
                                          ? "중성화 완료"
                                          : "중성화 미완료"}
                                </Typography>
                                {formData.petBirth && (
                                    <Typography variant="body2">
                                        생년월일: {dayjs(formData.petBirth).format("YYYY년 MM월 DD일")}
                                    </Typography>
                                )}
                                {formData.petWeight && (
                                    <Typography variant="body2">체중: {formData.petWeight}kg</Typography>
                                )}
                            </Box>
                        </Box>
                        {formData.petInfo && (
                            <>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="body1">{formData.petInfo}</Typography>
                            </>
                        )}
                    </Paper>
                )}

                {/* Display pet addition message */}

                <Box sx={{ marginTop: 2, padding: 2, backgroundColor: "#e9f7e8", borderRadius: 2 }}>
                    <Typography variant="h6" textAlign="center" color="green">
                        마이페이지에서 반려동물을 <br />
                        추가등록 하실 수 있습니다.
                    </Typography>
                </Box>

                {/* ✅ Snackbar 알림 */}
                <Snackbar
                    open={showSnackbar}
                    autoHideDuration={4000}
                    onClose={() => setShowSnackbar(false)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert severity="error" onClose={() => setShowSnackbar(false)}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
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
                            variant="contained"
                            onClick={prevStep}
                            sx={{ mt: 1, width: "100%", backgroundColor: "#fff", color: "black" }}
                        >
                            뒤로
                        </Button>
                    </Grid>
                    <Grid item size={6}>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            sx={{ mt: 1, backgroundColor: "#E9A260", width: "100%" }}
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
