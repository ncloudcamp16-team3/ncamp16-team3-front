import React, { useContext, useEffect, useState } from "react";
import ProfileHeader from "../PetSta/Post/ProfileHeader.jsx";
import { Context } from "../../context/Context.jsx";
import { Box, CircularProgress, Typography } from "@mui/material";
import SearchIcon from "../../assets/images/Chat/search-icon.svg";
import ChatItem from "./ChatItem.jsx";
import { getMyChatRooms } from "../../services/chatService.js";
import { sendChatNotification } from "../../services/notificationService.js";

const ChatList = () => {
    const { user, nc, isChatOpen, isChatRoomOpen, chatList, setChatList } = useContext(Context);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

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

        return {
            id: msg.message_id,
            senderId: msg.sender?.id,
            text: parsed.content,
            type_id: typeId,
            metadata: parsed,
            photo: msg.sender?.profile,
            parsed,
        };
    };

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
                    await nc.subscribe(ch.id);

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
                setIsLoading(false);
            }
        };

        const handleReceiveMessage = async (channel, msg) => {
            const { parsed } = parseMessage(msg);
            const isMine = msg.sender.id === `ncid${user.id}`;
            if (isMine) return; // 내 메시지는 무시

            const numericSenderId = msg.sender.id.replace(/\D/g, "");

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

                    updated.sort((a, b) => new Date(b.lastMessageSentAt) - new Date(a.lastMessageSentAt));
                }

                return updated;
            });
        };

        fetchRooms();
        if (isChatOpen && !isChatRoomOpen) {
            nc.bind("onMessageReceived", handleReceiveMessage);
        }

        return () => {
            nc.unbind("onMessageReceived", handleReceiveMessage);
        };
    }, [user, nc, isChatOpen, isChatRoomOpen]);

    const filteredChatList = chatList.filter((item) => {
        const keyword = search.toLowerCase();
        return item.name.toLowerCase().includes(keyword) || item.lastMessage.toLowerCase().includes(keyword);
    });

    return (
        <Box p={1}>
            <ProfileHeader userName={user.name} />

            <Box bgcolor="#d9d9d9" p={2} borderRadius="15px" display="flex" alignItems="center">
                <img src={SearchIcon} alt="search" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="채팅방 검색"
                    style={{
                        marginLeft: "10px",
                        border: "none",
                        background: "transparent",
                        outline: "none",
                        fontSize: "16px",
                        flex: 1,
                    }}
                />
            </Box>

            <Typography p={1}>메시지</Typography>

            {isLoading ? (
                <Box display="flex" justifyContent="center" py={5}>
                    <CircularProgress size={32} />
                </Box>
            ) : (
                filteredChatList.map((item) => (
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
