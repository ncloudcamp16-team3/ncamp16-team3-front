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
        if (message?.redirectUrl) {
            navigate(message.redirectUrl);
        }
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" fontWeight="bold">
                    {message?.title || "알림"}
                </Typography>

                <Typography sx={{ mt: 2 }}>{message?.text || "내용 없음"}</Typography>

                <Box mt={4} display="flex" justifyContent="center" gap={2}>
                    <Button variant="outlined" onClick={onClose}>
                        {message?.cancelText || "닫기"}
                    </Button>
                    {message?.redirectUrl && (
                        <Button variant="contained" onClick={handleConfirm}>
                            {message?.confirmText || "이동"}
                        </Button>
                    )}
                </Box>
            </Box>
        </Modal>
    );
};

export default GlobalModal;
