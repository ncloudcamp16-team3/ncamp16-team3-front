import React from "react";
import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { useNavigate } from "react-router-dom";
import useTimeAgo from "../../hook/useTimeAgo.js";

const PostCard = ({ postItem }) => {
    const navigate = useNavigate();
    const timeAgo = useTimeAgo(postItem.createdAt);

    return (
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
                <Typography variant="body1" sx={{ fontSize: "13px", mb: 0.5, color: "#888" }}>
                    {timeAgo}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: "bold",
                        fontSize: "15px",
                        mb: 0.5,
                        visibility: postItem.product ? "visible" : "hidden",
                    }}
                >
                    {postItem.product?.price}원
                </Typography>

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
            </CardContent>
        </Card>
    );
};

export default PostCard;
