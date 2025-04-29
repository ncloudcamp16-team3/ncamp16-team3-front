import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Container, Avatar, CircularProgress, Alert } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate, useParams } from "react-router-dom";
import TitleBar from "../../components/Global/TitleBar.jsx";
import { getPetSitterDetails } from "../../services/petSitterService";
import { createChatRoom } from "../../services/chatService";

const PetSitterDetail = () => {
    const { sitterId } = useParams();
    const navigate = useNavigate();
    const [sitter, setSitter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPetSitterDetails = async () => {
            try {
                setLoading(true);
                const response = await getPetSitterDetails(sitterId);

                if (response && response.data) {
                    setSitter(response.data);
                } else {
                    throw new Error("펫시터 정보를 찾을 수 없습니다.");
                }
            } catch (err) {
                console.error("펫시터 상세 정보 로드 실패:", err);
                setError(err.response?.data?.message || "펫시터 정보를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchPetSitterDetails();
    }, [sitterId]);

    const handleChat = async () => {
        if (!sitter) return;

        try {
            // 채팅방 생성 API
            const chatRoomResponse = await createChatRoom(sitter.id);

            if (chatRoomResponse) {
                // 채팅방 ID로 채팅방 이동
                navigate(`/chat/room/${chatRoomResponse.channelId}`);
            }
        } catch (error) {
            console.error("채팅방 생성 오류:", error);
            alert("채팅방 생성 중 오류가 발생했습니다.");
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="error">{error}</Alert>
                <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2, width: "100%" }}>
                    돌아가기
                </Button>
            </Box>
        );
    }

    if (!sitter) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Typography>펫시터 정보를 찾을 수 없습니다.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: "#FFF", minHeight: "100vh", pb: 8 }}>
            {/* 헤더 */}
            <TitleBar name="펫시터 상세보기" />

            <Container maxWidth="sm" sx={{ pt: 3 }}>
                {/* 프로필 이미지 */}
                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                    <Avatar
                        src={sitter.imagePath}
                        alt={sitter.nickname}
                        sx={{
                            width: 120,
                            height: 120,
                            border: "2px solid #E9A260",
                            bgcolor: "#F2DFCE",
                        }}
                    />
                </Box>

                {/* 기본 정보 테이블 */}
                <Box sx={{ mb: 4 }}>
                    <InfoItem label="연령대" value={sitter.age} />
                    <InfoItem
                        label="반려동물"
                        value={`${sitter.petType?.name || "없음"} ${sitter.petCount || "0"}마리`}
                    />
                    <InfoItem label="임시보호 경험" value={sitter.sitterExp ? "있음" : "없음"} />
                    <InfoItem label="주거 형태" value={sitter.houseType} />
                    <Box
                        sx={{
                            py: 2,
                            borderBottom: "1px solid #F0F0F0",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {sitter.comment || "자기소개가 없습니다."}
                        </Typography>
                    </Box>
                </Box>

                {/* 버튼 영역 */}
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleChat}
                        startIcon={<ChatIcon />}
                        sx={{
                            bgcolor: "#F2DFCE",
                            color: "#E9A260",
                            py: 1.5,
                            borderRadius: "8px",
                            fontWeight: "bold",
                            "&:hover": { bgcolor: "#E9D1B9" },
                        }}
                    >
                        채팅하기
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleCancel}
                        sx={{
                            bgcolor: "#E9A260",
                            color: "white",
                            py: 1.5,
                            borderRadius: "8px",
                            fontWeight: "bold",
                            "&:hover": { bgcolor: "#d0905a" },
                        }}
                    >
                        취소
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

// 정보 아이템 컴포넌트
const InfoItem = ({ label, value }) => (
    <Box
        sx={{
            py: 2,
            borderBottom: "1px solid #F0F0F0",
            display: "flex",
            justifyContent: "space-between",
        }}
    >
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {label}
        </Typography>
        <Typography variant="body1">{value}</Typography>
    </Box>
);

export default PetSitterDetail;
