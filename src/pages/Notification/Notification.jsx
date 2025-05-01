// import { Bell, MessageSquareText, CalendarCheck, Globe, PawPrint, Trash2 } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import TitleBar from "../../components/Global/TitleBar.jsx";
import { MessageSquareText, PawPrint, CalendarCheck, CalendarDays, Bell, Globe, Trash2 } from "lucide-react";
import { styled } from "@mui/material/styles";
import { Context } from "../../context/Context.jsx";
import { getNotificationsByUserId } from "../../services/notificationService.js";

// 숫자 ID에 따라 아이콘 매핑
const getIconByTypeId = (typeId) => {
    switch (typeId) {
        case 1:
            return {
                icon: <MessageSquareText color="#4A90E2" />,
                label: "게시판 댓글",
            };
        case 2:
            return {
                icon: <PawPrint color="#7D4CDB" />,
                label: "펫스타 댓글",
            };
        case 3:
            return {
                icon: <CalendarCheck color="#00BFA5" />,
                label: "시설 예약 알림",
            };
        case 4:
            return {
                icon: <CalendarDays color="#FFA000" />,
                label: "일정 알림",
            };
        case 5:
            return {
                icon: <Bell color="#FF5722" />,
                label: "채팅 메시지",
            };
        case 6:
            return {
                icon: <Globe color="#607D8B" />,
                label: "전체 공지",
            };
        default:
            return {
                icon: <Bell />,
                label: "기타 알림",
            };
    }
};

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

    const handleRead = (id) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, readStatus: true } : n)));
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const deleteAll = () => {
        setNotifications([]);
    };

    return (
        <div style={{ backgroundColor: "white", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <div style={{ backgroundColor: "white", borderBottom: "1px #ccc solid" }}>
                <TitleBar name="알림">
                    <HoverTrash onClick={deleteAll} />
                </TitleBar>
            </div>

            <div style={{ padding: "16px" }}>
                {notifications.map((notification) => {
                    const { icon, label } = getIconByTypeId(notification.notificationTypeId);

                    return (
                        <div
                            key={notification.id}
                            onClick={() => handleRead(notification.id)}
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
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
                            <div style={{ paddingRight: "24px" }}>
                                <div style={{ fontWeight: notification.readStatus ? "normal" : "bold" }}>
                                    {notification.content}
                                </div>
                                <div style={{ fontSize: "0.85em", color: "#888", marginTop: "4px" }}>
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
