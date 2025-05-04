import * as React from "react";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import { Alert, Box, Button, FormHelperText, Grid, InputLabel, Snackbar, Typography } from "@mui/material";
import ReqUi from "./ReqUi.jsx";
import { useRegister } from "./RegisterContext.jsx";
import { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // ✅ 한글 로케일 불러오기
dayjs.locale("ko"); // ✅ 한글 설정
import { koKR } from "@mui/x-date-pickers/locales";

const Step2 = () => {
    const { nextStep, handleChange, formData, prevStep } = useRegister();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); // 화면 이동시 스크롤 맨 위로

    const petTypes = [
        { id: 1, label: "강아지", value: "1" },
        { id: 2, label: "고양이", value: "2" },
        { id: 3, label: "햄스터", value: "3" },
        { id: 4, label: "앵무새", value: "4" },
        { id: 5, label: "물고기", value: "5" },
        { id: 6, label: "기타", value: "6" },
    ];

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const [errors, setErrors] = useState({});

    const handleNext = () => {
        const today = new Date();
        const birthDate = formData.petBirth ? new Date(formData.petBirth) : null;

        const newErrors = {
            petName: !formData.petName || formData.petName.trim().length < 1 || formData.petName.trim().length > 16,
            petTypeId: !formData.petTypeId,
            petGender: !formData.petGender,
            petBirth: !birthDate || birthDate > today,
            petWeight: !formData.petWeight || isNaN(Number(formData.petWeight)) || Number(formData.petWeight) <= 0,
        };

        setErrors(newErrors);

        // 에러 메시지 처리
        if (newErrors.petName) {
            showSnackbar("반려동물 이름은 1~16자 이내로 입력해주세요.");
            return;
        }
        if (newErrors.petTypeId) {
            showSnackbar("반려동물 종류를 선택해주세요.");
            return;
        }
        if (newErrors.petGender) {
            showSnackbar("반려동물 성별을 선택해주세요.");
            return;
        }
        if (!birthDate) {
            showSnackbar("반려동물 생일을 선택해주세요.");
            return;
        }
        if (birthDate > today) {
            showSnackbar("반려동물 생일은 오늘보다 미래일 수 없습니다.");
            return;
        }
        if (!formData.petWeight || isNaN(Number(formData.petWeight)) || Number(formData.petWeight) <= 0) {
            showSnackbar("반려동물 몸무게는 0보다 큰 숫자로 입력해주세요.");
            return;
        }

        nextStep();
    };

    const handleDateChange = (newValue) => {
        handleChange({ target: { name: "petBirth", value: newValue ? newValue.format("YYYY-MM-DD") : "" } });
    };

    return (
        <>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="left"
                width="90%"
                mx="auto"
                mt={3}
                gap={2}
                sx={{
                    position: "relative",
                }}
            >
                <Typography variant="body1" fontWeight="bold" mb={1}>
                    어떤 반려동물과 함께하고 계신가요?
                </Typography>

                <FormControl variant="standard" fullWidth sx={{ mb: 2 }} error={errors.petName}>
                    <InputLabel htmlFor="petName">
                        <>
                            이름 <ReqUi />
                        </>
                    </InputLabel>
                    <Input required id="petName" name="petName" value={formData.petName} onChange={handleChange} />
                </FormControl>

                <FormControl variant="standard" fullWidth sx={{ mb: 2 }} error={errors.petTypeId}>
                    <FormHelperText sx={{ mb: 1 }}>
                        <>
                            반려동물을 등록해주세요 <ReqUi />
                        </>
                    </FormHelperText>
                    <Grid container spacing={1}>
                        {petTypes.map((type) => (
                            <Grid item size={4} key={type.id}>
                                <Button
                                    fullWidth
                                    variant={formData.petTypeId === type.value ? "contained" : "outlined"}
                                    onClick={() => handleChange({ target: { name: "petTypeId", value: type.value } })}
                                    sx={{
                                        width: "100%",
                                        backgroundColor: formData.petTypeId === type.value ? "#E9A260" : "inherit",
                                        color: formData.petTypeId === type.value ? "#fff" : "inherit",
                                        borderColor: "#E9A260",
                                        "&:hover": {
                                            backgroundColor: "#e08a3a",
                                            borderColor: "#e08a3a",
                                        },
                                    }}
                                >
                                    {type.label}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </FormControl>

                <FormControl variant="standard" fullWidth sx={{ mb: 2 }} error={errors.petGender}>
                    <FormHelperText sx={{ mb: 1 }}>
                        <>
                            아이의 성별을 선택해주세요 <ReqUi />
                        </>
                    </FormHelperText>
                    <Grid container spacing={1}>
                        {["남아", "여아"].map((gender) => (
                            <Grid item size={6} key={gender}>
                                <Button
                                    fullWidth
                                    variant={formData.petGender === gender ? "contained" : "outlined"}
                                    onClick={() => handleChange({ target: { name: "petGender", value: gender } })}
                                    sx={{
                                        height: "48px",
                                        backgroundColor: formData.petGender === gender ? "#E9A260" : "inherit",
                                        color: formData.petGender === gender ? "#fff" : "inherit",
                                        borderColor: "#E9A260",
                                        "&:hover": {
                                            backgroundColor: "#e08a3a",
                                            borderColor: "#e08a3a",
                                        },
                                    }}
                                >
                                    {gender}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </FormControl>

                <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="ko" // ✅ 핵심: dayjs 한글 적용
                    localeText={koKR.components.MuiLocalizationProvider.defaultProps.localeText}
                >
                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }} error={errors.petBirth}>
                        <FormHelperText sx={{ mb: 1 }}>
                            <>
                                아이의 생일은 언제인가요? <ReqUi />
                            </>
                        </FormHelperText>
                        <MobileDatePicker
                            value={formData.petBirth ? dayjs(formData.petBirth) : null}
                            onChange={handleDateChange}
                        />
                    </FormControl>
                </LocalizationProvider>

                <FormControl variant="standard" fullWidth sx={{ mb: 2 }} error={errors.petWeight}>
                    <InputLabel htmlFor="petWeight" sx={{ mb: 4 }}>
                        <>
                            몸무게를 입력해 주세요(kg) <ReqUi />
                        </>
                    </InputLabel>
                    <Input
                        required
                        type="number"
                        id="petWeight"
                        name="petWeight"
                        placeholder="몸무게를 입력해 주세요(kg)"
                        value={formData.petWeight}
                        onChange={handleChange}
                    />
                </FormControl>
            </Box>

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
                            variant="contained"
                            onClick={prevStep}
                            sx={{ mt: 1, width: "100%", backgroundColor: "#fff", color: "black" }}
                        >
                            뒤로
                        </Button>
                    </Grid>

                    <Grid item size={6}>
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mt: 1, width: "100%", backgroundColor: "#E9A260" }}
                        >
                            다음
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* Snackbar 컴포넌트 추가 */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="error">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Step2;
