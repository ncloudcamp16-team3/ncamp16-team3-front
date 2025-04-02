import React from "react";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import {
    Box,
    Button,
    FormHelperText,
    InputAdornment,
    InputLabel,
    Typography,
} from "@mui/material";
import ReqUi from "./ReqUi.jsx";
import Input from "@mui/material/Input";

const Step3 = ({ nextStep, handleChange, formData, prevStep }) => {
    // const navigate = useNavigate();

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="left"
            width="90%"
            mx="auto"
            gap={2}
        >
            <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                <FormHelperText>
                    중성화 여부를 알려주세요 <ReqUi />
                </FormHelperText>
                <RadioGroup
                    row
                    aria-required
                    id="petNeutered"
                    name="petNeutered"
                    justifyContent="center"
                    value={formData.petNeutered}
                    onChange={handleChange}
                >
                    <FormControlLabel value="Y" control={<Radio />} label="O" />
                    <FormControlLabel value="N" control={<Radio />} label="X" />
                </RadioGroup>
            </FormControl>

            <FormControl variant="standard" fullWidth sx={{ mb: 4 }}>
                <InputLabel htmlFor="petFavorite" sx={{ mb: 4 }}>
                    좋아하는 것을 알려주세요
                </InputLabel>
                <Input
                    id="petFavorite"
                    name="petFavorite"
                    placeholder="ex) 공놀이, 산책"
                    value={formData.petFavorite}
                    onChange={handleChange}
                    startAdornment={<InputAdornment />}
                />
            </FormControl>

            <Typography variant="body1" mt={3} mb={2}>
                아이 사진등록하기
            </Typography>

            <FormHelperText>
                첫번째 사진으로 프로필 사진이 등록됩니다 <ReqUi />
                <br />
                (구현 예정)
            </FormHelperText>

            <Button
                variant="contained"
                onClick={prevStep}
                sx={{ mt: 3, width: "100%", backgroundColor: "#E9A260" }}
            >
                뒤로
            </Button>

            <Button
                variant="contained"
                onClick={nextStep}
                sx={{ mt: 3, width: "100%", backgroundColor: "#E9A260" }}
            >
                다음
            </Button>
        </Box>
    );
};

export default Step3;
