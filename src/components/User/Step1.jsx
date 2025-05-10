import * as React from "react";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import { Box, Button, InputLabel, Typography, Grid, Alert, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ReqUi from "./ReqUi.jsx";
import { useRegister } from "./RegisterContext.jsx";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { checkNickname } from "../../services/authService.js"; // ✅ 한글 로케일 불러오기
dayjs.locale("ko"); // ✅ 한글 설정

const Step1 = () => {
    const { nextStep, nickname, setNickname, snsAccountId, snsTypeId } = useRegister(); // ✅ email, snsTypeId 가져오기
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // 어떤 에러인지 저장

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); // 화면 이동시 스크롤 맨 위로

    useEffect(() => {
        if (!snsAccountId || !snsTypeId) {
            return;
        }

        setLoaded(true);
    }, [snsAccountId, snsTypeId]);

    useEffect(() => {
        if (loaded && (!snsAccountId || !snsTypeId)) {
            navigate("/login");
        }
    }, [loaded, snsAccountId, snsTypeId]);

    const validateNickname = (value) => {
        return value.trim().length >= 2 && value.trim().length <= 8;
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setNickname(value);
        setError(false);
        setShowSnackbar(false);
        setErrorMessage("");
    };

    const handleNext = async () => {
        const trimmedNickname = nickname.trim();

        if (!validateNickname(trimmedNickname)) {
            setError(true);
            setErrorMessage("닉네임은 2~8자 이내로 입력해주세요.");
            setShowSnackbar(true);
            return;
        }

        const result = await checkNickname(trimmedNickname);
        if (result?.exists) {
            setError(true);
            setErrorMessage("이미 사용 중인 닉네임입니다.");
            setShowSnackbar(true);
            return;
        }

        if (result === null) {
            // API 호출 자체 실패한 경우
            setError(true);
            setErrorMessage("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            setShowSnackbar(true);
            return;
        }

        nextStep();
    };

    return (
        <>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="left"
                width="90%"
                mx="auto"
                gap={2}
                sx={{
                    position: "relative",
                }}
            >
                <Typography variant="h6" fontWeight="bold" textAlign="center" mt={3}>
                    환영합니다
                </Typography>
                <Typography variant="body1" textAlign="center" mb={2}>
                    회원가입이 완료되었어요! 닉네임을 설정해주세요.
                </Typography>

                <FormControl
                    variant="standard"
                    fullWidth
                    error={error}
                    component="form"
                    onSubmit={(e) => {
                        e.preventDefault(); // 기본 새로고침 방지
                        handleNext();
                    }}
                >
                    <InputLabel htmlFor="nickname">
                        닉네임 <ReqUi /> (닉네임은 2~8자 이내로 입력해주세요.)
                    </InputLabel>
                    <Input
                        required
                        id="nickname"
                        name="nickname"
                        placeholder="2~8자 이내로 입력해주세요"
                        value={nickname}
                        onChange={handleChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault(); // 이 줄은 optional (안해도 동작함)
                                handleNext();
                            }
                        }}
                    />
                </FormControl>
            </Box>

            <Snackbar
                open={showSnackbar}
                autoHideDuration={3000}
                onClose={() => setShowSnackbar(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity="error" onClose={() => setShowSnackbar(false)}>
                    {errorMessage}
                </Alert>
            </Snackbar>

            <Box
                sx={{
                    position: "fixed",
                    maxWidth: "500px",
                    bottom: 0,
                    width: "100%", // 화면 전체
                    backgroundColor: "#fff",
                    zIndex: 1000,
                    paddingX: 1,
                    paddingBottom: 1,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Grid container spacing={2} sx={{ width: "95%" }}>
                    <Grid item size={6}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => navigate("/login")}
                            sx={{
                                backgroundColor: "#fff",
                                color: "black",
                            }}
                        >
                            뒤로
                        </Button>
                    </Grid>
                    <Grid item size={6}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleNext}
                            sx={{
                                backgroundColor: "#E9A260",
                            }}
                        >
                            다음
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default Step1;
