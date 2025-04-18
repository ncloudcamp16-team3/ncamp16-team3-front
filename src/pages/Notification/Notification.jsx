import React, { useEffect, useState } from "react";
import TitleBar from "../../components/Global/TitleBar.jsx";
import { Bell, MessageSquareText, CalendarCheck, Globe, PawPrint, Trash2 } from "lucide-react";
import { styled } from "@mui/material/styles";

// notifyType에 따라 아이콘 매핑
const getIconByType = (type) => {
    switch (type) {
        case "BOARD_COMMENT":
            return <MessageSquareText color="#4A90E2" />;
        case "PETSTA_COMMENT":
            return <PawPrint color="#7D4CDB" />;
        case "FACILITY_DATE":
            return <CalendarCheck color="#00BFA5" />;
        case "CHAT":
            return <Bell color="#FF5722" />;
        case "GLOBAL":
            return <Globe color="#607D8B" />;
        default:
            return <Bell />;
    }
};

const Notification = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetch("/src/mock/Notification/notification.json")
            .then((res) => res.json())
            .then(setNotifications)
            .catch((err) => console.error("Error loading notifications:", err));
    }, []);

    const handleRead = (id) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, readStatus: true } : n)));
    };

    const handleDelete = (id, e) => {
        e.stopPropagation(); // 카드 클릭 이벤트 막기
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const deleteAll = () => {
        setNotifications([]); // 모든 알림 제거
    };

    const HoverTrash = styled(Trash2)(({ theme }) => ({
        cursor: "pointer",
        marginLeft: "auto",
        color: "grey",
        transition: "color 0.2s ease",
        "&:hover": {
            color: theme.palette.error.main, // 빨간색은 MUI 테마의 error 컬러 사용
        },
    }));

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
                    <HoverTrash onClick={deleteAll} />
                </TitleBar>
            </div>

            <div style={{ padding: "16px" }}>
                {notifications.map((notification) => (
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
                        {/* 삭제 버튼 */}
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

                        <div style={{ marginRight: "12px" }}>{getIconByType(notification.notifyType)}</div>
                        <div style={{ paddingRight: "24px" }}>
                            {" "}
                            <div style={{ fontWeight: notification.readStatus ? "normal" : "bold" }}>
                                {notification.content}
                            </div>
                            <div style={{ fontSize: "0.85em", color: "#888", marginTop: "4px" }}>
                                {new Date(notification.createdAt).toLocaleString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notification;
