import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import ModalWrapper from "/src/components/Global/DarkModal.jsx";
import GlobalSnackbar from "/src/components/Global/GlobalSnackbar.jsx";
// axios 인스턴스 가져오기
import instance from "../../services/axiosInstance.js";

const WithdrawalModal = ({ open, onClose, inputValue, onInputChange, onWithdrawal }) => {
    // 스낵바 상태
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const handleSnackbarClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const handleWithdrawal = () => {
        if (inputValue !== "탈퇴합니다") {
            setSnackbar({
                open: true,
                message: "'탈퇴합니다'를 정확히 입력해주세요.",
                severity: "warning",
            });
            return;
        }
        onWithdrawal();
    };

    return (
        <ModalWrapper
            open={Boolean(open)}
            onClose={onClose}
            modalProps={{
                disableEscapeKeyDown: false,
                disableAutoFocus: true,
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 350,
                    bgcolor: "#FFF7EF",
                    borderRadius: "12px",
                    p: 3,
                    outline: "none",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    zIndex: 1500,
                }}
            >
                <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: "bold", fontSize: "1.1rem" }}>
                    회원 탈퇴
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    회원 탈퇴하시겠습니까?
                    <br />
                    탈퇴를 원하시면 '탈퇴합니다'라고 입력하세요.
                </Typography>
                <TextField
                    fullWidth
                    size="small"
                    value={inputValue}
                    onChange={onInputChange}
                    placeholder="탈퇴합니다"
                    sx={{
                        mb: 2,
                        bgcolor: "white",
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "4px",
                            height: "45px",
                            fontSize: "0.9rem",
                        },
                    }}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
                    <Button
                        size="small"
                        onClick={onClose}
                        sx={{
                            bgcolor: "#d9d9d9",
                            color: "white",
                            "&:hover": { bgcolor: "#bbb" },
                            minWidth: "60px",
                            height: "36px",
                            fontSize: "0.8rem",
                            borderRadius: "20px",
                        }}
                    >
                        취소
                    </Button>
                    <Button
                        size="small"
                        onClick={handleWithdrawal}
                        sx={{
                            bgcolor: "#f44336",
                            color: "white",
                            "&:hover": { bgcolor: "#d32f2f" },
                            minWidth: "60px",
                            height: "36px",
                            fontSize: "0.8rem",
                            borderRadius: "20px",
                        }}
                    >
                        탈퇴
                    </Button>
                </Box>
            </Box>

            {/* 스낵바 알림 */}
            <GlobalSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                handleSnackbarClose={handleSnackbarClose}
            />
        </ModalWrapper>
    );
};

const NicknameEditModal = ({ open, onClose, currentNickname, onSave }) => {
    const [nickname, setNickname] = useState(currentNickname);
    const [error, setError] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    useEffect(() => {
        if (open) {
            setNickname(currentNickname);
            setError("");
        }
    }, [open, currentNickname]);

    const handleSnackbarClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    // 닉네임 중복 체크 함수
    const checkNicknameDuplicate = async (name) => {
        try {
            setIsChecking(true);
            const response = await instance.get(`/auth/check-nickname?nickname=${encodeURIComponent(name)}`);
            return response.data?.data?.exists === true;
        } catch (err) {
            console.error("닉네임 중복 확인 오류:", err);
            setSnackbar({
                open: true,
                message: "닉네임 중복 확인 중 오류가 발생했습니다.",
                severity: "error",
            });
            return true; // 오류 발생 시 중복으로 간주
        } finally {
            setIsChecking(false);
        }
    };

    const handleSave = async () => {
        const trimmedNickname = nickname.trim();

        if (!trimmedNickname) {
            setError("닉네임을 입력해주세요.");
            return;
        }

        if (trimmedNickname.length < 2 || trimmedNickname.length > 8) {
            setError("닉네임은 2~8자 사이로 입력해주세요.");
            return;
        }

        // 현재 닉네임과 같은 경우 중복 체크 건너뛰기
        if (trimmedNickname === currentNickname) {
            onSave(trimmedNickname);
            onClose();
            return;
        }

        // 닉네임 중복 체크
        const isDuplicate = await checkNicknameDuplicate(trimmedNickname);
        if (isDuplicate) {
            setError("이미 사용 중인 닉네임입니다.");
            return;
        }

        onSave(trimmedNickname);
        onClose();
    };

    return (
        <ModalWrapper
            open={Boolean(open)}
            onClose={onClose}
            modalProps={{
                disableEscapeKeyDown: false,
                disableAutoFocus: true,
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 350,
                    bgcolor: "#FFF7EF",
                    borderRadius: "12px",
                    p: 3,
                    outline: "none",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    zIndex: 1500,
                }}
            >
                <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: "bold", fontSize: "1.1rem" }}>
                    닉네임 변경
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    변경할 닉네임을 입력해주세요.
                    <br />
                    (2~8 글자 입력)
                </Typography>
                <TextField
                    fullWidth
                    size="small"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="새로운 닉네임 입력"
                    error={Boolean(error)}
                    helperText={error}
                    disabled={isChecking}
                    sx={{
                        mb: 2,
                        bgcolor: "white",
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "4px",
                            height: "45px",
                            fontSize: "0.9rem",
                        },
                    }}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
                    <Button
                        size="small"
                        onClick={onClose}
                        disabled={isChecking}
                        sx={{
                            bgcolor: "#d9d9d9",
                            color: "white",
                            "&:hover": { bgcolor: "#bbb" },
                            minWidth: "60px",
                            height: "36px",
                            fontSize: "0.8rem",
                            borderRadius: "20px",
                        }}
                    >
                        취소
                    </Button>
                    <Button
                        size="small"
                        onClick={handleSave}
                        disabled={isChecking}
                        sx={{
                            bgcolor: "#ffa500",
                            color: "white",
                            "&:hover": { bgcolor: "#d38a00" },
                            minWidth: "60px",
                            height: "36px",
                            fontSize: "0.8rem",
                            borderRadius: "20px",
                        }}
                    >
                        {isChecking ? "확인 중..." : "수정"}
                    </Button>
                </Box>
            </Box>

            {/* 스낵바 알림 */}
            <GlobalSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                handleSnackbarClose={handleSnackbarClose}
            />
        </ModalWrapper>
    );
};

export { WithdrawalModal, NicknameEditModal };
