import React, { useContext } from "react";
import { Box, Typography } from "@mui/material";
import LeftArrow from "../../assets/images/Global/left-arrow-black.svg";
import ChatMessageLeft from "./ChatMessageLeft";
import ChatMessageRight from "./ChatMessageRight";
import { Context } from "../../context/Context";
import mockMessages from "../../mock/Chat/chat_messages.json";
import { useNavigate } from "react-router-dom";
import TradeStart from "./TradeStart.jsx";
import MatchStart from "./MatchStart.jsx";

const ChatRoom = () => {
    const { user } = useContext(Context);
    const navigate = useNavigate();

    return (
        <Box p={2}>
            {/* 상단 헤더 */}
            <Box display="flex" alignItems="center" mb={2}>
                <Box onClick={() => navigate(-1)}>
                    <img src={LeftArrow} />
                </Box>
                <img src="" alt="사진" />
                <Typography fontWeight="bold" ml={2}>
                    이름
                </Typography>
            </Box>
            <hr />

            {/* 메시지 목록 */}
            <Box>
                {mockMessages.map((msg) => {
                    // 타입이 있는 경우 (특수 메시지)
                    if (msg.type_id === 2) {
                        return <MatchStart key={msg.id} {...msg.metadata} />;
                    }
                    if (msg.type_id === 3) {
                        return <TradeStart key={msg.id} {...msg.metadata} />;
                    }

                    // 일반 메시지
                    if (msg.senderId === user.id) {
                        return <ChatMessageRight key={msg.id} text={msg.text} />;
                    } else {
                        return <ChatMessageLeft key={msg.id} photo={msg.photo} text={msg.text} />;
                    }
                })}
            </Box>
        </Box>
    );
};

export default ChatRoom;
