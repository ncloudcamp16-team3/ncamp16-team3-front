import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Typography, TextField, IconButton } from "@mui/material";
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
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!nc || !channelId) return;

        const init = async () => {
            try {
                const filter = { channel_id: channelId };
                const sort = { created_at: 1 };
                const option = { per_page: 100 };

                const result = await nc.getMessages(filter, sort, option);
                const transformed = (result.edges || []).map((edge) => {
                    const msg = edge.node;
                    return {
                        id: msg.message_id,
                        senderId: msg.sender?.id,
                        text: msg.content,
                        type_id: msg.customType === "TRADE" ? 3 : msg.customType === "MATCH" ? 2 : 1,
                        metadata: msg.metadata,
                        photo: msg.sender?.profile,
                    };
                });

                setMessages(transformed);
                await nc.subscribe(channelId);
            } catch (e) {
                console.error("메시지 불러오기 실패", e);
            }
        };

        init();
    }, [nc, channelId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
            await nc.sendMessage(channelId, {
                type: "text",
                message: input,
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

            {/* 💬 메시지 영역 (스크롤 되는 부분) */}
            <Box
                mt="50px"
                mb="70px"
                px={2}
                overflow="auto"
                height="calc(100vh - 250px)"
                display="flex"
                flexDirection="column"
                gap={1}
            >
                {messages.map((msg) => {
                    if (msg.type_id === 2) return <MatchStart key={msg.id} {...msg.metadata} />;
                    if (msg.type_id === 3) return <TradeStart key={msg.id} {...msg.metadata} />;
                    return msg.senderId === `ncid${user.id}` ? (
                        <ChatMessageRight key={msg.id} text={msg.text} />
                    ) : (
                        <ChatMessageLeft key={msg.id} photo={msg.photo} text={msg.text} />
                    );
                })}
                <div ref={messagesEndRef} />
            </Box>

            {/* ⌨️ 하단 입력창 고정 */}
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
        </>
    );
};

export default ChatRoom;
