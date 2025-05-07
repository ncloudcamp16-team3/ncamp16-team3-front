import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Button, Fade, Modal, Typography } from "@mui/material";

const GlobalConfirmModal = ({
    open,
    onClose,
    onConfirm,
    title = "확인",
    description = "진행하시겠습니까?",
    confirmText = "확인",
    cancelText = "취소",
}) => {
    const theme = useTheme();

    return (
        <Modal open={open} onClose={onClose} disableScrollLock sx={{ zIndex: 10000 }}>
            <Fade in={open}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 300,
                        bgcolor: theme.brand5,
                        borderRadius: 3,
                        boxShadow: 24,
                        p: 4,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {description}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            gap: "20px",
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={onConfirm}
                            sx={{
                                mt: 2,
                                borderRadius: 2,
                                backgroundColor: theme.brand3,
                                px: "25px",
                                "&:hover": { backgroundColor: "#e68a3d" },
                            }}
                        >
                            {confirmText}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={onClose}
                            sx={{
                                mt: 2,
                                borderRadius: 2,
                                backgroundColor: theme.brand2,
                                color: "black",
                                px: "25px",
                                "&:hover": { backgroundColor: "#E0C8A2" },
                            }}
                        >
                            {cancelText}
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

export default GlobalConfirmModal;
