import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Typography, TextField, IconButton, CircularProgress } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import SendIcon from "@mui/icons-material/Send";
import LeftArrow from "../../assets/images/Global/left-arrow-black.svg";
import ChatMessageLeft from "./ChatMessageLeft";
import ChatMessageRight from "./ChatMessageRight";
import TradeStart from "./TradeStart.jsx";
import MatchStart from "./MatchStart.jsx";
import { Context } from "../../context/Context";
import { useNavigate, useParams } from "react-router-dom";
import { sendChatNotification } from "../../services/notificationService.js";

const PetSitterStart = ({ sitter }) => {
    const renderPetInfo = () => {
        if (sitter.petInfo && sitter.petInfo !== "정보 없음") {
            return `반려동물: ${sitter.petInfo}`;
        }
        return "반려동물 없음";
    };

    return (
        <Box textAlign="center" py={2}>
            <Box display="flex" justifyContent="center" gap={2} mb={1}>
                <Box textAlign="center">
                    <Avatar
                        src={sitter.image}
                        alt={sitter.sitterName}
                        sx={{ width: 60, height: 60, margin: "0 auto" }}
                    />
                    <Typography variant="body2">
                        {sitter.sitterName} ({sitter.age})
                    </Typography>
                </Box>
            </Box>
            <Typography fontWeight="bold">펫시터 {sitter.sitterName}님과 채팅을 시작합니다.</Typography>
            <Typography variant="body2" color="text.secondary">
                {renderPetInfo()} / {sitter.experience ? "펫시터 경험 있음" : "펫시터 경험 없음"}
            </Typography>
        </Box>
    );
};

