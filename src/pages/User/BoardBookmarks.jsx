import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Card, Tab, Tabs, Checkbox, FormControlLabel, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TitleBar from "../../components/Global/TitleBar.jsx";
import { getBoardBookmarks } from "../../services/bookmarkService.js";
import { Context } from "../../context/Context.jsx";

// 게시판 타입에 따른 이름 매핑
const boardTypeMap = {
    1: "자유",
    2: "중고거래",
    3: "정보",
};

const BoardBookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [filteredBookmarks, setFilteredBookmarks] = useState([]);
    const [category, setCategory] = useState("전체");
    const [myPosts, setMyPosts] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useContext(Context);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                setLoading(true);
                const data = await getBoardBookmarks();
                setBookmarks(data || []);
                setFilteredBookmarks(data || []);
            } catch (error) {
                console.error("북마크를 불러오는 중 오류 발생:", error);
                setBookmarks([]);
                setFilteredBookmarks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, []);

    // 필터링 로직
    useEffect(() => {
        let filtered = [...bookmarks];

        // 카테고리 필터링
        if (category !== "전체") {
            const categoryId = Object.keys(boardTypeMap).find((key) => boardTypeMap[key] === category);
            filtered = filtered.filter((item) => item.boardTypeId.toString() === categoryId);
        }

        // 내 게시물 필터링
        if (myPosts) {
            filtered = filtered.filter((item) => item.authorId === user.id);
        }

        setFilteredBookmarks(filtered);
    }, [category, myPosts, bookmarks, user.id]);

    const handlePostClick = (postId) => {
        navigate(`/board/${postId}`);
    };

    const handleCategoryChange = (_, newValue) => {
        setCategory(newValue);
    };

    const handleMyPostsChange = (event) => {
        setMyPosts(event.target.checked);
    };

    return (
        <Box sx={{ bgcolor: "white", minHeight: "100vh", pb: 8 }}>
            <TitleBar name="게시물 북마크" />

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
                {loading ? (
                    <Box display="flex" justifyContent="center" my={3}>
                        <CircularProgress size={30} />
                    </Box>
                ) : filteredBookmarks.length > 0 ? (
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
                                    {item.firstImageUrl && (
                                        <img
                                            src={item.firstImageUrl}
                                            alt={item.title}
                                            style={{
                                                width: "80px",
                                                height: "80px",
                                                borderRadius: 8,
                                                objectFit: "cover",
                                            }}
                                        />
                                    )}
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
                                        {item.price && (
                                            <Typography
                                                sx={{
                                                    fontSize: "15px",
                                                    fontWeight: "bold",
                                                    color: "#E9A260",
                                                    mt: 1,
                                                }}
                                            >
                                                {item.price.toLocaleString()}원
                                            </Typography>
                                        )}
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

export default BoardBookmarks;
