import React from "react";
import { Box } from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";

const StarRating = (rating) => {
    console.log(rating);
    const percentage = (rating / 5) * 100;

    return (
        <Box
            sx={{
                position: "relative",
                display: "inline-block",
                width: 100,
                height: 20,
            }}
        >
            {/* 빈 별 5개 */}
            <Box
                sx={{
                    display: "flex",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    color: "#ccc", // 빈 별 색상
                }}
            >
                {Array.from({ length: 5 }).map((_, i) => (
                    <StarBorder key={i} sx={{ width: 20, height: 20 }} />
                ))}
            </Box>

            {/* 채워진 별 5개 (클리핑) */}
            <Box
                sx={{
                    display: "flex",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: `${percentage}%`,
                    height: "100%",
                    overflow: "hidden",
                    color: "#FFD700", // 채워진 별 색상
                    pointerEvents: "none",
                }}
            >
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} sx={{ width: 20, height: 20 }} />
                ))}
            </Box>
        </Box>
    );
};

export default StarRating;
