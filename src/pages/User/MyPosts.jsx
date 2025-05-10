import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, Typography, Card, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getMyPosts } from "../../services/myPostsService.js";
import Loading from "../../components/Global/Loading";
import TitleBar from "../../components/Global/TitleBar";

// 게시판 타입에 따른 이름 매핑
const boardTypeMap = {
    1: "자유",
    2: "중고거래",
    3: "정보",
};

const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const observer = useRef();
    const navigate = useNavigate();

    const lastPostElementRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchMyPosts = async () => {
            try {
                setLoading(true);
                const response = await getMyPosts(page, 10);
                if (page === 0) {
                    setPosts(response.data.content);
                } else {
                    setPosts((prev) => [...prev, ...response.data.content]);
                }
                setHasMore(!response.data.last);
            } catch (error) {
                console.error("내 게시글을 가져오는 중 오류 발생:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyPosts();
    }, [page]);

    const handlePostClick = (postId) => {
        navigate(`/board/${postId}`);
    };

    return (
        <Box sx={{ bgcolor: "white", minHeight: "100vh", pb: 8 }}>
            <TitleBar name="내 게시글" />

            <Box sx={{ p: 2, pt: 0 }}>
                {loading && page === 0 ? (
                    <Loading />
                ) : posts.length > 0 ? (
                    posts.map((item, index) => {
                        if (posts.length === index + 1) {
                            return (
                                <Card
                                    ref={lastPostElementRef}
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
                                            transform: "translateY(-3px)",
                                            boxShadow: "0 5px 12px rgba(0,0,0,0.1)",
                                        },
                                    }}
                                >
                                    <PostContent item={item} />
                                </Card>
                            );
                        } else {
                            return (
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
                                            transform: "translateY(-3px)",
                                            boxShadow: "0 5px 12px rgba(0,0,0,0.1)",
                                        },
                                    }}
                                >
                                    <PostContent item={item} />
                                </Card>
                            );
                        }
                    })
                ) : (
                    <Typography sx={{ py: 4, textAlign: "center", color: "#777" }}>
                        작성한 게시물이 없습니다.
                    </Typography>
                )}
                {loading && page > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                        <Loading />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

const PostContent = ({ item }) => (
    <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
            {item.firstImageUrl && (
                <CardMedia
                    component="img"
                    sx={{
                        width: "95px",
                        height: "95px",
                        borderRadius: 2,
                        objectFit: "cover",
                    }}
                    image={item.firstImageUrl}
                    alt={item.title}
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
                    <Typography sx={{ fontWeight: "bold", fontSize: "17px", flex: 1 }}>{item.title}</Typography>
                    <Typography
                        sx={{
                            fontSize: "14px",
                            color: "#777777",
                            fontWeight: "medium",
                        }}
                    >
                        {boardTypeMap[item.boardTypeId] || "기타"}
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
                        fontSize: "15px",
                        color: "#666",
                    }}
                >
                    {item.content}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                    {item.price && (
                        <Typography
                            sx={{
                                fontSize: "15px",
                                fontWeight: "bold",
                                color: "#E9A260",
                            }}
                        >
                            {item.price.toLocaleString()}원
                        </Typography>
                    )}
                    <Typography
                        sx={{
                            fontSize: "13px",
                            color: "#888",
                        }}
                    >
                        {new Date(item.createdAt).toLocaleDateString()}
                    </Typography>
                </Box>
            </Box>
        </Box>
    </Box>
);

export default MyPosts;
