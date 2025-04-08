import React from "react";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { Box, Button, FormHelperText, InputLabel, Input } from "@mui/material";
import ReqUi from "./ReqUi.jsx";
import dayjs from "dayjs";
import { useRegister } from "./RegisterContext.jsx";

const Step3 = () => {
    const { nextStep, handleChange, formData, prevStep } = useRegister();

    const handleDateChange = (newValue) => {
        handleChange({ target: { name: "petBirthday", value: newValue ? newValue.format("YYYY-MM-DD") : "" } });
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="left" width="90%" mx="auto" gap={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <FormHelperText>
                    아이의 생일은 언제인가요? <ReqUi />
                </FormHelperText>
                <MobileDatePicker
                    value={formData.petBirthday ? dayjs(formData.petBirthday) : null}
                    onChange={handleDateChange}
                />
            </LocalizationProvider>

            <FormControl variant="standard" fullWidth sx={{ mb: 4 }}>
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
            </FormControl>

            <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                <FormHelperText>
                    체형을 선택해 주세요 <ReqUi />
                </FormHelperText>
                <RadioGroup
                    row
                    id="petBodyType"
                    name="petBodyType"
                    value={formData.petBodyType}
                    onChange={handleChange}
                >
                    <FormControlLabel value="날씬" control={<Radio />} label="날씬" />
                    <FormControlLabel value="적당" control={<Radio />} label="적당" />
                    <FormControlLabel value="통통" control={<Radio />} label="통통" />
                </RadioGroup>
            </FormControl>

            <FormHelperText>
                아이를 소개해 주세요 <ReqUi />
            </FormHelperText>
            <TextareaAutosize
                id="petIntroduction"
                name="petIntroduction"
                minRows={3}
                placeholder="아이의 특징을 적어주세요"
                style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    borderColor: "#ccc",
                }}
                value={formData.petIntroduction}
                onChange={handleChange}
            />

            <Button variant="contained" onClick={prevStep} sx={{ mt: 3, width: "100%", backgroundColor: "#E9A260" }}>
                뒤로
            </Button>

            <Button variant="contained" onClick={nextStep} sx={{ mt: 3, width: "100%", backgroundColor: "#E9A260" }}>
                다음
            </Button>
        </Box>
    );
};

export default Step3;
