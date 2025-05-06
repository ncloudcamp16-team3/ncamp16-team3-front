import React, { useEffect, useState } from "react";
import { Rating, Typography, Box, Stack } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const StarRatingConstructor = ({ starPoint, setStarPoint }) => {
    const [value, setValue] = useState(0);
    const [hover, setHover] = useState(-1);

    const labels = {
        0: "평가 안함",
        1: "매우 나쁨",
        2: "나쁨",
        3: "보통",
        4: "좋음",
        5: "매우 좋음",
    };

    const getLabelText = (value) => {
        return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
    };

    useEffect(() => {
        if (setStarPoint) {
            setStarPoint(value);
        }
    }, [value, setStarPoint]);

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 3,
                borderRadius: 2,
                bgcolor: "background.paper",
            }}
        >
            <Typography component="h2" variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                만족도 평가
            </Typography>
            <Stack spacing={2}>
                <Rating
                    name="product-rating"
                    value={value}
                    precision={1}
                    getLabelText={getLabelText}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                    onChangeActive={(event, newHover) => {
                        setHover(newHover);
                    }}
                    icon={<StarIcon fontSize="large" sx={{ color: "#faaf00" }} />}
                    emptyIcon={<StarBorderIcon fontSize="large" sx={{ color: "#ccc" }} />}
                />
                <Typography sx={{ ml: 1, display: "flex", justifyContent: "center" }}>
                    {value !== null && <Box sx={{ fontWeight: "medium" }}>{labels[hover !== -1 ? hover : value]}</Box>}
                </Typography>
            </Stack>
        </Box>
    );
};

export default StarRatingConstructor;
