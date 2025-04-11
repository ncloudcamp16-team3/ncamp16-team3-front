import * as React from "react";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import { Box, Button, InputLabel, Typography, FormHelperText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ReqUi from "./ReqUi.jsx";
import { useRegister } from "./RegisterContext.jsx";
import { useState, useEffect } from "react";

const Step1 = () => {
    const { nextStep, nickname, setNickname, email, snsTypeId } = useRegister(); // ✅ email, snsTypeId 가져오기
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!email || !snsTypeId) {
            // 데이터를 아직 못 받았으면 기다림
            return;
        }

        setLoaded(true);
    }, [email, snsTypeId]);

    useEffect(() => {
        if (loaded && (!email || !snsTypeId)) {
            navigate("/login");
        }
    }, [loaded, email, snsTypeId]);

    const handleNext = () => {
        if (!nickname || nickname.trim().length < 2 || nickname.trim().length > 16) {
            setError(true);
            return;
        }
        setError(false);
        nextStep();
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="left" width="90%" mx="auto" gap={2}>
            <Typography variant="h6" fontWeight="bold" textAlign="center">
                환영합니다
            </Typography>
            <Typography variant="body1" textAlign="center" mb={2}>
                회원가입이 완료되었어요! 닉네임을 설정해주세요.
            </Typography>

            <FormControl variant="standard" fullWidth error={error}>
                <InputLabel htmlFor="nickname">
                    닉네임 <ReqUi />
                </InputLabel>
                <Input
                    required
                    id="nickname"
                    name="nickname"
                    placeholder="2~16자 이내로 입력해주세요"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />
                {error && <FormHelperText>닉네임은 2~16자 이내로 입력해주세요.</FormHelperText>}
            </FormControl>

            <Button
                variant="contained"
                onClick={() => navigate("/login")}
                sx={{ mt: 1, width: "100%", backgroundColor: "#E9A260" }}
            >
                뒤로
            </Button>

            <Button variant="contained" onClick={handleNext} sx={{ mt: 1, width: "100%", backgroundColor: "#E9A260" }}>
                다음
            </Button>
        </Box>
    );
};

export default Step1;
