import React, { useContext, useEffect, useState } from "react";
import ProfileHeader from "../PetSta/Post/ProfileHeader.jsx";
import { Context } from "../../context/Context.jsx";
import { Box, CircularProgress, Typography } from "@mui/material";
import SearchIcon from "../../assets/images/Chat/search-icon.svg";
import ChatItem from "./ChatItem.jsx";
import { getMyChatRooms } from "../../services/chatService.js";

const ChatList = () => {
    const { user, nc } = useContext(Context);
    const [chatList, setChatList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user || !nc) return;

        const fetchRooms = async () => {
            try {
                setIsLoading(true);
                const roomList = await getMyChatRooms();
                const result = [];

                for (let room of roomList) {
                    const filter = { name: room.uniqueId };
                    const channels = await nc.getChannels(filter, {}, { per_page: 1 });
                    const edge = (channels.edges || [])[0];
                    if (!edge) continue;

                    const ch = edge.node;
                    await nc.subscribe(ch.id); // ✅ 실시간 메시지 받기 위해 구독

                    // 마지막 메시지 파싱
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

                    // 안 읽은 메시지 수
                    let unreadCount = 0;
                    try {
                        const unreadResult = await nc.unreadCount(ch.id);
                        unreadCount = unreadResult.unread || 0;
                    } catch (err) {
                        console.warn(`채널 ${ch.id} unreadCount 조회 실패`, err);
                    }

                    result.push({
                        id: ch.id,
                        name: room.nickname,
                        photo: room.profileUrl,
                        lastMessage: lastMessageText || "",
                        lastMessageSentAt: ch.last_message?.sended_at || ch.updated_at,
                        unreadCount,
                    });
                }

                result.sort((a, b) => new Date(b.lastMessageSentAt) - new Date(a.lastMessageSentAt));
                setChatList(result);
            } catch (e) {
                console.error("채팅방 정보 조회 실패:", e);
            } finally {
                setIsLoading(false); // ✅ 로딩 끝
            }
        };

        const handleReceiveMessage = (channel, msg) => {
            setChatList((prev) => {
                const updated = [...prev];
                const idx = updated.findIndex((item) => item.id === msg.channel_id);
                if (idx !== -1) {
                    let text = "";
                    try {
                        const parsed = JSON.parse(msg.content);
                        if (typeof parsed.content === "string") {
                            text = parsed.content;
                        } else if (typeof parsed.content === "object" && parsed.content.text) {
                            text = parsed.content.text;
                        } else {
                            text = "알 수 없는 메시지";
                        }
                    } catch {
                        text = msg.content;
                    }

                    const isMine = msg.sender?.id === `ncid${user.id}`;

                    updated[idx] = {
                        ...updated[idx],
                        lastMessage: text,
                        lastMessageSentAt: msg.sended_at,
                        unreadCount: isMine ? 0 : updated[idx].unreadCount + 1,
                    };

                    // 정렬 다시
                    updated.sort((a, b) => new Date(b.lastMessageSentAt) - new Date(a.lastMessageSentAt));
                }

                return updated;
            });
        };

        fetchRooms();
        nc.bind("onMessageReceived", handleReceiveMessage);

        return () => {
            nc.unbind("onMessageReceived", handleReceiveMessage);
        };
    }, [user, nc]);

    return (
        <Box p={1}>
            <ProfileHeader userName={user.name} />

            <Box bgcolor="#d9d9d9" p={2} borderRadius="15px" display="flex" alignItems="center">
                <img src={SearchIcon} alt="search" />
                <Typography fontWeight="bold" ml={2}>
                    검색
                </Typography>
            </Box>

            <Typography p={1}>메시지</Typography>

            {/* ✅ 4. 로딩 상태일 때 스피너 표시 */}
            {isLoading ? (
                <Box display="flex" justifyContent="center" py={5}>
                    <CircularProgress size={32} />
                </Box>
            ) : (
                chatList.map((item) => (
                    <ChatItem
                        key={item.id}
                        name={item.name}
                        photo={item.photo}
                        lastMessage={item.lastMessage}
                        roomId={item.id}
                        unreadCount={item.unreadCount}
                    />
                ))
            )}
        </Box>
    );
};

export default ChatList;
