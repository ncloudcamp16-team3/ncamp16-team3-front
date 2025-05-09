import React, { useState } from "react";
import { Grid, Card, CardContent, Avatar, Typography, TextField, Button, Box, Stack, CardMedia } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ReviewDropdown from "./ReviewDropdown"; // 드롭다운 버튼 컴포넌트
import { putReview } from "../../services/reserveService";

const ReviewCardItem = ({ review, user, handleReviewDelete }) => {
    const isMyReview = user?.id === review.userId;
    const [editable, setEditable] = useState(false);
    const [comment, setComment] = useState(review.comment);
    const [image, setImage] = useState(review.reviewImages?.[0] || null);
    const [imageFile, setImageFile] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImage(URL.createObjectURL(file));
        }
    };

    const handleUpdateSubmit = async () => {
        const formData = new FormData();
        formData.append("comment", comment);
        formData.append("starPoint", review.starPoint);
        if (imageFile) formData.append("image", imageFile);

        try {
            await putReview({ id: review.id, formData });
            setEditable(false);
            alert("리뷰가 수정되었습니다.");
        } catch (err) {
            alert("리뷰 수정 실패: " + err.message);
        }
    };

    return (
        <Grid item sx={{ width: "100%" }}>
            <Card sx={{ width: "100%" }}>
                <CardContent sx={{ width: "100%" }}>
                    <Stack sx={{ display: "flex", flexDirection: "row", alignItems: "center", mb: 2, gap: 3 }}>
                        <Avatar src={review.userProfileImage} />
                        <Typography variant="subtitle1">{review.userName}</Typography>
                        {isMyReview && (
                            <ReviewDropdown
                                user={user}
                                review={review}
                                onUpdate={() => setEditable(true)}
                                onDelete={() => handleReviewDelete(review.id)}
                            />
                        )}
                    </Stack>

                    {image && (
                        <Box sx={{ position: "relative", mb: 2 }}>
                            <CardMedia
                                component="img"
                                height="180"
                                image={image}
                                alt="review"
                                sx={{ borderRadius: 1, cursor: editable ? "pointer" : "default" }}
                                onClick={() => editable && document.getElementById(`fileInput-${review.id}`).click()}
                            />
                            <input id={`fileInput-${review.id}`} type="file" hidden onChange={handleImageChange} />
                        </Box>
                    )}

                    <TextField
                        fullWidth
                        multiline
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        disabled={!editable}
                        variant="outlined"
                        sx={{
                            mb: 1,
                            bgcolor: "none",
                            "& .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                            },
                        }}
                    />

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <StarIcon
                                key={index}
                                fontSize="small"
                                sx={{
                                    color: index < review.starPoint ? "#FFC107" : "#E0E0E0",
                                }}
                            />
                        ))}
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                            {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                        {editable && (
                            <Button size="small" variant="contained" onClick={handleUpdateSubmit}>
                                저장
                            </Button>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default ReviewCardItem;
