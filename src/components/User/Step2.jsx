import * as React from "react";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const Step2 = ({ nextStep }) => {
    return (
        // <div className="flex flex-col">
        //     두번째페이지
        //     <button className="border border-black" onClick={nextStep}>
        //         다음
        //     </button>
        // </div>
        <div>
            <div>
                <TextField
                    required
                    id="nickname"
                    label="닉네임"
                    variant="standard"
                    placeholder="2~16자 이내로 입력해주세요"
                    focused
                />
                <br />
                어떤 반려동물과 함께하고 계신가요?
                <br />
                <TextField
                    required
                    id="pet-name"
                    label="이름"
                    variant="standard"
                    focused
                />
                <br />
                <TextField
                    required
                    id="pet-registration"
                    label="애완동물을 등록해주세요"
                    variant="standard"
                    focused
                />
            </div>
            <div>
                <FormControl margin="normal">
                    <FormLabel id="pet-gender-label">
                        아이의 성별을 선택해주세요 *
                    </FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="pet-gender-label"
                        name="pet-gender"
                    >
                        <FormControlLabel
                            value="M"
                            control={<Radio />}
                            label="남아"
                        />
                        <FormControlLabel
                            value="F"
                            control={<Radio />}
                            label="여아"
                        />
                    </RadioGroup>
                </FormControl>
                <br />
                <button className="border border-black" onClick={nextStep}>
                    다음
                </button>
                <br />
            </div>
        </div>
    );
};

export default Step2;
