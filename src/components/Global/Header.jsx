import React, { useContext, useEffect, useState } from "react";
import "../../css/App.css";
import { useNavigate } from "react-router-dom";
import { Box, MenuItem, Menu } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Bookmark from "../../assets/images/Global/modal-bookmark.svg";
import Calendar from "../../assets/images/Global/modal-calendar.svg";
import Info from "../../assets/images/Global/modal-info.svg";
import Logout from "../../assets/images/Global/modal-logout.svg";
import Purchase from "../../assets/images/Global/modal-purchase.svg";
import Chat from "../../assets/images/Global/modal-chat.svg";
import { logout } from "../../services/authService.js";
import { Context } from "../../context/Context.jsx";
import alert_noti from "../../assets/images/Global/active_bell.gif";
import noti from "../../assets/images/Global/bell.png";
import headerLogo from "../../assets/images/Global/headerLogo.png";
import { checkNotification } from "../../services/notificationService.js";

const Header = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { user, isLogin, setLogin, hasNewNotification, setHasNewNotification } = useContext(Context);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // ✅ Header 마운트 시 알림 읽음 여부 확인
    useEffect(() => {
        const fetchNotificationStatus = async () => {
            try {
                if (user?.id) {
                    const result = await checkNotification(user.id);
                    setHasNewNotification(result.exists); // true/false
                }
            } catch (error) {
                console.error("알림 읽음 여부 확인 실패:", error);
            }
        };

        fetchNotificationStatus();
    }, [user?.id]);

    const handleLogout = async () => {
        try {
            await logout();
            setLogin(false);
            window.location.reload();
        } catch (err) {
            console.error("로그아웃 실패", err);
        } finally {
            toggleMenu();
        }
    };

    const toggleMenu = (event) => {
        if (anchorEl) {
            setAnchorEl(null);
        } else {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleClickMenu = (link) => () => {
        toggleMenu();
        navigate(link);
    };

    return (
        <Box component="div" className="header" display="flex" flexDirection="row" justifyContent="space-between">
            <Box
                sx={{
                    borderRadius: "50%",
                    border: "1px solid #D1D5DB",
                    overflow: "hidden",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    cursor: "pointer",
                }}
                onClick={toggleMenu}
            >
                <Box
                    component="img"
                    src={user?.path || "../../assets/images/Global/default-profile.png"}
                    alt="profile"
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </Box>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={toggleMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                disableScrollLock={true}
                sx={{
                    "& .MuiPaper-root": {
                        backgroundColor: theme.brand5,
                        borderRadius: "10px",
                        width: "145px",
                        padding: "5px 5px 0 5px",
                        mt: 0.5,
                    },
                }}
            >
                <MenuItem
                    onClick={handleClickMenu("/bookmark")}
                    sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: 1.5,
                        fontWeight: "600",
                        padding: "4px 8px 4px 8px",
                        minHeight: "32px",
                    }}
                >
                    <img src={Bookmark} alt="북마크" style={{ width: "24px", height: "24px" }} />
                    <span>북마크</span>
                </MenuItem>

                <MenuItem
                    onClick={handleClickMenu("/calendar")}
                    sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: 1.5,
                        fontWeight: "600",
                        padding: "4px 8px 4px 8px",
                        minHeight: "32px",
                    }}
                >
                    <img src={Calendar} alt="캘린더" style={{ width: "24px", height: "24px" }} />
                    <span>캘린더</span>
                </MenuItem>

                <MenuItem
                    onClick={handleClickMenu("/chat")}
                    sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: 1.5,
                        fontWeight: "600",
                        padding: "4px 8px 4px 8px",
                        minHeight: "16px",
                    }}
                >
                    <img src={Chat} alt="채팅" style={{ width: "24px", height: "24px" }} />
                    <span>내 채팅</span>
                </MenuItem>

                <MenuItem
                    onClick={handleClickMenu("/mypage")}
                    sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: 1.5,
                        fontWeight: "600",
                        padding: "4px 8px 4px 8px",
                        minHeight: "32px",
                    }}
                >
                    <img src={Info} alt="회원정보" style={{ width: "24px", height: "24px" }} />
                    <span>회원정보</span>
                </MenuItem>

                <MenuItem
                    onClick={handleClickMenu("/payment")}
                    sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: 1.5,
                        fontWeight: "600",
                        padding: "4px 8px 4px 8px",
                        minHeight: "32px",
                    }}
                >
                    <img src={Purchase} alt="결제내역" style={{ width: "24px", height: "24px" }} />
                    <span>결제내역</span>
                </MenuItem>

                {isLogin && (
                    <MenuItem
                        onClick={handleLogout}
                        sx={{
                            display: "flex",
                            alignItems: "flex-end",
                            gap: 1.5,
                            fontWeight: "600",
                            padding: "4px 8px 4px 8px",
                            minHeight: "32px",
                            color: "red",
                        }}
                    >
                        <img src={Logout} alt="로그아웃" style={{ width: "24px", height: "24px" }} />
                        <span>로그아웃</span>
                    </MenuItem>
                )}
            </Menu>
            <Box display="flex" alignItems="center">
                <Box
                    component="img"
                    src={headerLogo}
                    alt="로고"
                    sx={{
                        objectFit: "contain",
                        width: "150px",
                    }}
                />
            </Box>
            <Box
                onClick={() => {
                    navigate("/notification");
                }}
                sx={{
                    width: "40px",
                    height: "40px",
                    display: "flex", // 추가
                    alignItems: "center", // 수직 가운데 정렬
                    justifyContent: "center", // 수평 가운데 정렬
                }}
            >
                <Box
                    component="img"
                    src={hasNewNotification ? alert_noti : noti}
                    alt="종"
                    sx={{
                        objectFit: "contain",
                        cursor: "pointer",
                        width: "30px",
                        height: "30px",
                    }}
                />
            </Box>
        </Box>
    );
};

export default Header;
