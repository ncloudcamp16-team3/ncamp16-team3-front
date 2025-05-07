import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardMedia, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { getAllBookmarks } from "../../services/bookmarkService.js";
import Loading from "../../components/Global/Loading";

// 게시판 타입에 따른 이름 매핑
const boardTypeMap = {
    1: "자유",
    2: "중고거래",
    3: "정보",
};

const Bookmark = () => {
    const [petstaBookmarks, setPetstaBookmarks] = useState([]);
    const [boardBookmarks, setBoardBookmarks] = useState([]);
    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                setLoading(true);
                const data = await getAllBookmarks();
                setPetstaBookmarks(data.petstaBookmarks || []);
                setBoardBookmarks(data.boardBookmarks || []);
                setMyPosts(data.myPosts?.content || []);
            } catch (error) {
                console.error("북마크를 가져오는 중 오류 발생:", error);
                setPetstaBookmarks([]);
                setBoardBookmarks([]);
                setMyPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, []);

    const handlePetstaClick = (postId) => {
        navigate(`/petsta/post/${postId}`);
    };

    const handleBoardClick = (postId) => {
        navigate(`/board/${postId}`);
    };

    const handleSeeMorePetsta = () => {
        navigate("/bookmarks/petsta");
    };

    const handleSeeMoreBoards = () => {
        navigate("/bookmarks/posts");
    };

    if (loading) {
        return <Loading />;
    }

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
                        <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>✨ 펫스타 북마크</Typography>
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

                {/* 펫스타 북마크 */}
                <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
                    {petstaBookmarks.length > 0 ? (
                        petstaBookmarks.slice(0, 2).map((item) => (
                            <Box
                                key={item.id}
                                onClick={() => handlePetstaClick(item.postId)}
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
                                    image={item.fileName}
                                    alt="펫스타 이미지"
                                />
                                {item.fileType === "VIDEO" && (
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
                                                ml: "2px",
                                            }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        ))
                    ) : (
                        <Typography sx={{ py: 2, color: "#777" }}>북마크한 펫스타가 없습니다.</Typography>
                    )}
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
                        onClick={handleSeeMoreBoards}
                    >
                        <Typography sx={{ fontSize: "14px", color: "#777" }}>더보기</Typography>
                        <KeyboardArrowRightIcon sx={{ fontSize: 18 }} />
                    </Box>
                </Box>

                {/* 게시물 북마크 */}
                {boardBookmarks.length > 0 ? (
                    boardBookmarks.slice(0, 2).map((item) => (
                        <Card
                            key={item.id}
                            onClick={() => handleBoardClick(item.id)}
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
                    <Typography sx={{ py: 2, color: "#777" }}>북마크한 게시물이 없습니다.</Typography>
                )}

                <Divider sx={{ my: 3, borderColor: "#eee" }} />

                {/* 내 게시글 섹션 헤더와 더보기 버튼 */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>📝 내 게시글</Typography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "#777",
                            fontSize: "14px",
                            cursor: "pointer",
                        }}
                        onClick={() => navigate("/my-posts")}
                    >
                        <Typography sx={{ fontSize: "14px", color: "#777" }}>더보기</Typography>
                        <KeyboardArrowRightIcon sx={{ fontSize: 18 }} />
                    </Box>
                </Box>

                {/* 내 게시글 */}
                {myPosts.length > 0 ? (
                    myPosts.slice(0, 2).map((item) => (
                        <Card
                            key={item.id}
                            onClick={() => handleBoardClick(item.id)}
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
                    <Typography sx={{ py: 2, color: "#777" }}>작성한 게시물이 없습니다.</Typography>
                )}
            </Box>
        </Box>
    );
};

export default Bookmark;
