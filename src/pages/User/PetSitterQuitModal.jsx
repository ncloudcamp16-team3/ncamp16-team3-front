import React from "react";
import { Box, Typography, Button, Modal } from "@mui/material";

const PetSitterQuitModal = ({ open, onClose, onConfirm }) => {
    React.useEffect(() => {
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
                    펫시터 그만두기
                </Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>
                    정말 펫시터 활동을 그만두시겠습니까?
                    <br />
                    활동을 중단하면 펫시터 신청 과정을 처음부터 다시 진행해야 합니다.
                </Typography>
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
                        onClick={onConfirm}
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
                        그만두기
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default PetSitterQuitModal;
