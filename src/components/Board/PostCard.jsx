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
                            visibility:
                                (postItem.price !== null && postItem.price !== undefined) || !postItem.sell
                                    ? "visible"
                                    : "hidden",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                        }}
                    >
                        {postItem.sell !== null && postItem.sell === false && (
                            // 거래완료 상태면 이것만 표시
                            <Chip
                                label="거래완료"
                                size="small"
                                color="secondary"
                                sx={{
                                    fontSize: "0.6rem",
                                    height: "16px",
                                    "& .MuiChip-label": {
                                        padding: "0 6px",
                                    },
                                }}
                            />
                        )}

                        {/* 거래완료가 아닌 경우에만 가격 관련 표시 */}
                        {postItem.sell && postItem.price === 0 && (
                            <Chip
                                label="무료나눔"
                                size="small"
                                color="primary"
                                sx={{
                                    fontSize: "0.6rem",
                                    height: "16px",
                                    "& .MuiChip-label": {
                                        padding: "0 6px",
                                    },
                                }}
                            />
                        )}

                        {/* 거래완료가 아니고 가격이 0보다 클 때만 가격 표시 */}
                        {postItem.sell && postItem.price > 0 && `${postItem.price}원`}
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
