import React, { useState } from "react";
import { Box, keyframes } from "@mui/material";
import PetStaHeart from "../../../assets/images/PetSta/petsta-heart.svg";
import PetStaHeartWhite from "../../../assets/images/PetSta/petsta-heart-white.svg";
import PetStaHeartFilled from "../../../assets/images/PetSta/petsta-heart-filled.svg";
import { toggleLike } from "../../../services/petstaService.js";

const LikeButton = ({ postId, initialLiked, onLikeChange, isWhite = false, width = 24 }) => {
    const [liked, setLiked] = useState(initialLiked);
    const [heartAnimation, setHeartAnimation] = useState(false);

    const handleLikeClick = async () => {
        try {
            await toggleLike(postId);
            const newLiked = !liked; // 현재 liked 기반으로 반전
            setLiked(newLiked);
            onLikeChange?.(newLiked); // **바뀐 값**으로 부모에게 알림
            setHeartAnimation(true);
            setTimeout(() => setHeartAnimation(false), 300);
        } catch (error) {
            console.error("좋아요 실패", error);
        }
    };

    const heartBeat = keyframes`
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
    `;

    return (
        <Box
            component="img"
            src={liked ? PetStaHeartFilled : isWhite ? PetStaHeartWhite : PetStaHeart}
            alt="Like Icon"
            onClick={handleLikeClick}
            sx={{
                width: width,
                cursor: "pointer",
                animation: heartAnimation ? `${heartBeat} 0.3s ease` : "none",
            }}
        />
    );
};

export default LikeButton;
