import React from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";

const Step4 = () => {
    const navigate = useNavigate();
    return (
        <div>
            <FormControl margin="normal">
                <FormLabel id="pet-gender-label">
                    중성화 여부를 알려주세요 *
                </FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="pet-gender-label"
                    name="pet-gender"
                >
                    <FormControlLabel value="Y" control={<Radio />} label="O" />
                    <FormControlLabel value="N" control={<Radio />} label="X" />
                </RadioGroup>
            </FormControl>
            <br />
            <TextField
                required
                id="nickname"
                label="좋아하는 것을 알려주세요."
                variant="standard"
                placeholder="ex) 공놀이, 산책"
                focused
            />
            <br />
            아이 사진등록하기
            <br />
            첫번째 사진으로 프로필 사진이 등록됩니다.*
            <br />
            (구현예정)
            <br />
            <button onClick={() => navigate("/")}>제출</button>
        </div>
    );
};

export default Step4;
