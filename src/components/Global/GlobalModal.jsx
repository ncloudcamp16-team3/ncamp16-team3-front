import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 360,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    textAlign: "center",
};

const GlobalModal = ({ open, onClose, message }) => {
    const navigate = useNavigate();

    const handleConfirm = () => {
        if (message?.onConfirm) {
            message.onConfirm(); // ✅ 직접 함수 실행
        } else if (message?.redirectUrl) {
            navigate(message.redirectUrl); // ✅ 이동
        }
        onClose(); // 항상 닫음
    };

    const handleCancel = () => {
        if (message?.onCancel) {
            message.onCancel(); // ✅ 커스텀 취소 로직
        }
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" fontWeight="bold">
                    {message?.title || "알림"}
                </Typography>

                <Typography sx={{ mt: 2, whiteSpace: "pre-line" }}>{message?.text || "내용 없음"}</Typography>

                <Box mt={4} display="flex" justifyContent="center" gap={2}>
                    {/* ✅ 3. Yes/No 용도 */}
                    {message?.showCancel && (
                        <Button variant="outlined" onClick={handleCancel}>
                            {message?.cancelText || "아니요"}
                        </Button>
                    )}

                    <Button variant="contained" onClick={handleConfirm}>
                        {message?.confirmText || "확인"}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default GlobalModal;
