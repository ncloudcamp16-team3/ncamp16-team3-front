import React, { useState, useEffect } from "react";
import { Box, Typography, Card, Tab, Tabs, Checkbox, FormControlLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TitleBar from "../../components/Global/TitleBar.jsx";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import bookmarkData from "../../mock/Bookmark/bookmarkData.json";

// 게시판 타입에 따른 이름 매핑
const boardTypeMap = {
    1: "자유",
    2: "중고거래",
    4: "정보",
};

// Mock 데이터
const mockPostBookmarks = [
    {
        id: 1,
        title: "제 반려견 도비에요!",
        thumbnail: "/mock/Global/images/haribo.jpg",
        content: "안녕하세요 도비에요 오늘은...\n다양 종류로 돌봄 가능...",
        boardTypeId: 1, // 자유
    },
    {
        id: 2,
        title: "2025 어질리티 대회",
        thumbnail: "/mock/PetMeeting/images/pet4.jpg",
        content: "안녕하세요 오는 2025-02 ~2025-03-14 제휴사...",
        boardTypeId: 4, // 정보
    },
];

const PostBookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [filteredBookmarks, setFilteredBookmarks] = useState([]);
    const [category, setCategory] = useState("전체");
    const [myPosts, setMyPosts] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Mock 데이터 로드
        setBookmarks(mockPostBookmarks);
        setFilteredBookmarks(mockPostBookmarks);
    }, []);

    useEffect(() => {
        // 카테고리 필터링
        if (category === "전체") {
            setFilteredBookmarks(bookmarks);
        } else {
            const categoryId = Object.keys(boardTypeMap).find((key) => boardTypeMap[key] === category);
            setFilteredBookmarks(bookmarks.filter((item) => item.boardTypeId.toString() === categoryId));
        }
    }, [category, bookmarks]);

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleCategoryChange = (_, newValue) => {
        setCategory(newValue);
    };

    const handleMyPostsChange = (event) => {
        setMyPosts(event.target.checked);
    };

    return (
        <Box sx={{ bgcolor: "white", minHeight: "100vh", pb: 8 }}>
            <TitleBar name="북마크 게시물" onBack={handleBack} />

            <Box
                sx={{
                    position: "absolute",
                    top: 14,
                    right: 16,
                }}
            ></Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", px: 2, mt: 1 }}>
                <FormControlLabel
                    control={<Checkbox checked={myPosts} onChange={handleMyPostsChange} size="small" />}
                    label={<Typography sx={{ fontSize: "13px", color: "#555" }}>내 게시물 보기</Typography>}
                    sx={{ margin: 0 }}
                />
            </Box>
            {/* 카테고리 탭 */}
            <Tabs
                value={category}
                onChange={handleCategoryChange}
                variant="fullWidth"
                textColor="inherit"
                sx={{
                    "& .MuiTabs-indicator": {
                        backgroundColor: "#E9A260",
                    },
                    "& .MuiTab-root": {
                        color: "#999",
                        fontSize: "14px",
                        minWidth: 0,
                        padding: "10px 4px",
                        "&.Mui-selected": {
                            color: "#000",
                            fontWeight: "bold",
                        },
                    },
                }}
            >
                <Tab label="전체" value="전체" />
                <Tab label="중고거래" value="중고거래" />
                <Tab label="정보" value="정보" />
                <Tab label="자유" value="자유" />
            </Tabs>

            {/* 게시물 목록 */}
            <Box sx={{ p: 2 }}>
                {filteredBookmarks.length > 0 ? (
                    filteredBookmarks.map((item) => (
                        <Card
                            key={item.id}
                            onClick={() => handlePostClick(item.id)}
                            sx={{
                                mb: 2,
                                borderRadius: 3,
                                overflow: "hidden",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                border: "1px solid #F0F0F0",
                                backgroundColor: "#FFFFFF",
                                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                },
                            }}
                        >
                            <Box sx={{ p: 2 }}>
                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <Box
                                        component="img"
                                        src={item.thumbnail}
                                        alt={item.title}
                                        sx={{
                                            width: "80px",
                                            height: "80px",
                                            borderRadius: 2,
                                            objectFit: "cover",
                                        }}
                                    />
                                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                mb: 0.5,
                                                alignItems: "flex-start",
                                            }}
                                        >
                                            <Typography sx={{ fontWeight: "bold", fontSize: "16px", flex: 1 }}>
                                                {item.title}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: "14px",
                                                    color: "#777777",
                                                    fontWeight: "medium",
                                                }}
                                            >
                                                {boardTypeMap[item.boardTypeId]}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                flex: 1,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                fontSize: "14px",
                                                color: "#666",
                                            }}
                                        >
                                            {item.content}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Card>
                    ))
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "calc(100vh - 200px)",
                        }}
                    >
                        <Typography variant="subtitle1" color="text.secondary">
                            북마크한 게시물이 없습니다.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            관심있는 게시물을 북마크해보세요!
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default PostBookmarks;
