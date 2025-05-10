import React, { useEffect, useState } from "react";
import { Rating, Box, Stack } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const StarRatingConstructor = ({ defaultValue = 0, setStarRating, getLabelText, setHover, editable = true }) => {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        if (setStarRating) {
            setStarRating(value);
        }
    }, [value, setStarRating]);

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

    return (
        <Box>
            <Stack spacing={2}>
                <Rating
                    name="product-rating"
                    value={value}
                    precision={1}
                    readOnly={!editable}
                    getLabelText={getLabelText}
                    onChange={(event, newValue) => {
                        if (editable && newValue !== null) {
                            setValue(newValue);
                        }
                    }}
                    onChangeActive={(event, newHover) => {
                        if (editable && setHover) {
                            setHover(newHover);
                        }
                    }}
                    icon={<StarIcon fontSize="small" sx={{ color: "#faaf00" }} />}
                    emptyIcon={<StarBorderIcon fontSize="small" sx={{ color: "#ccc" }} />}
                />
            </Stack>
        </Box>
    );
};

export default StarRatingConstructor;
