import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Box, SvgIcon } from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";
import CardContentAboutTime from "./CardContentAboutTime.jsx";

function TelephoneIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 512 512">
            <g transform="translate(0,512) scale(0.1,-0.1)" fill="currentColor" stroke="none">
                <path
                    d="M1164 5111 c-17 -4 -45 -15 -62 -24 -51 -25 -339 -255 -416 -332
-486 -484 -482 -1386 9 -2380 448 -909 1219 -1721 2009 -2117 619 -311 1177
-340 1598 -84 89 54 402 301 432 341 64 83 79 207 37 296 -25 54 -733 957
-792 1011 -50 46 -114 68 -199 68 -87 0 -131 -23 -285 -146 -214 -171 -243
-184 -401 -184 -282 0 -564 145 -839 431 -364 378 -567 834 -525 1177 13 103
48 209 85 258 15 19 102 94 193 167 205 163 227 195 227 322 0 62 -5 90 -22
125 -32 64 -753 978 -803 1017 -66 53 -163 73 -246 54z"
                />
            </g>
        </SvgIcon>
    );
}

const FacilityCards = ({ item }) => {
    const navigate = useNavigate();

    const rating = item.rating || 0;

    const StarRating = () => {
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

    return (
        <Card
            onClick={() => navigate(`/reserve/${item.id}`)}
            sx={{
                mb: 2,
                borderRadius: 2,
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
                cursor: "pointer",
            }}
        >
            <CardContent>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        "@media (max-width: 768px)": {
                            flexDirection: "column",
                            alignItems: "flex-start",
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: 16 }}>
                            {item.name}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: 14,
                                color: "#333",
                                display: "flex",
                                alignItems: "center",
                                gap: "2px",
                                flexWrap: "wrap",
                            }}
                        >
                            <span style={{ color: "#d32f2f", fontWeight: "bold", marginRight: 2 }}>
                                {(Math.round(item.rating * 10) / 10).toFixed(1)}
                            </span>
                            <StarRating />
                            리뷰 {item.reviewCount}건
                        </Typography>
                        <Typography sx={{ fontSize: 14, color: "#555" }}>
                            {item.distance >= 1000
                                ? `${(item.distance / 1000).toFixed(1)}km`
                                : `${Math.round(item.distance)}m`}
                            {" ・ "}
                            {item.address}
                        </Typography>
                        <Typography sx={{ fontSize: 14, color: "#555" }}>
                            <TelephoneIcon sx={{ fontSize: 13 }} />{" "}
                            {item.tel.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, "$1-$2-$3")}
                        </Typography>
                        <CardContentAboutTime openTimeRange={item.openTimeRange} isOpened={item.opened} />
                    </Box>
                    <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{
                            width: 130,
                            height: 130,
                            objectFit: "cover",
                            borderRadius: 1,
                            border: "1px solid #C8C8C8",
                            "@media (max-width: 768px)": {
                                width: "100%",
                                height: 180,
                                borderRadius: "8px 8px 0 0",
                                mt: 1,
                            },
                        }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default FacilityCards;
