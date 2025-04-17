import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardMedia, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// Mock 데이터 - 펫스타 (이미지만)
const mockPetstaBookmarks = [
    {
        id: 1,
        thumbnail: "/mock/PetMeeting/images/pet1.jpg",
        fileType: "photo",
    },
    {
        id: 2,
        thumbnail: "/mock/PetMeeting/images/pet2.jpg",
        fileType: "video",
    },
];

// Mock 데이터 - 게시물 (분류별)
const mockPostBookmarks = [
    {
        id: 1,
        title: "제 반려견 도비에요!",
        thumbnail: "/mock/Global/images/haribo.jpg",
        content: "안녕하세요 도비에요 오늘은...\n너무 커엽죠....",
        category: "자유",
    },
    {
        id: 2,
        title: "2025 어질리티 대회",
        thumbnail: "/mock/PetMeeting/images/pet4.jpg",
        content: "안녕하세요 오는 2025-04 ~2025-05-17 제휴사...",
        category: "정보",
    },
];

const Bookmark = () => {
    const [petstaBookmarks, setPetstaBookmarks] = useState([]);
    const [postBookmarks, setPostBookmarks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setPetstaBookmarks(mockPetstaBookmarks);
        setPostBookmarks(mockPostBookmarks);
    }, []);

    const handlePetstaClick = (postId) => {
        navigate(`/petsta/post/${postId}`);
    };

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    const handleSeeMorePetsta = () => {
        navigate("/bookmarks/petsta");
    };

    const handleSeeMorePosts = () => {
        navigate("/bookmarks/posts");
    };

    return (
        <Box sx={{ bgcolor: "white", minHeight: "100vh", pb: 8 }}>
            {/* 북마크 제목 */}
            <Box sx={{ p: 2, pb: 0 }}>
                <Typography sx={{ fontSize: "20px", fontWeight: "600", mb: 2 }}>북마크</Typography>
            </Box>

            <Box sx={{ px: 2 }}>
                {/* 펫스타 섹션 헤더와 더보기 버튼 */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 1 }}>
                    <Box>
                        <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>✨ 인스타 북마크</Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "#777",
                            fontSize: "14px",
                            cursor: "pointer",
                        }}
                        onClick={handleSeeMorePetsta}
                    >
                        <Typography sx={{ fontSize: "14px", color: "#777" }}>더보기</Typography>
                        <KeyboardArrowRightIcon sx={{ fontSize: 18 }} />
                    </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
                    {petstaBookmarks.map((item) => (
                        <Box
                            key={item.id}
                            onClick={() => handlePetstaClick(item.id)}
                            sx={{
                                width: "calc(50% - 3px)",
                                borderRadius: 2,
                                overflow: "hidden",
                                position: "relative",
                                aspectRatio: "1/1",
                                maxHeight: "130px",
                                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                "&:hover": {
                                    transform: "translateY(-3px)",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                },
                            }}
                        >
                            <CardMedia
                                component="img"
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                                image={item.thumbnail}
                                alt="펫스타 이미지"
                            />
                            {item.fileType === "video" && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        width: "20px",
                                        height: "20px",
                                        bgcolor: "rgba(0,0,0,0.5)",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {/* 플레이 버튼 아이콘 */}
                                    <Box
                                        sx={{
                                            width: 0,
                                            height: 0,
                                            borderTop: "5px solid transparent",
                                            borderBottom: "5px solid transparent",
                                            borderLeft: "8px solid white",
                                            ml: "2px", // 중앙 정렬을 위한 미세 조정
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>

                <Divider sx={{ my: 3, borderColor: "#eee" }} />

                {/* 게시물 섹션 헤더와 더보기 버튼 */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>📰 게시물 북마크</Typography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "#777",
                            fontSize: "14px",
                            cursor: "pointer",
                        }}
                        onClick={handleSeeMorePosts}
                    >
                        <Typography sx={{ fontSize: "14px", color: "#777" }}>더보기</Typography>
                        <KeyboardArrowRightIcon sx={{ fontSize: 18 }} />
                    </Box>
                </Box>

                {postBookmarks.map((item) => (
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
                        <Box sx={{ p: 2 }}>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <CardMedia
                                    component="img"
                                    sx={{
                                        width: "95px",
                                        height: "95px",
                                        borderRadius: 2,
                                        objectFit: "cover",
                                    }}
                                    image={item.thumbnail}
                                    alt={item.title}
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
                                        <Typography sx={{ fontWeight: "bold", fontSize: "17px", flex: 1 }}>
                                            {item.title}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: "14px",
                                                color: "#777777",
                                                fontWeight: "medium",
                                            }}
                                        >
                                            {item.category}
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
                                </Box>
                            </Box>
                        </Box>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default Bookmark;
