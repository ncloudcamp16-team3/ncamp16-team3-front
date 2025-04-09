import * as React from "react";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import { Box, Button, InputLabel, Typography, FormHelperText, Paper } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReqUi from "./ReqUi.jsx";
import { useRegister } from "./RegisterContext.jsx";
import { useState, useEffect } from "react";

const Step1 = () => {
    const { nextStep, nickname, setNickname, setToken, setEmail, token, email, setSnsTypeId, snsTypeId } = useRegister();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [debugInfo, setDebugInfo] = useState({});

    useEffect(() => {
        const token = searchParams.get("token");
        const email = searchParams.get("email");
        const snsTypeIdStr = searchParams.get("snsTypeId");
        
        // snsTypeId를 숫자로 변환
        const snsTypeId = snsTypeIdStr ? parseInt(snsTypeIdStr, 10) : null;

        if (token) setToken(token);
        if (email) setEmail(email);
        if (snsTypeId) setSnsTypeId(snsTypeId);

        // 디버깅 정보 업데이트
        setDebugInfo({
            token,
            email,
            snsTypeId,
            snsTypeIdStr,
            allParams: Object.fromEntries(searchParams.entries()),
        });

        console.log("Step1 - URL 파라미터:", {
            token,
            email,
            snsTypeId,
            snsTypeIdStr,
            allParams: Object.fromEntries(searchParams.entries()),
        });
    }, [searchParams, setToken, setEmail, setSnsTypeId]);

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
                sx={{ mt: 3, width: "100%", backgroundColor: "#E9A260" }}
            >
                뒤로
            </Button>

            <Button variant="contained" onClick={handleNext} sx={{ mt: 2, width: "100%", backgroundColor: "#E9A260" }}>
                다음
            </Button>

            {/* 디버깅 정보 */}
            <Paper elevation={3} sx={{ p: 2, mt: 4, backgroundColor: "#f5f5f5" }}>
                <Typography variant="subtitle2" fontWeight="bold">
                    디버깅 정보 (Step 1)
                </Typography>
                <Typography variant="body2">토큰: {token || "없음"}</Typography>
                <Typography variant="body2">이메일: {email || "없음"}</Typography>
                <Typography variant="body2">닉네임: {nickname || "없음"}</Typography>
                <Typography variant="body2">SNS 타입 ID: {snsTypeId || "없음"} (타입: {typeof snsTypeId})</Typography>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                    URL 파라미터:
                </Typography>
                <pre style={{ fontSize: "0.8rem", overflow: "auto", maxHeight: "100px" }}>
                    {JSON.stringify(debugInfo, null, 2)}
                </pre>
            </Paper>
        </Box>
    );
};

export default Step1;
