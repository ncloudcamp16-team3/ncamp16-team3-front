import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Button, Container, Avatar, CircularProgress, Alert } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate, useParams } from "react-router-dom";
import TitleBar from "../../components/Global/TitleBar.jsx";
import { getPetSitterDetails } from "../../services/petSitterService";
import { createChatRoom } from "../../services/chatService";
import { Context } from "../../context/Context.jsx";

const PetSitterDetail = () => {
    const { sitterId } = useParams();
    const navigate = useNavigate();
    const { user, nc } = useContext(Context);
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

                if (err.response && err.response.status === 401) {
                    setError("로그인이 필요합니다.");
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                } else {
                    setError("펫시터 정보를 불러오는데 실패했습니다.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPetSitterDetails();
    }, [sitterId, navigate]);

    const handleChat = async () => {
        if (!sitter || !user || !nc) return;

        try {
            const targetUserId = sitter.id;
            const myId = user.id;
            const uniqueId = await createChatRoom(targetUserId);

            // 채널 조회
            const filter = { name: uniqueId };
            const channels = await nc.getChannels(filter, {}, { per_page: 1 });
            const edge = (channels.edges || [])[0];
            let channelId;

            if (edge) {
                channelId = edge.node.id;
            } else {
                // 채널 없으면 생성
                const newChannel = await nc.createChannel({
                    type: "PRIVATE",
                    name: uniqueId,
                });
                channelId = newChannel.id;
                await nc.addUsers(channelId, [`ncid${myId}`, `ncid${targetUserId}`]);
            }

            // 구독 여부 확인 후 구독
            const subFilter = {
                channel_id: channelId,
                user_id: `ncid${myId}`,
            };
            const subs = await nc.getSubscriptions(subFilter, {}, { per_page: 1 });
            if (!subs.length) {
                await nc.subscribe(channelId);
            }

            const messageFilter = { channel_id: channelId };
            const messages = await nc.getMessages(messageFilter, {}, { per_page: 1 });

            if (!messages.edges || messages.edges.length === 0) {
                const payload = {
                    customType: "PETSITTER",
                    content: {
                        sitterName: sitter.nickname,
                        image: sitter.imagePath,
                        sitterId: sitter.id,
                        age: sitter.age,
                        hasPet: sitter.grown,
                        petInfo: formatPetInfo(sitter),
                        experience: sitter.sitterExp,
                    },
                    visibleTo: `ncid${myId}`,
                };

                await nc.sendMessage(channelId, {
                    type: "text",
                    message: JSON.stringify(payload),
                });
            }

            navigate(`/chat/room/${channelId}`);
        } catch (e) {
            console.error("❌ 펫시터 채팅 생성 실패:", e);
        }
    };

    const formatPetInfo = (sitterData) => {
        if (sitterData && sitterData.petTypesFormatted) {
            return sitterData.petTypesFormatted;
        }
        return "정보 없음";
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

                    {/* 반려동물 정보는 grown이 true인 경우에만 표시 */}
                    {sitter.grown ? (
                        <>
                            {/* 반려동물 타입 */}
                            <InfoItem label="반려동물" value={sitter.petTypesFormatted || "정보 없음"} />

                            {/* 키우는 수 별도 표시 */}
                            <InfoItem label="키우는 수" value={sitter.petCount || "정보 없음"} />
                        </>
                    ) : (
                        <InfoItem label="반려동물" value="키우고 있지 않음" />
                    )}

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
