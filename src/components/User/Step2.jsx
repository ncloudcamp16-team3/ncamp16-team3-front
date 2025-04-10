import * as React from "react";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import { Box, Button, FormHelperText, Grid, InputLabel, Typography } from "@mui/material";
import ReqUi from "./ReqUi.jsx";
import { useRegister } from "./RegisterContext.jsx";
import { useState } from "react";

const Step2 = () => {
    const { nextStep, handleChange, formData, prevStep } = useRegister();

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
    });

    const handleNext = () => {
        const newErrors = {
            petName: !formData.petName || formData.petName.trim().length < 1 || formData.petName.trim().length > 16,
            petTypeId: !formData.petTypeId || formData.petTypeId.trim().length < 1,
            petGender: !formData.petGender,
        };

        setErrors(newErrors);

        const hasError = Object.values(newErrors).some((val) => val === true);
        if (hasError) return;

        nextStep();
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

            <Button variant="contained" onClick={prevStep} sx={{ mt: 1, width: "100%", backgroundColor: "#E9A260" }}>
                뒤로
            </Button>

            <Button variant="contained" onClick={handleNext} sx={{ mt: 1, width: "100%", backgroundColor: "#E9A260" }}>
                다음
            </Button>
        </Box>
    );
};

export default Step2;
