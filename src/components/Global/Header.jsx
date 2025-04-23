import React, { useEffect, useState } from "react";
import "../../css/App.css";
import icon from "../../assets/images/Global/icon1.svg";
import notification from "../../assets/images/Global/notification2.svg";
import { useNavigate } from "react-router-dom";
import { Box, MenuItem, Menu } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Bookmark from "../../assets/images/Global/modal-bookmark.svg";
import Calendar from "../../assets/images/Global/modal-calendar.svg";
import Info from "../../assets/images/Global/modal-info.svg";
import Logout from "../../assets/images/Global/modal-logout.svg";
import Purchase from "../../assets/images/Global/modal-purchase.svg";
import { useUser } from "../User/UserContext.jsx";
const Header = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [userData2, setUserData2] = useState(null);
    const { user } = useUser();

    useEffect(() => {
        // GET 요청을 보낼 때 자동으로 쿠키가 포함됩니다.
        fetch("/api/auth/userinfo", {
            method: "GET",
            credentials: "include", // 쿠키를 포함시키기 위해 필요한 옵션
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("네트워크 응답이 올바르지 않습니다.");
                }
                return response.json(); // 먼저 텍스트로 반환받고, 확인
            })
            .then((jsonData) => {
                setUserData2(jsonData);
                console.log("✅ 사용자 정보:", jsonData);
                console.log("잉잉:", user);
            })
            .catch((error) => console.error("❌ 사용자 정보 가져오기 오류:", error));
    }, []);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch("/api/auth/check", {
                    credentials: "include",
                });

                if (!response.ok) throw new Error("Failed to fetch");

                const data = await response.json();

                setIsLoggedIn(data.isNewUser === false);
            } catch (error) {
                console.error("로그인 상태 확인 실패:", error);
                setIsLoggedIn(false);
            }
        };

        checkLoginStatus();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            setIsLoggedIn(false);
            window.location.reload();
        } catch (err) {
            console.error("로그아웃 실패", err);
        } finally {
            toggleMenu(); // 메뉴 닫기
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
                }}
                onClick={toggleMenu}
            >
                <Box
                    component="img"
                    src={userData2?.path || "/mock/Global/images/haribo.jpg"} // 기본 이미지 fallback 추가
                    alt="profile"
                    sx={{
                        maxWidth: "100%",
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

                {isLoggedIn && (
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
                    src={icon}
                    alt="아이콘"
                    sx={{
                        objectFit: "contain",
                    }}
                />
                <Box
                    component="span"
                    sx={{
                        ml: 0.5,
                        whiteSpace: "nowrap",
                        fontWeight: "bold",
                    }}
                >
                    꼬리친구들
                </Box>
            </Box>
            <div onClick={() => navigate("/notification")}>
                <Box
                    component="img"
                    src={notification}
                    alt="종"
                    sx={{
                        objectFit: "contain",
                        width: "40px",
                        height: "40px",
                    }}
                />
            </div>
        </Box>
    );
};

export default Header;
