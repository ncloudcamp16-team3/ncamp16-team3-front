import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import { Box, Button, FormHelperText, InputLabel, Typography } from "@mui/material";
import ReqUi from "./ReqUi.jsx";
import { useRegister } from "./RegisterContext.jsx";
import { useState } from "react";

const Step2 = () => {
    const { nextStep, handleChange, formData, prevStep } = useRegister();

    const [errors, setErrors] = useState({
        petName: false,
        petRegistration: false,
        petGender: false,
    });

    const handleNext = () => {
        const newErrors = {
            petName: !formData.petName || formData.petName.trim().length < 1 || formData.petName.trim().length > 16,
            petRegistration: !formData.petRegistration || formData.petRegistration.trim().length < 1,
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

            <FormControl variant="standard" fullWidth sx={{ mb: 2 }} error={errors.petRegistration}>
                <InputLabel htmlFor="petRegistration">
                    반려동물을 등록해주세요 <ReqUi />
                </InputLabel>
                <Input
                    required
                    id="petRegistration"
                    name="petRegistration"
                    placeholder="애완동물을 입력해주세요"
                    value={formData.petRegistration}
                    onChange={handleChange}
                />
                {errors.petRegistration && <FormHelperText>반려동물 종류를 입력해주세요.</FormHelperText>}
            </FormControl>

            <FormControl variant="standard" fullWidth sx={{ mb: 2 }} error={errors.petGender}>
                <FormHelperText>
                    아이의 성별을 선택해주세요 <ReqUi />
                </FormHelperText>
                <RadioGroup row id="petGender" name="petGender" value={formData.petGender} onChange={handleChange}>
                    <FormControlLabel value="남아" control={<Radio />} label="남아" />
                    <FormControlLabel value="여아" control={<Radio />} label="여아" />
                </RadioGroup>
                {errors.petGender && <FormHelperText>성별을 선택해주세요.</FormHelperText>}
            </FormControl>

            <Button variant="contained" onClick={prevStep} sx={{ mt: 3, width: "100%", backgroundColor: "#E9A260" }}>
                뒤로
            </Button>

            <Button variant="contained" onClick={handleNext} sx={{ mt: 3, width: "100%", backgroundColor: "#E9A260" }}>
                다음
            </Button>
        </Box>
    );
};

export default Step2;
