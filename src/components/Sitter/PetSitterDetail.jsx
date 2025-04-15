import React, { useEffect } from "react";
import { Box, Typography, Button, Dialog, IconButton, Avatar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const PetSitterDetail = ({ sitter, open, onClose }) => {
    const navigate = useNavigate();

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

    // 채팅방으로 이동
    const handleChatStart = () => {
        // 지금은 임시로 roomId 1로 설정
        const roomId = 1;
        navigate(`/chat/room/${roomId}`);
    };

    if (!sitter) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            disableScrollLock={true}
            PaperProps={{
                sx: {
                    borderRadius: "16px",
                    m: 1,
                    maxHeight: "90vh",
                    boxShadow: "none",
                },
            }}
        >
            {/* 헤더 */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    borderBottom: "1px solid #f0f0f0",
                }}
            >
                <Typography variant="h6" fontWeight="bold">
                    펫시터 상세정보
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box sx={{ p: 2, maxHeight: "calc(90vh - 180px)", overflow: "auto" }}>
                {/* 프로필 이미지와 기본 정보 */}
                <Box sx={{ display: "flex", mb: 3 }}>
                    <Avatar
                        src={sitter.image}
                        alt={sitter.name}
                        sx={{ width: 100, height: 100, borderRadius: "16px" }}
                    />
                    <Box sx={{ ml: 2, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <Typography variant="h6" fontWeight="bold">
                            {sitter.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {sitter.age} • {sitter.experience ? "경험 있음" : "경험 없음"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {sitter.house_type} • 반려동물 {sitter.pet_count}마리
                        </Typography>
                    </Box>
                </Box>

                {/* 상세 정보 */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                        자기소개
                    </Typography>
                    <Typography variant="body2" mb={2}>
                        {sitter.description}
                    </Typography>

                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                        주거 환경
                    </Typography>
                    <Typography variant="body2" mb={2}>
                        {sitter.house_type}에 거주하고 있습니다.
                        {sitter.pet_count > 0
                            ? ` 현재 ${sitter.pet_type} ${sitter.pet_count}마리와 함께 생활하고 있어요.`
                            : " 현재 반려동물 없이 생활하고 있어요."}
                    </Typography>

                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                        펫시터 경험
                    </Typography>
                    <Typography variant="body2">
                        {sitter.experience
                            ? "이전에 펫시터 경험이 있어 안전하게 케어해 드릴 수 있습니다."
                            : "펫시터 경험은 없지만 정성을 다해 돌보겠습니다."}
                    </Typography>
                </Box>

                {/* 주의사항 */}
                <Box sx={{ mb: 3, p: 2, bgcolor: "#FFF7EF", borderRadius: "8px" }}>
                    <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                        주의사항
                    </Typography>
                    <Typography variant="body2">
                        • 반려동물의 건강상태와 특이사항을 미리 알려주세요.
                        <br />
                        • 예약 시간을 준수해 주세요.
                        <br />• 반려동물 용품(간식, 장난감 등)을 함께 가져와주시면 좋습니다.
                    </Typography>
                </Box>
            </Box>

            {/* 버튼 영역 */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 2,
                    borderTop: "1px solid #f0f0f0",
                }}
            >
                <Button
                    variant="outlined"
                    sx={{
                        flex: 1,
                        mr: 1,
                        borderColor: "#E9A260",
                        color: "#E9A260",
                        borderRadius: "8px",
                    }}
                    onClick={onClose}
                >
                    취소
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        flex: 1,
                        ml: 1,
                        bgcolor: "#E9A260",
                        color: "white",
                        "&:hover": { bgcolor: "#d0905a" },
                        borderRadius: "8px",
                    }}
                    onClick={handleChatStart}
                >
                    채팅하기
                </Button>
            </Box>
        </Dialog>
    );
};

export default PetSitterDetail;
