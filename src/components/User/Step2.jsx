import * as React from "react";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import { Avatar, Box, Button, FormHelperText, Grid, IconButton, InputLabel, Stack, Typography } from "@mui/material";
import ReqUi from "./ReqUi.jsx";
import { useRegister } from "./RegisterContext.jsx";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import dayjs from "dayjs";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const Step2 = () => {
    const { nextStep, handleChange, formData, prevStep, previews, selectMainPhoto, mainPhotoIndex, removePhoto } =
        useRegister();

    const petTypes = [
        { id: 1, label: "강아지", value: "1" },
        { id: 2, label: "고양이", value: "2" },
        { id: 3, label: "햄스터", value: "3" },
        { id: 4, label: "앵무새", value: "4" },
        { id: 5, label: "물고기", value: "5" },
        { id: 6, label: "기타", value: "6" },
    ];

    const [errors, setErrors] = useState({
        petName: false,
        petRegistration: false,
        petGender: false,
        petBirth: false,
        petWeight: false,
        petInfo: false,
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
            petName: !formData.petName || formData.petName.trim().length < 1 || formData.petName.trim().length > 16,
            petTypeId: !formData.petTypeId || formData.petTypeId.trim().length < 1,
            petGender: !formData.petGender,
            petBirth: !formData.petBirth,
            petWeight: !formData.petWeight || formData.petWeight.trim().length === 0,
            petInfo: !formData.petInfo || formData.petInfo.trim().length === 0,
            petNeutered: !formData.petNeutered,
            petPhotos: !formData.petPhotos || formData.petPhotos.length === 0,
        };

        setErrors(newErrors);

        const hasError = Object.values(newErrors).some((val) => val === true);
        if (hasError) return;

        nextStep();
    };

    const handleDateChange = (newValue) => {
        handleChange({ target: { name: "petBirth", value: newValue ? newValue.format("YYYY-MM-DD") : "" } });
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="left" width="90%" mx="auto" gap={2}>
            <Typography variant="body1" fontWeight="bold" mb={1}>
                어떤 반려동물과 함께하고 계신가요?
            </Typography>

            <FormControl variant="standard" fullWidth sx={{ mb: 2 }} error={errors.petName}>
                <InputLabel htmlFor="petName">
                    이름 <ReqUi />
                </InputLabel>
                <Input required id="petName" name="petName" value={formData.petName} onChange={handleChange} />
                {errors.petName && <FormHelperText>반려동물 이름은 1~16자 이내로 입력해주세요.</FormHelperText>}
            </FormControl>

            <FormControl variant="standard" fullWidth sx={{ mb: 2 }} error={errors.petTypeId}>
                <FormHelperText sx={{ mb: 1 }}>
                    반려동물을 등록해주세요 <ReqUi />
                </FormHelperText>
                <Grid container spacing={1}>
                    {petTypes.map((type) => (
                        <Grid item size={4} key={type.id}>
                            <Button
                                fullWidth
                                variant={formData.petTypeId === type.value ? "contained" : "outlined"}
                                onClick={() => handleChange({ target: { name: "petTypeId", value: type.value } })}
                                sx={{
                                    width: "100%",
                                    backgroundColor: formData.petTypeId === type.value ? "#E9A260" : "inherit",
                                    color: formData.petTypeId === type.value ? "#fff" : "inherit",
                                    borderColor: "#E9A260",
                                    "&:hover": {
                                        backgroundColor: "#e08a3a",
                                        borderColor: "#e08a3a",
                                    },
                                }}
                            >
                                {type.label}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
                {errors.petTypeId && <FormHelperText>반려동물 종류를 선택해주세요.</FormHelperText>}
            </FormControl>

            <FormControl variant="standard" fullWidth sx={{ mb: 2 }} error={errors.petGender}>
                <FormHelperText sx={{ mb: 1 }}>
                    아이의 성별을 선택해주세요 <ReqUi />
                </FormHelperText>
                <Grid container spacing={1}>
                    {["남아", "여아"].map((gender) => (
                        <Grid item size={6} key={gender}>
                            <Button
                                fullWidth
                                variant={formData.petGender === gender ? "contained" : "outlined"}
                                onClick={() => handleChange({ target: { name: "petGender", value: gender } })}
                                sx={{
                                    height: "48px",
                                    backgroundColor: formData.petGender === gender ? "#E9A260" : "inherit",
                                    color: formData.petGender === gender ? "#fff" : "inherit",
                                    borderColor: "#E9A260",
                                    "&:hover": {
                                        backgroundColor: "#e08a3a",
                                        borderColor: "#e08a3a",
                                    },
                                }}
                            >
                                {gender}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
                {errors.petGender && <FormHelperText>성별을 선택해주세요.</FormHelperText>}
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <FormControl variant="standard" fullWidth sx={{ mb: 2 }} error={errors.petBirthday}>
                    <FormHelperText>
                        아이의 생일은 언제인가요? <ReqUi />
                    </FormHelperText>
                    <MobileDatePicker
                        value={formData.petBirth ? dayjs(formData.petBirth) : null}
                        onChange={handleDateChange}
                    />
                    {errors.petBirth && <FormHelperText>반려동물의 생일을 선택해주세요.</FormHelperText>}
                </FormControl>
            </LocalizationProvider>

            <FormControl variant="standard" fullWidth sx={{ mb: 2 }} error={errors.petWeight}>
                <InputLabel htmlFor="petWeight" sx={{ mb: 4 }}>
                    몸무게를 입력해 주세요 <ReqUi />
                </InputLabel>
                <Input
                    required
                    id="petWeight"
                    name="petWeight"
                    placeholder="몸무게를 입력해 주세요"
                    value={formData.petWeight}
                    onChange={handleChange}
                />
                {errors.petWeight && <FormHelperText>몸무게를 입력해주세요.</FormHelperText>}
            </FormControl>

            <FormControl variant="standard" fullWidth sx={{ mb: 2 }} error={errors.petIntroduction}>
                <FormHelperText>
                    아이를 소개해 주세요 <ReqUi />
                </FormHelperText>
                <TextareaAutosize
                    id="petInfo"
                    name="petInfo"
                    minRows={3}
                    placeholder="아이의 특징을 적어주세요"
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        borderColor: errors.petInfo ? "red" : "#ccc",
                        borderWidth: "1px",
                        borderStyle: "solid",
                    }}
                    value={formData.petInfo}
                    onChange={handleChange}
                />
                {errors.petInfo && <FormHelperText>소개글을 입력해주세요.</FormHelperText>}
            </FormControl>

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

            <Grid container spacing={1}>
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
                        다음
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Step2;
