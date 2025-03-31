import React from "react";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import TextareaAutosize from "@mui/material/TextareaAutosize";

const Step3 = ({ nextStep }) => {
    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["MobileDatePicker"]}>
                    <DemoItem label="아이의 생일은 언제인가요? *">
                        <MobileDatePicker defaultValue={dayjs("2022-04-17")} />
                    </DemoItem>
                </DemoContainer>
            </LocalizationProvider>
            <br />
            <TextField
                required
                id="weight"
                label="몸무게를 입력해 주세요."
                variant="standard"
                placeholder=""
                focused
            />
            <br />
            <FormControl margin="normal">
                <FormLabel id="pet-type-label">
                    체형을 선택해 주세요 *
                </FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="pet-type-label"
                    name="pet-gender"
                >
                    <FormControlLabel
                        value="S"
                        control={<Radio />}
                        label="날씬"
                    />
                    <FormControlLabel
                        value="M"
                        control={<Radio />}
                        label="적당"
                    />
                    <FormControlLabel
                        value="L"
                        control={<Radio />}
                        label="통통"
                    />
                </RadioGroup>
            </FormControl>
            <br />
            아이를 소개해 주세요 * <br />
            <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder="Minimum 3 rows"
                style={{ width: 200 }}
            />
            <br />
            <button onClick={nextStep}>다음</button>
        </div>
    );
};

export default Step3;
