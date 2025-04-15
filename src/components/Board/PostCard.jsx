import React from "react";
import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { useNavigate } from "react-router-dom";

const PostCard = ({ postItem }) => {
    const navigate = useNavigate();
    const timeAgo = (dateString) => {
        const targetDate = new Date(dateString);
        const currentDate = new Date();

        const timeDifference = currentDate - targetDate; // 밀리초 차이

        // 초 단위로 변환
        const seconds = Math.floor(timeDifference / 1000);
        if (seconds < 60) return `${seconds}초 전`;

        // 분 단위로 변환
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}분 전`;

        // 시간 단위로 변환
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}시간 전`;

        // 일 단위로 변환
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days}일 전`;

        // 월 단위로 변환 (30일 기준)
        const months = Math.floor(days / 30);
        if (months < 12) return `${months}개월 전`;

        // 년 단위로 변환
        const years = Math.floor(months / 12);
        return `${years}년 전`;
    };

    return (
        <Card
            onClick={() => navigate(`/post/${postItem.id}`)}
            sx={{
                display: "flex",
                alignItems: "flex-start",
                p: 1.5,
                mb: 2,
                borderRadius: 2,
                cursor: "pointer",
                boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.15)",
                border: "1px solid #eee",
            }}
        >
            <Avatar
                variant="rounded"
                src={postItem.photos[0]?.url}
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
                    {timeAgo(postItem.createdAt)}
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
                        <VisibilityIcon sx={{ fontSize: 16, marginTop: "2px" }} />
                        <span sx={{ marginTop: "2px" }}>{postItem.viewCount}</span>
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
