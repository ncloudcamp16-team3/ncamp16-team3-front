import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import { Box, Button, FormHelperText, InputLabel, Typography } from "@mui/material";
import ReqUi from "./ReqUi.jsx";
import { useRegister } from "./RegisterContext.jsx";

const Step2 = () => {
    const { nextStep, handleChange, formData, prevStep } = useRegister();
    return (
        <Box display="flex" flexDirection="column" alignItems="left" width="90%" mx="auto" gap={2}>
            <Typography variant="body1" fontWeight="bold" mb={1}>
                어떤 반려동물과 함께하고 계신가요?
            </Typography>

            <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                <InputLabel htmlFor="petName">
                    이름 <ReqUi />
                </InputLabel>
                <Input required id="petName" name="petName" value={formData.petName} onChange={handleChange} />
            </FormControl>

            <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                <InputLabel htmlFor="petRegistration">
                    애완동물을 등록해주세요 <ReqUi />
                </InputLabel>
                <Input
                    required
                    id="petRegistration"
                    name="petRegistration"
                    placeholder="애완동물을 입력해주세요"
                    value={formData.petRegistration}
                    onChange={handleChange}
                />
            </FormControl>

            <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                <FormHelperText>
                    아이의 성별을 선택해주세요 <ReqUi />
                </FormHelperText>
                <RadioGroup row id="petGender" name="petGender" value={formData.petGender} onChange={handleChange}>
                    <FormControlLabel value="남아" control={<Radio />} label="남아" />
                    <FormControlLabel value="여아" control={<Radio />} label="여아" />
                </RadioGroup>
            </FormControl>

            <Button variant="contained" onClick={prevStep} sx={{ mt: 3, width: "100%", backgroundColor: "#E9A260" }}>
                뒤로
            </Button>

            <Button variant="contained" onClick={nextStep} sx={{ mt: 3, width: "100%", backgroundColor: "#E9A260" }}>
                다음
            </Button>
        </Box>
    );
};

export default Step2;
