import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, FormHelperText, Grid, IconButton, Typography } from "@mui/material";
import { useRegister } from "./RegisterContext.jsx";
import FormControl from "@mui/material/FormControl";
import ReqUi from "./ReqUi.jsx";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TextareaAutosize from "@mui/material/TextareaAutosize";

const Step3 = () => {
    const {
        handleStep4Next,
        handleChange,
        prevStep,
        previews,
        formData,
        selectMainPhoto,
        mainPhotoIndex,
        removePhoto,
    } = useRegister();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); // 화면 이동시 스크롤 맨 위로

    const [errors, setErrors] = useState({
        petInfo: false,
        petPhotos: false,
        petNeutered: false,
    });

    const handleNext = () => {
        const newErrors = {
            petPhotos: !formData.petPhotos || formData.petPhotos.length === 0,
            petInfo: !formData.petInfo || formData.petInfo.trim().length === 0,
            petNeutered: !formData.petNeutered,
        };
        setErrors(newErrors);

        const hasError = Object.values(newErrors).some((val) => val === true);
        if (hasError) return;

        const newPetData = {
            ...formData,
            mainPhotoIndex,
        };
        handleStep4Next(newPetData);
    };

    // const handleFileChange = (e) => {
    //     const files = Array.from(e.target.files);
    //     if (files.length === 0) return;
    //
    //     const updatedPhotos = [...(formData.petPhotos || []), ...files];
    //
    //     handleChange({
    //         target: {
    //             name: "petPhotos",
    //             value: updatedPhotos,
    //         },
    //     });
    //
    //     e.target.value = null;
    // };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const currentPhotos = formData.petPhotos || [];
        const maxPhotos = 6;

        // 새로 추가 가능한 개수 계산
        const remainingSlots = maxPhotos - currentPhotos.length;

        // 이미 6장 이상이면 막기
        if (remainingSlots <= 0) {
            alert("사진은 최대 6장까지 등록할 수 있어요!");
            e.target.value = null;
            return;
        }

        // 새로 추가할 사진을 제한해서 자르기
        const filesToAdd = files.slice(0, remainingSlots);

        const updatedPhotos = [...currentPhotos, ...filesToAdd];

        handleChange({
            target: {
                name: "petPhotos",
                value: updatedPhotos,
            },
        });

        // 사용자 피드백 (선택한 개수보다 적게 들어갔을 경우)
        if (filesToAdd.length < files.length) {
            alert("사진은 최대 6장까지만 등록할 수 있어요!");
        }

        e.target.value = null; // 파일 선택 초기화
    };

    return (
        <>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="left"
                width="90%"
                mx="auto"
                mt={3}
                sx={{
                    position: "relative",
                }}
            >
                {/* 중성화 여부 */}
                <FormControl variant="standard" fullWidth sx={{ mb: 2 }} error={errors.petNeutered}>
                    <FormHelperText sx={{ mb: 1 }}>
                        <>
                            중성화 여부를 알려주세요 <ReqUi />
                            {errors.petNeutered && ` (중성화 여부를 선택해 주세요.)`}
                        </>
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
                </FormControl>
                {/* 사진 업로드 */}
                <FormControl variant="standard" fullWidth error={errors.petPhotos}>
                    <Typography variant="body1" mt={3} mb={2}>
                        아이 사진등록하기
                    </Typography>
                    <FormHelperText sx={{ mb: 1 }}>
                        <>
                            사진을 등록해 주세요 <ReqUi />
                            {errors.petPhotos && ` (사진을 한 장 이상 등록해 주세요.)`}
                        </>
                    </FormHelperText>

                    <Button
                        variant="outlined"
                        component="label"
                        sx={{ borderColor: "#E9A260", color: "#E9A260", mb: 2 }}
                        disabled={previews.length >= 6} // 👉 버튼 비활성화 조건
                    >
                        사진 업로드
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            multiple
                            onChange={handleFileChange}
                            disabled={previews.length >= 6} // 👉 input 자체도 비활성화
                        />
                    </Button>

                    <Box sx={{ minHeight: 230 }}>
                        {previews.length > 0 ? (
                            <Grid container spacing={2}>
                                {previews.map((src, index) => (
                                    <Grid item size={4} key={index}>
                                        <Box position="relative" textAlign="center">
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
                                                    margin: "0 auto",
                                                }}
                                                variant="rounded"
                                            />
                                            <Typography variant="caption">
                                                {index === mainPhotoIndex ? "대표사진" : `사진 ${index + 1}`}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Box sx={{ height: 230 }} />
                        )}
                    </Box>
                </FormControl>

                <FormControl variant="standard" fullWidth sx={{ mb: 2 }} error={errors.petInfo}>
                    <FormHelperText sx={{ mb: 1 }}>
                        <>
                            아이를 소개해 주세요 <ReqUi />
                            {errors.petInfo && ` (소개글을 입력해주세요.)`}
                        </>
                    </FormHelperText>
                    <TextareaAutosize
                        id="petInfo"
                        name="petInfo"
                        minRows={5}
                        placeholder="아이의 특징을 적어주세요"
                        style={{
                            maxWidth: "100%",
                            minWidth: "100%",
                            padding: "10px",
                            borderRadius: "5px",
                            borderColor: errors.petInfo ? "red" : "#ccc",
                            borderWidth: "1px",
                            borderStyle: "solid",
                        }}
                        value={formData.petInfo}
                        onChange={handleChange}
                    />
                </FormControl>
            </Box>

            <Box
                sx={{
                    position: "fixed",
                    maxWidth: "500px",
                    bottom: 0,
                    width: "100%",
                    backgroundColor: "#fff",
                    zIndex: 1000,
                    p: 1,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Grid container spacing={2} sx={{ width: "100%" }}>
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
                            onClick={handleNext}
                            sx={{ mt: 1, width: "100%", backgroundColor: "#E9A260" }}
                        >
                            저장
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default Step3;
