import React, { useContext, useEffect, useState } from "react";
import ProfileHeader from "../PetSta/Post/ProfileHeader.jsx";
import { Context } from "../../context/Context.jsx";
import { Box, Typography } from "@mui/material";
import SearchIcon from "../../assets/images/Chat/search-icon.svg";
import ChatItem from "./ChatItem.jsx";
import { getMyChatRooms } from "../../services/chatService.js";

const ChatList = () => {
    const { user, nc } = useContext(Context);
    const [chatList, setChatList] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const roomList = await getMyChatRooms();
                // roomList: [{ uniqueId, nickname, profileUrl }, ...]

                const result = [];

                for (let room of roomList) {
                    const filter = { name: room.uniqueId }; // uniqueId = 채널 name
                    const channels = await nc.getChannels(filter, {}, { per_page: 1 });
                    const edge = (channels.edges || [])[0];
                    if (!edge) continue;

                    const ch = edge.node;

                    // last_message 뽑기
                    let lastMessageText = "";
                    if (ch.last_message?.content) {
                        try {
                            const parsed = JSON.parse(ch.last_message.content);

                            if (typeof parsed.content === "string") {
                                lastMessageText = parsed.content;
                            } else if (typeof parsed.content === "object" && parsed.content.text) {
                                lastMessageText = parsed.content.text;
                            } else {
                                lastMessageText = "알 수 없는 메시지";
                            }
                        } catch {
                            lastMessageText = ch.last_message.content;
                        }
                    }

                    result.push({
                        id: ch.id, // 채널 ID
                        name: room.nickname, // 서버에서 준 nickname
                        photo: room.profileUrl, // 서버에서 준 profileUrl
                        lastMessage: lastMessageText || "", // 마지막 메시지
                    });
                }

                setChatList(result);
            } catch (e) {
                console.error("채팅방 정보 조회 실패:", e);
            }
        };

        if (user && nc) fetchRooms();
    }, [user, nc]);

    return (
        <Box p={1}>
            <ProfileHeader userName={user.name} />

            <Box bgcolor="#d9d9d9" p={2} borderRadius="15px" display="flex" alignItems="center">
                <img src={SearchIcon} />
                <Typography fontWeight="bold" ml={2}>
                    검색
                </Typography>
            </Box>

            <Typography p={1}>메시지</Typography>

            {chatList.map((item) => (
                <ChatItem
                    key={item.id}
                    name={item.name}
                    photo={item.photo}
                    lastMessage={item.lastMessage}
                    roomId={item.id}
                />
            ))}
        </Box>
    );
};

export default ChatList;
