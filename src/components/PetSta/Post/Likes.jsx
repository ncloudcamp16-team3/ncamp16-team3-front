import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import LikeButton from "./LikeButton";

const Likes = ({ postId, initialLiked, likes }) => {
    const [likeCount, setLikeCount] = useState(likes);
    const [likeCountDisplay, setLikeCountDisplay] = useState("");

    const handleLikeChange = (newLiked) => {
        setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));
    };

    useEffect(() => {
        if (likeCount >= 10000) {
            setLikeCountDisplay((likeCount / 10000).toFixed(1) + "만");
        } else {
            setLikeCountDisplay(likeCount.toString());
        }
    }, [likeCount]);

    return (
        <Box sx={{ padding: 1, display: "flex", alignItems: "center" }}>
            <LikeButton postId={postId} initialLiked={initialLiked} onLikeChange={handleLikeChange} />
            <Box sx={{ marginLeft: 1 }}>{likeCountDisplay}</Box>
        </Box>
    );
};

export default Likes;
