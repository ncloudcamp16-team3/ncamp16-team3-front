import React from "react";
import { Box, Typography } from "@mui/material";

const MyPostCenterMenu = ({ open, onClose, onDelete, onEdit }) => {
    if (!open) return null;

    return (
        <Box
            onClick={onClose}
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 1300,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box
                onClick={(e) => e.stopPropagation()} // 배경 클릭 방지
                sx={{
                    width: "300px",
                    backgroundColor: "#222",
                    borderRadius: "12px",
                    overflow: "hidden",
                    color: "white",
                    textAlign: "center",
                    fontSize: "16px",
                }}
            >
                <Box
                    sx={{
                        p: 2,
                        borderBottom: "1px solid #444",
                        color: "tomato",
                        cursor: "pointer",
                    }}
                    onClick={onDelete}
                >
                    삭제
                </Box>
                <Box
                    sx={{
                        p: 2,
                        cursor: "pointer",
                    }}
                    onClick={onEdit}
                >
                    수정
                </Box>
                <Box
                    sx={{
                        p: 2,
                        borderTop: "1px solid #444",
                        color: "#aaa",
                        cursor: "pointer",
                    }}
                    onClick={onClose}
                >
                    취소
                </Box>
            </Box>
        </Box>
    );
};

export default MyPostCenterMenu;
