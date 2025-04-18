import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Modal, TextField } from "@mui/material";


const WithdrawalModal = ({ open, onClose, inputValue, onInputChange, onWithdrawal }) => {
    useEffect(() => {
        if (!open) return;

        const styleElement = document.createElement("style");
        styleElement.setAttribute("id", "modal-overlay-styles");

        styleElement.textContent = `
            .header {
                opacity: 1 !important;
                filter: brightness(0.5);
                pointer-events: none !important;
            }
            .footer {
                opacity: 1 !important;
                filter: brightness(0.5);
                pointer-events: none !important;
            }
        `;

        document.head.appendChild(styleElement);

        return () => {
            const existingStyle = document.getElementById("modal-overlay-styles");
            if (existingStyle) {
                document.head.removeChild(existingStyle);
            }
        };
    }, [open]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            disableScrollLock={true}
            BackdropProps={{
                style: {
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                },
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
                        onClick={onWithdrawal}
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
        </Modal>
    );
};

const NicknameEditModal = ({ open, onClose, currentNickname, onSave }) => {
    const [nickname, setNickname] = useState(currentNickname);

    useEffect(() => {
        if (!open) return;

        const styleElement = document.createElement("style");
        styleElement.setAttribute("id", "modal-overlay-styles");

        styleElement.textContent = `
        .header, .footer {
            opacity: 1 !important;
                filter: brightness(0.5);
                pointer-events: none !important;
        }
    `;

        document.head.appendChild(styleElement);

        return () => {
            const existingStyle = document.getElementById("modal-overlay-styles");
            if (existingStyle) {
                document.head.removeChild(existingStyle);
            }
        };
    }, [open]);

    const handleSave = () => {
        const trimmedNickname = nickname.trim();
        if (trimmedNickname) {
            onSave(trimmedNickname);
            onClose();
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            disableScrollLock={true}
            BackdropProps={{
                style: {
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                },
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
                    (8-20 글자 입력)
                </Typography>
                <TextField
                    fullWidth
                    size="small"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="새로운 닉네임 입력"
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
                        onClick={handleSave}
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
                        수정
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};
export { WithdrawalModal, NicknameEditModal };
