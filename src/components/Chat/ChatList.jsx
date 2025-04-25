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
                const roomList = await getMyChatRooms(); // uniqueId 리스트

                const result = [];
                for (let room of roomList) {
                    const filter = { name: room.channelId }; // uniqueId가 name
                    const channels = await nc.getChannels(filter, {}, { per_page: 1 });

                    const edge = (channels.edges || [])[0];
                    if (!edge) continue;

                    const ch = edge.node;
                    const members = ch.members || [];

                    const myChatId = `ncid${user.id}`;
                    const partnerId = members.find((m) => m !== myChatId) || ch.user_id;

                    // 상대방 정보 가져오기
                    const partnerInfo = ch.membersDetail?.find((m) => m.id === partnerId) || ch.user || {};

                    result.push({
                        id: ch.id,
                        name: partnerInfo.name || "알 수 없음",
                        photo: partnerInfo.profile || "",
                        lastMessage: ch.last_message?.content || "",
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
