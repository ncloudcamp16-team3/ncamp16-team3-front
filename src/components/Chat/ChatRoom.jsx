import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Typography, TextField, IconButton, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import LeftArrow from "../../assets/images/Global/left-arrow-black.svg";
import ChatMessageLeft from "./ChatMessageLeft";
import ChatMessageRight from "./ChatMessageRight";
import TradeStart from "./TradeStart.jsx";
import MatchStart from "./MatchStart.jsx";
import { Context } from "../../context/Context";
import { useNavigate, useParams } from "react-router-dom";

const ChatRoom = () => {
    const { user, nc } = useContext(Context);
    const { channelId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [rightPosition, setRightPosition] = useState("20px");
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef(null); // 이제 사실상 필요없지만 남겨둠

    useEffect(() => {
        if (!nc || !channelId) return;

        const handleReceiveMessage = (channel, msg) => {
            if (msg.channel_id !== channelId) return;

            let parsed = null;
            try {
                parsed = JSON.parse(msg.content);
            } catch {
                parsed = { customType: "TEXT", content: msg.content };
            }

            let typeId = 1;
            if (parsed.customType === "MATCH") typeId = 2;
            else if (parsed.customType === "TRADE") typeId = 3;

            const newMessage = {
                id: msg.message_id,
                senderId: msg.sender?.id,
                text: parsed.content,
                type_id: typeId,
                metadata: parsed,
                photo: msg.sender?.profile,
            };

            setMessages((prev) => [...prev, newMessage]);
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
                    let parsed = null;
                    try {
                        parsed = JSON.parse(msg.content);
                    } catch {
                        parsed = { customType: "TEXT", content: msg.content };
                    }

                    let typeId = 1;
                    if (parsed.customType === "MATCH") typeId = 2;
                    else if (parsed.customType === "TRADE") typeId = 3;

                    return {
                        id: msg.message_id,
                        senderId: msg.sender?.id,
                        text: parsed.content,
                        type_id: typeId,
                        metadata: parsed,
                        photo: msg.sender?.profile,
                    };
                });

                setMessages(loadedMessages);
                await nc.subscribe(channelId);
            } catch (e) {
                console.error("메시지 초기 불러오기 실패", e);
            } finally {
                setIsLoading(false);
            }
        };

        init();
        nc.bind("onMessageReceived", handleReceiveMessage);

        return () => {
            nc.unbind("onMessageReceived", handleReceiveMessage);
        };
    }, [nc, channelId]);

    useEffect(() => {
        const updateRight = () => {
            const width = window.innerWidth;
            const layoutWidth = 500;
            if (width <= layoutWidth) {
                setRightPosition("20px");
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
            {/* 🔝 상단 고정 헤더 */}
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

            {/* 💬 메시지 영역 */}
            <Box
                mt="50px"
                mb="70px"
                px={2}
                overflow="auto"
                height="calc(100vh - 250px)"
                display="flex"
                flexDirection="column-reverse" // ✅ 여기 변경
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
                            .map((msg) => {
                                if (msg.type_id === 2) return <MatchStart key={msg.id} {...msg.metadata.content} />;
                                if (msg.type_id === 3) return <TradeStart key={msg.id} {...msg.metadata.content} />;
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

            {/* ⌨️ 하단 입력창 */}
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
