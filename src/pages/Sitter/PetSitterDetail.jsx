import React, { useState, useEffect } from "react";
import { Box, Typography, Button, IconButton, Container, Avatar } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate, useParams } from "react-router-dom";
import mockPetsitters from "../../mock/Sitter/petsitters.json";

const PetSitterDetail = () => {
    const { sitterId } = useParams();
    const navigate = useNavigate();
    const [sitter, setSitter] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 실제 API 호출 대신 mock 데이터에서 해당 sitterId의 펫시터 찾기
        const foundSitter = mockPetsitters.find((s) => s.id === parseInt(sitterId));

        // 펫시터 정보가 있으면 설정하고 로딩 상태 해제
        if (foundSitter) {
            setSitter(foundSitter);
        }
        setLoading(false);
    }, [sitterId]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleChat = () => {
        // 채팅 페이지로 이동
        if (sitter) {
            // 실제 구현에서는 이 부분을 채팅방 생성 또는 기존 채팅방으로 이동하도록 수정
            navigate(`/chat/room/new?targetId=${sitter.id}&targetName=${sitter.name}`);
        }
    };

    const handleCancel = () => {
        // 취소 기능 구현
        alert(`${sitter?.name || "펫시터"} 신청을 취소합니다.`);
        navigate(-1); // 이전 페이지로 돌아가기
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Typography>로딩 중...</Typography>
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
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    borderBottom: "1px solid #eee",
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    펫시터 상세보기
                </Typography>
            </Box>

            <Container maxWidth="sm" sx={{ pt: 3 }}>
                {/* 프로필 이미지 */}
                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                    <Avatar
                        src={sitter.image}
                        alt={sitter.name}
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
                    <InfoItem label="반려동물" value={`${sitter.pet_type} ${sitter.pet_count}마리`} />
                    <InfoItem label="임시보호 경험" value={sitter.experience ? "있음" : "없음"} />
                    <InfoItem label="주거 형태" value={sitter.house_type} />
                    <Box
                        sx={{
                            py: 2,
                            borderBottom: "1px solid #F0F0F0",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {sitter.description}
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
