import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import { Avatar, Box, Button, FormHelperText, Stack, Typography, IconButton, Grid } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ReqUi from "./ReqUi.jsx";
import { useRegister } from "./RegisterContext.jsx";

const Step4 = () => {
    const {
        handleChange,
        formData,
        prevStep,
        handleStep4Next,
        mainPhotoIndex,
        previews,
        removePhoto,
        selectMainPhoto,
    } = useRegister();

    const [errors, setErrors] = useState({
        petNeutered: false,
        petPhotos: false,
    });

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const updatedPhotos = [...(formData.petPhotos || []), ...files];

        handleChange({
            target: {
                name: "petPhotos",
                value: updatedPhotos,
            },
        });

        e.target.value = null;
    };

    const handleNext = () => {
        const newErrors = {
            petNeutered: !formData.petNeutered,
            petPhotos: !formData.petPhotos || formData.petPhotos.length === 0,
        };

        setErrors(newErrors);

        const hasError = Object.values(newErrors).some((e) => e);
        if (hasError) return;

        const newPetData = {
            ...formData,
            mainPhotoIndex,
        };
        handleStep4Next(newPetData);
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="left" width="90%" mx="auto" gap={2}>
            {/* 중성화 여부 */}
            <FormControl variant="standard" fullWidth sx={{ mb: 2 }} error={errors.petNeutered}>
                <FormHelperText sx={{ mb: 1 }}>
                    중성화 여부를 알려주세요 <ReqUi />
                </FormHelperText>
                <Grid container spacing={1}>
                    <Grid item size={6}>
                        <Button
                            fullWidth
                            variant={formData.petNeutered === "Y" ? "contained" : "outlined"}
                            onClick={() => handleChange({ target: { name: "petNeutered", value: "Y" } })}
                            sx={{
                                backgroundColor: formData.petNeutered === "Y" ? "#E9A260" : "inherit",
                                color: formData.petNeutered === "Y" ? "#fff" : "inherit",
                                borderColor: "#E9A260",
                                "&:hover": {
                                    backgroundColor: "#e08a3a",
                                    borderColor: "#e08a3a",
                                },
                            }}
                        >
                            O
                        </Button>
                    </Grid>
                    <Grid item size={6}>
                        <Button
                            fullWidth
                            variant={formData.petNeutered === "N" ? "contained" : "outlined"}
                            onClick={() => handleChange({ target: { name: "petNeutered", value: "N" } })}
                            sx={{
                                backgroundColor: formData.petNeutered === "N" ? "#E9A260" : "inherit",
                                color: formData.petNeutered === "N" ? "#fff" : "inherit",
                                borderColor: "#E9A260",
                                "&:hover": {
                                    backgroundColor: "#e08a3a",
                                    borderColor: "#e08a3a",
                                },
                            }}
                        >
                            X
                        </Button>
                    </Grid>
                </Grid>
                {errors.petNeutered && <FormHelperText>중성화 여부를 선택해 주세요.</FormHelperText>}
            </FormControl>

            {/* 사진 업로드 */}
            <FormControl variant="standard" fullWidth sx={{ mb: 2 }} error={errors.petPhotos}>
                <Typography variant="body1" mt={3} mb={2}>
                    아이 사진등록하기
                </Typography>
                <FormHelperText sx={{ mb: 1 }}>
                    첫번째 사진으로 프로필 사진이 등록됩니다 <ReqUi />
                </FormHelperText>

                <Button variant="outlined" component="label" sx={{ borderColor: "#E9A260", color: "#E9A260", mb: 2 }}>
                    사진 업로드
                    <input type="file" accept="image/*" hidden multiple onChange={handleFileChange} />
                </Button>

                {previews.length > 0 && (
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                        {previews.map((src, index) => (
                            <Box key={index} position="relative" textAlign="center">
                                {/* 삭제 버튼 */}
                                <IconButton
                                    size="small"
                                    onClick={() => removePhoto(index)}
                                    sx={{
                                        position: "absolute",
                                        top: -10,
                                        right: -10,
                                        backgroundColor: "white",
                                        zIndex: 1,
                                    }}
                                >
                                    <CancelIcon fontSize="small" />
                                </IconButton>

                                {/* 대표사진 선택 */}
                                <IconButton
                                    size="small"
                                    onClick={() => selectMainPhoto(index)}
                                    sx={{
                                        position: "absolute",
                                        top: -10,
                                        left: -10,
                                        backgroundColor: "white",
                                        zIndex: 1,
                                        color: index === mainPhotoIndex ? "#E9A260" : "gray",
                                    }}
                                >
                                    <CheckCircleIcon fontSize="small" />
                                </IconButton>

                                <Avatar
                                    src={src}
                                    alt={`preview-${index}`}
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        border: index === mainPhotoIndex ? "2px solid #E9A260" : "none",
                                    }}
                                    variant="rounded"
                                />
                                <Typography variant="caption">
                                    {index === mainPhotoIndex ? "대표사진" : `사진 ${index + 1}`}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                )}

                {errors.petPhotos && (
                    <FormHelperText error sx={{ mt: 1 }}>
                        사진을 한 장 이상 등록해 주세요.
                    </FormHelperText>
                )}
            </FormControl>

            {/* 이동 버튼 */}
            <Button variant="contained" onClick={prevStep} sx={{ mt: 1, width: "100%", backgroundColor: "#E9A260" }}>
                뒤로
            </Button>

            <Button variant="contained" onClick={handleNext} sx={{ mt: 1, width: "100%", backgroundColor: "#E9A260" }}>
                작성 완료
            </Button>
        </Box>
    );
};

export default Step4;
