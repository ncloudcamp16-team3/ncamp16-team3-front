import React from "react";
import { Box, Typography, Button, Avatar, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useRegister } from "./RegisterContext.jsx";

const Step5 = () => {
    const navigate = useNavigate();

    const { nickname, petDataList, goToStep2 } = useRegister();

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
                        ? typeof mainPhoto === "string"
                            ? mainPhoto
                            : URL.createObjectURL(mainPhoto)
                        : null;

                    return (
                        <Box key={index} width="100%" border="1px solid #ddd" borderRadius={2} p={2} mb={2}>
                            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                                반려동물 #{index + 1}
                            </Typography>

                            {mainPhotoUrl && (
                                <Avatar
                                    src={mainPhotoUrl}
                                    alt={`대표사진-${index}`}
                                    sx={{ width: 80, height: 80, mb: 1 }}
                                    variant="rounded"
                                />
                            )}

                            <Box ml={1}>
                                <Typography>이름: {pet.petName}</Typography>
                                <Typography>등록번호: {pet.petRegistration}</Typography>
                                <Typography>성별: {pet.petGender}</Typography>
                                <Typography>
                                    생일: {pet.petBirthday ? dayjs(pet.petBirthday).format("YYYY-MM-DD") : "미입력"}
                                </Typography>
                                <Typography>몸무게: {pet.petWeight} kg</Typography>
                                <Typography>체형: {pet.petBodyType}</Typography>
                                <Typography>소개: {pet.petIntroduction}</Typography>
                                <Typography>중성화 여부: {pet.petNeutered === "Y" ? "O" : "X"}</Typography>
                                <Typography>좋아하는 것: {pet.petFavorite}</Typography>
                            </Box>
                        </Box>
                    );
                })
            )}

            <Divider sx={{ width: "100%", my: 2 }} />

            <Button variant="outlined" sx={{ width: "100%" }} onClick={goToStep2}>
                반려동물 추가
            </Button>

            <Button
                variant="contained"
                onClick={() => navigate("/")}
                sx={{ width: "100%", backgroundColor: "#E9A260" }}
            >
                제출
            </Button>
        </Box>
    );
};

export default Step5;
