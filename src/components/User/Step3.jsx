import React, { useState } from "react";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import FormControl from "@mui/material/FormControl";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { Box, Button, FormHelperText, InputLabel, Input } from "@mui/material";
import ReqUi from "./ReqUi.jsx";
import dayjs from "dayjs";
import { useRegister } from "./RegisterContext.jsx";

const Step3 = () => {
    const { nextStep, handleChange, formData, prevStep } = useRegister();

    const [errors, setErrors] = useState({
        petBirth: false,
        petWeight: false,
        petInfo: false,
    });

    const handleNext = () => {
        const newErrors = {
            petBirth: !formData.petBirth,
            petWeight: !formData.petWeight || formData.petWeight.trim().length === 0,
            petInfo: !formData.petInfo || formData.petInfo.trim().length === 0,
        };

        setErrors(newErrors);

        const hasError = Object.values(newErrors).some((v) => v === true);
        if (hasError) return;

        nextStep();
    };

    const handleDateChange = (newValue) => {
        handleChange({ target: { name: "petBirth", value: newValue ? newValue.format("YYYY-MM-DD") : "" } });
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="left" width="90%" mx="auto" gap={2}>
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

            <Button variant="contained" onClick={prevStep} sx={{ mt: 1, width: "100%", backgroundColor: "#E9A260" }}>
                뒤로
            </Button>

            <Button variant="contained" onClick={handleNext} sx={{ mt: 1, width: "100%", backgroundColor: "#E9A260" }}>
                다음
            </Button>
        </Box>
    );
};

export default Step3;
