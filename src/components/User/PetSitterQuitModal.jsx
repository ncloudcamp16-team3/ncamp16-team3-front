import React, { useState } from "react";
import { DialogTitle, DialogContent, DialogActions, Typography, Button, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DarkModal from "/src/components/Global/DarkModal.jsx";
import GlobalSnackbar from "/src/components/Global/GlobalSnackbar.jsx";

const PetSitterQuitModal = ({ open, onClose, onConfirm }) => {
    // 스낵바 상태
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const handleSnackbarClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const handleConfirm = () => {
        onConfirm();
        setSnackbar({
            open: true,
            message: "펫시터 탈퇴 요청이 처리되었습니다.",
            severity: "success",
        });
    };

    return (
        <DarkModal
            open={Boolean(open)}
            onClose={onClose}
            modalProps={{
                fullWidth: true,
                maxWidth: "xs",
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
                    width: "90%",
                    maxWidth: "400px",
                    bgcolor: "background.paper",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    p: 0,
                    overflow: "hidden",
                }}
            >
                <DialogTitle sx={{ pb: 1, pt: 2 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6" fontWeight="bold">
                            펫시터 그만두기
                        </Typography>
                        <IconButton size="small" onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent sx={{ py: 2 }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        펫시터를 그만두시면 다음과 같은 변경사항이 있습니다:
                    </Typography>

                    <Box sx={{ backgroundColor: "#f5f5f5", borderRadius: "8px", p: 2, mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            • 더 이상 펫시터로 활동할 수 없습니다.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            • 펫시터 정보가 모두 삭제됩니다.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            • 재신청 시 관리자 승인이 필요합니다.
                        </Typography>
                    </Box>

                    <Typography variant="body2" color="error" sx={{ fontWeight: "bold" }}>
                        이 작업은 되돌릴 수 없습니다. 정말로 펫시터를 그만두시겠습니까?
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        sx={{
                            borderColor: "#E9A260",
                            color: "#E9A260",
                            "&:hover": { borderColor: "#d0905a", backgroundColor: "rgba(233, 162, 96, 0.04)" },
                            borderRadius: "4px",
                            flex: 1,
                        }}
                    >
                        취소
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant="contained"
                        sx={{
                            backgroundColor: "#f44336",
                            color: "white",
                            "&:hover": { backgroundColor: "#d32f2f" },
                            borderRadius: "4px",
                            flex: 1,
                        }}
                    >
                        확인
                    </Button>
                </DialogActions>
            </Box>

            {/* 스낵바 알림 */}
            <GlobalSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                handleSnackbarClose={handleSnackbarClose}
            />
        </DarkModal>
    );
};

export default PetSitterQuitModal;
