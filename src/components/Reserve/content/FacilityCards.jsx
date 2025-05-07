import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import CardContentAboutTime from "./CardContentAboutTime.jsx";

const FacilityCards = ({ item }) => {
    const navigate = useNavigate();
    console.log(item);
    let filledStars = Math.floor(item.rating);
    if (item.rating >= 4.5 && item.rating < 5) filledStars = 4;

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
                                {Math.round(item.rating).toFixed(1)}
                            </span>
                            {[...Array(5)].map((_, index) => (
                                <StarIcon
                                    key={index}
                                    fontSize="small"
                                    sx={{ color: index < filledStars ? "#ff9800" : "#ccc" }}
                                />
                            ))}
                            리뷰 {item.reviewCount}건
                        </Typography>
                        <Typography sx={{ fontSize: 14, color: "#555" }}>
                            {item.distance >= 1000
                                ? `${(item.distance / 1000).toFixed(1)}km`
                                : `${Math.round(item.distance)}m`}
                            {" ・ "}
                            {item.address}
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
