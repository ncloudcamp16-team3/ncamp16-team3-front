import React, { useContext, useEffect, useState } from "react";
import TitleBar from "../../components/Global/TitleBar.jsx";
import { MessageSquareText, PawPrint, CalendarCheck, CalendarDays, Bell, Globe, Trash2 } from "lucide-react";
import { styled } from "@mui/material/styles";
import { Context } from "../../context/Context.jsx";
import {
    getNotificationsByUserId,
    deleteAllNotificationsByUserId,
    deleteNotificationById,
    markNotificationAsRead,
    checkNotification,
} from "../../services/notificationService.js";
import { useNavigate } from "react-router-dom";
import { listenToMessages } from "../../../public/firebase.js";

// 숫자 ID에 따라 아이콘 매핑
const getIconByTypeId = (typeId) => {
    switch (typeId) {
        case 1:
            return { icon: <MessageSquareText color="#4A90E2" />, label: "게시판 댓글" };
        case 2:
            return { icon: <PawPrint color="#7D4CDB" />, label: "펫스타 댓글" };
        case 3:
            return { icon: <CalendarCheck color="#00BFA5" />, label: "시설 예약 알림" };
        case 4:
            return { icon: <CalendarDays color="#FFA000" />, label: "일정 알림" };
        case 5:
            return { icon: <Bell color="#FF5722" />, label: "채팅 메시지" };
        case 6:
            return { icon: <Globe color="#607D8B" />, label: "전체 공지" };
        default:
            return { icon: <Bell />, label: "기타 알림" };
    }
};

// 쓰레기통 아이콘에 hover 효과
const HoverTrash = styled(Trash2)(({ theme }) => ({
    cursor: "pointer",
    marginLeft: "auto",
    color: "grey",
    transition: "color 0.2s ease",
    "&:hover": {
        color: theme.palette.error.main,
    },
}));