const ChatRoom = () => {
    const { user, nc, isChatOpen, isChatRoomOpen } = useContext(Context);
    const { channelId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [rightPosition, setRightPosition] = useState("20px");
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const parseMessage = (msg) => {
        let parsed;
        try {
            parsed = JSON.parse(msg.content);
        } catch {
            parsed = { customType: "TEXT", content: msg.content };
        }

        let typeId = 1;
        if (parsed.customType === "MATCH") typeId = 2;
        else if (parsed.customType === "TRADE") typeId = 3;
        else if (parsed.customType === "PETSITTER") typeId = 4;

        let isVisible = true;
        if (parsed.customType === "PETSITTER" && parsed.visibleTo) {
            isVisible = parsed.visibleTo === `ncid${user.id}`;
        }

        return {
            id: msg.message_id,
            senderId: msg.sender?.id,
            text: parsed.content,
            type_id: typeId,
            metadata: parsed,
            photo: msg.sender?.profile,
            parsed,
            isVisible: isVisible,
        };
    };

    useEffect(() => {
        if (!nc || !channelId) return;

        const handleReceiveMessage = async (channel, msg) => {
            if (msg.channel_id !== channelId) return;

            const { parsed, ...newMessage } = parseMessage(msg);

            setMessages((prev) => [...prev, newMessage]);

            if (msg.sender?.id !== `ncid${user.id}`) {
                const rawSenderId = msg.sender?.id; // "ncid25"
                const numericSenderId = rawSenderId?.replace(/\D/g, ""); // 숫자만 추출

                const payload = {
                    userId: user.id,
                    channelId: msg.channel_id,
                    senderId: numericSenderId,
                    message: parsed.content,
                    type: parsed.customType,
                    createdAt: new Date().toISOString(),
                };
                try {
                    await sendChatNotification(payload);
                } catch (err) {
                    console.error("알림 전송 실패:", err);
                }

                // 2. 읽음 처리
                try {
                    await nc.markRead(channelId, {
                        user_id: msg.sender.id,
                        message_id: msg.message_id,
                        sort_id: msg.sort_id,
                    });
                } catch (err) {
                    console.warn("내 메시지 markRead 실패:", err);
                }
            }
        };
        const init = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const filter = { channel_id: channelId };
                const sort = { created_at: 1 };
                const option = { per_page: 100 };
                const result = await nc.getMessages(filter, sort, option);

                const loadedMessages = (result.edges || []).map((edge) => {
                    const msg = edge.node;
                    let parsed;
                    try {
                        parsed = JSON.parse(msg.content);
                    } catch {
                        parsed = { customType: "TEXT", content: msg.content };
                    }

                    let typeId = 1;
                    if (parsed.customType === "MATCH") typeId = 2;
                    else if (parsed.customType === "TRADE") typeId = 3;
                    else if (parsed.customType === "PETSITTER") typeId = 4;

                    return {
                        id: msg.message_id,
                        senderId: msg.sender?.id,
                        text: parsed.content,
                        type_id: typeId,
                        metadata: parsed,
                        photo: msg.sender?.profile,
                    };
                });
                const filteredMessages = loadedMessages.filter(msg => {
                    if (msg.type_id === 4) {
                        return true;
                    }
                    return true;
                });

                setMessages(filteredMessages);

                // ✅ 마지막 메시지 기준으로 읽음 처리
                const lastNode = result.edges?.[result.edges.length - 1]?.node;
                if (lastNode) {
                    await nc.markRead(channelId, {
                        user_id: lastNode.sender?.id,
                        message_id: lastNode.message_id,
                        sort_id: lastNode.sort_id,
                    });
                }

                await nc.subscribe(channelId);
            } catch (e) {
                console.error("메시지 초기 불러오기 실패", e);
            } finally {
                setIsLoading(false);
            }
        };

        init();
        if (!isChatOpen && isChatRoomOpen) {
            nc.bind("onMessageReceived", handleReceiveMessage);
        }

        return () => {
            nc.unbind("onMessageReceived", handleReceiveMessage);
        };
    }, [nc, channelId, user.id, isChatOpen, isChatRoomOpen]);

    useEffect(() => {
        const updateRight = () => {
            const width = window.innerWidth;
            const layoutWidth = 500;
            if (width <= layoutWidth) {
                setRightPosition("0px");
            } else {
                const sideGap = (width - layoutWidth) / 2 - 8;
                setRightPosition(`${sideGap}px`);
            }
        };

        updateRight();
        window.addEventListener("resize", updateRight);
        return () => window.removeEventListener("resize", updateRight);
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;

        try {
            const payload = {
                customType: "TEXT",
                content: input,
            };

            await nc.sendMessage(channelId, {
                type: "text",
                message: JSON.stringify(payload),
            });

            setInput("");
        } catch (e) {
            console.error("메시지 전송 실패:", e);
        }
    };

    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                position="fixed"
                top={50}
                right={rightPosition}
                width="100%"
                maxWidth="500px"
                bgcolor="white"
                zIndex={100}
                px={2}
                py={1}
                borderBottom="1px solid #ccc"
            >
                <Box onClick={() => navigate(-1)} sx={{ cursor: "pointer" }}>
                    <img src={LeftArrow} alt="뒤로가기" />
                </Box>
                <Typography fontWeight="bold" ml={2}>
                    채팅방
                </Typography>
            </Box>

            <Box
                mt="50px"
                mb="70px"
                px={2}
                overflow="auto"
                height="calc(100vh - 250px)"
                display="flex"
                flexDirection="column-reverse"
                gap={1}
            >
                {isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <CircularProgress size={30} />
                    </Box>
                ) : (
                    <>
                        {messages
                            .slice()
                            .reverse()
                            .filter(msg => {
                                if (msg.type_id === 4 && msg.metadata.visibleTo) {
                                    return msg.metadata.visibleTo === `ncid${user.id}`;
                                }
                                return true;
                            })
                            .map((msg) => {
                                if (msg.type_id === 2) return <MatchStart key={msg.id} {...msg.metadata.content} />;
                                if (msg.type_id === 3) return <TradeStart key={msg.id} {...msg.metadata.content} />;
                                if (msg.type_id === 4)
                                    return <PetSitterStart key={msg.id} sitter={msg.metadata.content} />;
                                return msg.senderId === `ncid${user.id}` ? (
                                    <ChatMessageRight key={msg.id} text={msg.text} />
                                ) : (
                                    <ChatMessageLeft key={msg.id} photo={msg.photo} text={msg.text} />
                                );
                            })}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </Box>

            {!isLoading && (
                <Box
                    display="flex"
                    alignItems="center"
                    position="fixed"
                    bottom={80}
                    right={rightPosition}
                    width="100%"
                    maxWidth="500px"
                    bgcolor="white"
                    p={1}
                    borderTop="1px solid #ccc"
                    zIndex={100}
                >
                    <TextField
                        fullWidth
                        placeholder="메시지를 입력하세요..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        size="small"
                    />
                    <IconButton onClick={handleSend}>
                        <SendIcon />
                    </IconButton>
                </Box>
            )}
        </>
    );
};

export default ChatRoom;
