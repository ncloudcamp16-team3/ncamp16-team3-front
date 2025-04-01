import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import {
    Box,
    Button,
    FormHelperText,
    InputAdornment,
    InputLabel,
    Typography,
} from "@mui/material";
import RequiUi from "./RequiUi.jsx";

const Step2 = ({ nextStep, handleChange, formData, prevStep }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="left"
            width="90%"
            mx="auto"
            gap={2}
        >
            <Typography variant="h6" fontWeight="bold" textAlign="center">
                환영합니다
            </Typography>
            <Typography
                variant="h6"
                fontWeight="bold"
                mb={1}
                textAlign="center"
            >
                회원가입이 완료되었어요!
            </Typography>

            <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                <InputLabel htmlFor="nickname">
                    닉네임 <RequiUi />
                </InputLabel>
                <Input
                    required
                    id="nickname"
                    name="nickname"
                    placeholder="2~16자 이내로 입력해주세요"
                    value={formData.nickname}
                    onChange={handleChange}
                    startAdornment={<InputAdornment />}
                />
            </FormControl>

            <Typography
                variant="body1"
                fontWeight="bold"
                mb={1}
                alignItems="left"
            >
                어떤 반려동물과 함께하고 계신가요?
            </Typography>

            <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                <InputLabel htmlFor="pet-name">
                    이름 <RequiUi />
                </InputLabel>
                <Input
                    required
                    id="petName"
                    name="petName"
                    value={formData.petName}
                    onChange={handleChange}
                    startAdornment={<InputAdornment />}
                />
            </FormControl>

            <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                <InputLabel htmlFor="petRegistration">
                    애완동물을 등록해주세요 <RequiUi />
                </InputLabel>
                <Input
                    required
                    id="petRegistration"
                    name="petRegistration"
                    placeholder="애완동물을 입력해주세요"
                    value={formData.petRegistration}
                    onChange={handleChange}
                    startAdornment={<InputAdornment />}
                />
            </FormControl>

            <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                <FormHelperText>
                    아이의 성별을 선택해주세요 <RequiUi />
                </FormHelperText>
                <RadioGroup
                    row
                    aria-required
                    id="petGender"
                    name="petGender"
                    justifyContent="center"
                    value={formData.petGender}
                    onChange={handleChange}
                >
                    <FormControlLabel
                        value="남아"
                        control={<Radio />}
                        label="남아"
                    />
                    <FormControlLabel
                        value="여아"
                        control={<Radio />}
                        label="여아"
                    />
                </RadioGroup>
            </FormControl>

            <Button
                variant="contained"
                onClick={prevStep}
                sx={{ mt: 3, width: "100%", backgroundColor: "#E9A260" }}
            >
                뒤로
            </Button>

            <Button
                variant="contained"
                alignItems="center"
                onClick={nextStep}
                sx={{ mt: 3, width: "100%", backgroundColor: "#E9A260" }}
            >
                다음
            </Button>
        </Box>
    );
};

export default Step2;