const Notification = () => {
    const [lastMessages, setLastMessages] = useState({});
    const { user, nc, notifications, setNotifications, setHasNewNotification } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); // 화면 이동시 스크롤 맨 위로

    useEffect(() => {
        if (!user?.id) return;

        const fetchNotifications = async () => {
            try {
                const data = await getNotificationsByUserId(user.id);
                setNotifications(data);
            } catch (error) {
                console.error("Error loading notifications:", error);
            }
        };

        fetchNotifications();

        // listenToMessages는 user.id 있을 때만 등록
        const unsubscribe = listenToMessages(async (payload) => {
            // console.log("📥 실시간 알림 수신됨:", payload);
            await fetchNotifications();
            const result = await checkNotification(user.id);
            setHasNewNotification(result.exists);
        });

        // (선택) 언마운트 시 unsubscribe 로직 추가
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [user?.id]); // user?.id만 의존성에

    const fetchNotificationLastMessage = async (channelId) => {
        try {
            const filter1 = { id: channelId };
            const filter2 = { channel_id: channelId };
            const sort = { created_at: -1 };
            const option = { offset: 0, per_page: 20 };

            const channels = await nc.getChannels(filter1, sort, option);
            const edge = channels.edges?.[0];
            const ch = edge?.node;

            const subscriptions = await nc.getSubscriptions(filter2, sort, option);
            const subEdge1 = subscriptions.edges?.[0];
            const subEdge2 = subscriptions.edges?.[1];

            const user1 = subEdge1?.node.user.id.replace(/^ncid/, "") || null;
            const user2 = subEdge2?.node.user.id.replace(/^ncid/, "") || null;
            const user1_name = subEdge1?.node.user.name || null;
            const user2_name = subEdge2?.node.user.name || null;

            let message = "";

            if (ch?.last_message?.content) {
                try {
                    const parsed = JSON.parse(ch.last_message.content);
                    message = parsed?.content?.text || parsed?.content || ch.last_message.content;
                } catch (e) {
                    message = ch.last_message.content;
                }
            }

            return {
                user1,
                user2,
                user1_name,
                user2_name,
                message,
            };
        } catch (err) {
            console.error("메시지 로딩 실패:", err);
            return {
                user1: "",
                user2: "",
                user1_name: "",
                user2_name: "",
                message: "메시지를 불러올 수 없습니다.",
            };
        }
    };

    const handleRead = async (id) => {
        try {
            const notification = notifications.find((n) => n.id === id);
            if (!notification) return;

            const success = await markNotificationAsRead(id);
            if (success) {
                setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, readStatus: true } : n)));

                const result = await checkNotification(user.id);
                setHasNewNotification(result.exists); // true/false

                switch (notification.notificationTypeId) {
                    case 1: // 게시판 댓글
                        navigate(`/board/${notification.content}`); // 댓글ID
                        break;
                    case 2: // 펫스타 댓글
                        navigate(`/petsta/post/comment/${notification.content}`);
                        break;
                    case 3: // 시설 예약 알림
                        navigate(`/calendar`);
                        break;
                    case 4: // 일정 알림
                        navigate(`/calendar`);
                        break;
                    case 5: // 채팅 메시지
                        navigate(`/chat/room/${notification.content}`);
                        break;
                    case 6: // 전체 공지
                        navigate(`/announce/${notification.content}`);
                        break;
                    default:
                        console.warn("Unknown notification type:", notification.notificationTypeId);
                        break;
                }
            }
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };
    const handleDelete = async (id, e) => {
        e.stopPropagation(); // 이벤트 버블링 방지
        const notification = notifications.find((n) => n.id === id);

        if (notification) {
            try {
                // 삭제 처리 함수 호출
                await deleteSingleNotification(notification);
                setNotifications((prev) => prev.filter((n) => n.id !== id)); // 삭제된 알림 제외하고 업데이트
            } catch (error) {
                console.error("Error deleting notification:", error);
            }
        }
    };

    const deleteSingleNotification = async (notification) => {
        try {
            await deleteNotificationById(notification.id);
            setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
            const result = await checkNotification(user.id);
            setHasNewNotification(result.exists); // true/false
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };
    const deleteAllNotifications = async () => {
        try {
            await deleteAllNotificationsByUserId(user.id);
            setNotifications([]); // 직접 비우기
            const result = await checkNotification(user.id);
            setHasNewNotification(result.exists); // true/false
        } catch (error) {
            console.error("Error deleting all notifications:", error);
        }
    };

    useEffect(() => {
        const fetchMessages = async () => {
            const messageMap = {};

            await Promise.all(
                notifications.map(async (notification) => {
                    if (notification.notificationTypeId === 5) {
                        const channelId = notification.content;
                        const { user1, user2, user1_name, user2_name, message } =
                            await fetchNotificationLastMessage(channelId);

                        messageMap[notification.id] = {
                            user1,
                            user2,
                            user1_name,
                            user2_name,
                            message,
                        };
                    }
                })
            );
            setLastMessages(messageMap);
        };
        fetchMessages();
    }, [notifications]);

    return (
        <div
            style={{
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div style={{ backgroundColor: "white", borderBottom: "1px #ccc solid" }}>
                <TitleBar name="알림">
                    <HoverTrash onClick={deleteAllNotifications} />
                </TitleBar>
            </div>

            <div style={{ padding: "16px" }}>
                {notifications.map((notification) => {
                    const { icon } = getIconByTypeId(notification.notificationTypeId);
                    const last = lastMessages[notification.id];

                    const displayTitle =
                        notification.title ||
                        (notification.notificationTypeId === 5 &&
                            last &&
                            ((notification.userId == last.user1
                                ? `${last.user2_name} 님으로부터 메세지가 왔습니다.`
                                : `${last.user1_name} 님으로부터 메세지가 왔습니다.`) ||
                                "유저를 알 수 없습니다."));

                    const displayBody =
                        notification.notificationTypeId === 5
                            ? last?.message || "불러오는 중..."
                            : notification.body?.trim()
                              ? notification.body
                              : "삭제된 댓글입니다";
                    return (
                        <div
                            key={notification.id}
                            onClick={() => handleRead(notification.id)}
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "flex-start",
                                padding: "12px",
                                marginBottom: "12px",
                                backgroundColor: notification.readStatus ? "#f9f9f9" : "#fff5e5",
                                border: "1px solid #eee",
                                borderRadius: "10px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                                cursor: "pointer",
                            }}
                        >
                            <button
                                onClick={(e) => handleDelete(notification.id, e)}
                                style={{
                                    position: "absolute",
                                    top: "8px",
                                    right: "8px",
                                    background: "transparent",
                                    border: "none",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    color: "#999",
                                }}
                                aria-label="삭제"
                            >
                                ✕
                            </button>

                            <div style={{ marginRight: "12px" }}>{icon}</div>

                            <div style={{ paddingRight: "24px", flex: 1 }}>
                                <div
                                    style={{
                                        fontWeight: notification.readStatus ? "normal" : "bold",
                                        fontSize: "1rem",
                                    }}
                                >
                                    {displayTitle}
                                </div>
                                <div style={{ marginTop: "4px", fontSize: "0.95em", color: "#555" }}>{displayBody}</div>
                                <div style={{ fontSize: "0.8em", color: "#888", marginTop: "6px" }}>
                                    {new Date(notification.createdAt).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Notification;
