import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/**
 * 펫시터 탈퇴 모달 컴포넌트
 * @param {Object} props
 * @param {boolean} props.open 모달 열림 상태
 * @param {Function} props.onClose 닫기 핸들러
 * @param {Function} props.onConfirm 확인 핸들러
 */
const PetSitterQuitModal = ({ open, onClose, onConfirm }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                },
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
                    onClick={onConfirm}
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
        </Dialog>
    );
};

export default PetSitterQuitModal;
