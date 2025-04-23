import React from "react";
import { useNavigate } from "react-router-dom";
import useInTimeRange from "../hooks/useInTimeRange";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import "../../../css/reserve/card.css";

const ReserveCard = ({ item }) => {
    const navigate = useNavigate();
    let filledStars = Math.floor(item.rating);
    if (item.rating >= 4.5 && item.rating < 5) filledStars = 4;

    return (
        <Card className={`reserve-card card`} onClick={() => navigate(`/reserve/${item.id}`)}>
            <CardContent>
                <Box className="card-content">
                    <Box className="text-content">
                        <Typography variant="h6" className="card-title">
                            {item.name}
                        </Typography>
                        <Typography className="card-rating">
                            <span className="rating-score">{item.rating}</span>
                            {[...Array(5)].map((_, index) => (
                                <StarIcon
                                    key={index}
                                    fontSize="small"
                                    className={index < filledStars ? "star-icon filled" : "star-icon"}
                                />
                            ))}
                            <span className="rating-count">({item.reviewCount})</span>
                            리뷰 {item.reviewCount}건
                        </Typography>
                        <Typography className="card-address">
                            {item.distance}km ・ {item.openTimeRange.join(" - ")}
                        </Typography>
                        <Chip
                            size="small"
                            label={useInTimeRange(item.openTimeRange) ? "영업중" : "영업종료"}
                            className="open-chip"
                        />
                        <Typography className="card-time">{item.openHours}</Typography>
                    </Box>
                    <img className="card-image" src={`images/${item.image}`} alt={item.name} />
                </Box>
            </CardContent>
        </Card>
    );
};

export default ReserveCard;
