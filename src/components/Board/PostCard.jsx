import React, { useContext } from "react";
import { Avatar, Box, Card, CardContent, Chip, Typography } from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { useNavigate } from "react-router-dom";
import useTimeAgo from "../../hook/useTimeAgo.js";
import { Context } from "../../context/Context.jsx";

const PostCard = ({ postItem }) => {
    const navigate = useNavigate();
    const timeAgo = useTimeAgo(postItem.createdAt);
    const { boardType } = useContext(Context);

    return (
        <Box sx={{ px: 1.5 }}>
            <Card
                onClick={() => navigate(`/board/${postItem.id}`)}
                sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    p: 1.5,
                    mb: 2,
                    borderRadius: 2,
                    cursor: "pointer",
                    boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.15)",
                    border: "1px solid #eee",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "4px 8px 15px rgba(0, 0, 0, 0.2)",
                    },
                }}
            >
                <Avatar
                    variant="rounded"
                    src={postItem.imageUrls && postItem.imageUrls[0]}
                    alt="썸네일"
                    sx={{
                        width: 102,
                        height: 102,
                        mr: 2,
                        flexShrink: 0,
                    }}
                />

                <CardContent sx={{ flex: 1, p: 0, "&:last-child": { pb: 0 } }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "15px", mb: 0.5 }}>
                        {postItem.title}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: "13px", mb: 0.5 }}>
                        {postItem.authorNickname}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: "13px", mb: 0.5, color: "#888" }}>
                        {timeAgo}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: "bold",
                            fontSize: "15px",
                            mb: 0.5,
                            visibility: postItem.price ? "visible" : "hidden",
                            display: "flex", // flex 컨테이너로 만들어서 인라인 요소들을 나란히 배치
                            alignItems: "center", // 수직 중앙 정렬
                            gap: 0.5, // 아이템 간 간격
                        }}
                    >
                        {/* 거래완료 표시 조건부 렌더링 */}
                        {!postItem.sell && (
                            <Chip
                                label="거래완료"
                                size="small"
                                color="secondary"
                                sx={{
                                    fontSize: "0.6rem", // 작은 글씨
                                    height: "16px", // 낮은 높이
                                    "& .MuiChip-label": {
                                        padding: "0 6px", // 좌우 패딩 조정
                                    },
                                }}
                            />
                        )}
                        {postItem.price}원
                    </Typography>

                    {boardType.id !== 2 && (
                        <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: "3px" }}>
                                <FavoriteIcon sx={{ fontSize: 16, marginTop: "2px" }} />
                                <span sx={{ marginTop: "2px" }}>{postItem.likeCount}</span>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: "3px" }}>
                                <ChatBubbleIcon sx={{ fontSize: 16, marginTop: "2px" }} />
                                <span sx={{ marginTop: "2px" }}>{postItem.commentCount}</span>
                            </Box>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default PostCard;
