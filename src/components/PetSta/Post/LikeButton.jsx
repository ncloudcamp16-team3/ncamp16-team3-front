import React, { useEffect, useState } from "react";
import { Box, keyframes } from "@mui/material";
import PetStaHeart from "../../../assets/images/PetSta/petsta-heart.svg";
import PetStaHeartFilled from "../../../assets/images/PetSta/petsta-heart-filled.svg";
import { toggleLike } from "../../../services/petstaService.js";

const LikeButton = ({ initialLiked, likes, postId }) => {
    const [likeCount, setLikeCount] = useState(likes);
    const [liked, setLiked] = useState(initialLiked);
    const [heartAnimation, setHeartAnimation] = useState(false);
    const [likeCountDisplay, setLikeCountDisplay] = useState("");

    const handleLikeClick = async () => {
        try {
            await toggleLike(postId);
            setLiked((prev) => !prev);
            setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
            setHeartAnimation(true);
            setTimeout(() => setHeartAnimation(false), 300);
        } catch (error) {
            console.error("좋아요 실패", error);
        }
    };

    useEffect(() => {
        if (likeCount >= 10000) {
            setLikeCountDisplay((likeCount / 10000).toFixed(1) + "만");
        } else {
            setLikeCountDisplay(likeCount.toString());
        }
    }, [likeCount]);

    const heartBeat = keyframes`
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
    `;

    return (
        <Box sx={{ padding: 1, display: "flex", alignItems: "center" }}>
            <Box
                component="img"
                src={liked ? PetStaHeartFilled : PetStaHeart}
                alt="Like Icon"
                onClick={handleLikeClick}
                sx={{
                    width: 24,
                    height: 24,
                    cursor: "pointer",
                    animation: heartAnimation ? `${heartBeat} 0.3s ease` : "none",
                }}
            />
            <Box sx={{ marginLeft: 1 }}>{likeCountDisplay}</Box>
        </Box>
    );
};

export default LikeButton;
