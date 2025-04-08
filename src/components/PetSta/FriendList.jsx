import React, { useContext, useMemo, useRef } from "react";
import FriendsData from "../../mock/PetSta/friends.json";
import FriendIcon from "./FriendIcon.jsx";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/Context.jsx";

const FriendList = () => {
    const scrollRef = useRef(null); // 스크롤할 영역을 참조하기 위한 ref
    const isDragging = useRef(false); // 드래그 상태를 추적하는 ref
    const startX = useRef(0); // 드래그 시작 위치
    const scrollLeft = useRef(0); // 드래그 시작 시 스크롤 위치
    const navigate = useNavigate();
    const { user } = useContext(Context);

    const friends = useMemo(() => FriendsData, []);
    const theme = useTheme();
    // 마우스 다운 핸들러
    const handleMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.pageX - scrollRef.current.offsetLeft;
        scrollLeft.current = scrollRef.current.scrollLeft;
    };

    // 마우스 무브 핸들러
    const handleMouseMove = (e) => {
        if (!isDragging.current) return; // 드래그 중이 아닐 때 무시
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX.current) * 2; // 드래그 속도 설정
        scrollRef.current.scrollLeft = scrollLeft.current - walk;
    };

    // 마우스 업 또는 마우스 아웃 핸들러
    const handleMouseUpOrLeave = () => {
        isDragging.current = false;
    };

    return (
        <Box
            ref={scrollRef}
            display="flex"
            flexDirection="row"
            sx={{
                padding: 1.2,
                gap: 5,
                overflowX: "auto", // 가로 스크롤 활성화
                whiteSpace: "nowrap", // 한 줄에 배치
                scrollbarWidth: "none", // Firefox에서 스크롤바 숨김
                "&::-webkit-scrollbar": {
                    display: "none", // Chrome, Safari에서 스크롤바 숨김
                },
                cursor: "grab", // 드래그할 수 있음을 나타내는 커서
                userSelect: "none",
                borderBottom: "1px solid #ccc",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave} // 마우스가 영역을 벗어날 때도 드래그 해제
        >
            <Box display="flex" flexDirection="column" alignItems="center">
                <Box
                    sx={{
                        borderRadius: "50%",
                        padding: "2px",
                        background: "linear-gradient(90deg, #E9A260 0%, #E2DECE 100%)",
                    }}
                >
                    <Box
                        sx={{
                            borderRadius: "50%",
                            border: "2px solid #FFFFFF",
                            overflow: "hidden",
                            width: "42px",
                            height: "42px",
                            flexShrink: 0, // 크기를 고정하여 스크롤 가능하게 설정
                        }}
                        onClick={() => navigate(`/petsta/user/${user.id}`)}
                    >
                        <Box
                            component="img"
                            src={`./mock/Global/images/${user.photo}`}
                            alt="profile"
                            sx={{
                                maxWidth: "100%",
                            }}
                            draggable={false}
                        />
                    </Box>
                </Box>
                <Typography marginTop="4px" fontSize="11px" color={theme.secondary}>
                    {user.name}
                </Typography>
            </Box>
            {friends.map((friend, index) => (
                <FriendIcon key={index} friend={friend} />
            ))}
        </Box>
    );
};

export default FriendList;
