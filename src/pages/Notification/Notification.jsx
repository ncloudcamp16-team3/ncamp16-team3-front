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
} from "../../services/notificationService.js";
import { useNavigate } from "react-router-dom";

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
    const [notifications, setNotifications] = useState([]);
    const { user } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getNotificationsByUserId(user.id);
                setNotifications(data);
            } catch (error) {
                console.error("Error loading notifications:", error);
            }
        };

        if (user?.id) {
            fetchNotifications();
        }
    }, [user]);

    const handleRead = async (id) => {
        try {
            const notification = notifications.find((n) => n.id === id);
            if (!notification) return;

            const success = await markNotificationAsRead(id);
            if (success) {
                setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, readStatus: true } : n)));

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
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };
    const deleteAllNotifications = async () => {
        try {
            await deleteAllNotificationsByUserId(user.id);
            setNotifications([]); // 직접 비우기
        } catch (error) {
            console.error("Error deleting all notifications:", error);
        }
    };

    return (
        <div
            style={{
                backgroundColor: "white",
                minHeight: "100vh",
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
                    console.log("알림받은거 시간:" + notification.createdAt);
                    const { icon } = getIconByTypeId(notification.notificationTypeId);

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
                                    {notification.title}
                                </div>
                                <div style={{ marginTop: "4px", fontSize: "0.95em", color: "#555" }}>
                                    {notification.body}
                                </div>
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
