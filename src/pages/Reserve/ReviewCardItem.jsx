import React, { useContext, useEffect, useState } from "react";
import {
    Grid,
    CardContent,
    Avatar,
    Typography,
    Button,
    Box,
    Stack,
    CardMedia,
    TextField,
    Divider,
} from "@mui/material";
import ReviewDropdown from "./ReviewDropDown";
import { putReview } from "../../services/reserveService";
import StarRatingConstructor from "../../components/Reserve/utils/StarRatingConstructor.jsx";
import { Context } from "../../context/Context.jsx";
import transformScoreToChartData from "../../hook/Reserve/transformScoreToChartData.js";

const ReviewCardItem = ({
    review,
    user,
    handleReviewDelete,
    setChartData,
    setReviews,
    setFacilityData,
    setLoading,
    setError,
    isLast,
}) => {
    const isMyReview = user?.id === review.userId;
    const [editable, setEditable] = useState(false);
    const [comment, setComment] = useState(review.comment);
    const [starPoint, setStarPoint] = useState(review.starPoint);
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [isExpended, setIsExpended] = useState(false);

    const { showModal } = useContext(Context);

    // ✅ 외부 review 변경 시 comment와 starPoint 동기화
    useEffect(() => {
        if (!editable) {
            setComment(review.comment);
            setStarPoint(review.starPoint);
        }
    }, [review, editable]);

    const isLongContent = comment.length > 30;
    const shortContent = isLongContent ? comment.slice(0, 30) + "..." : comment;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleExpandClick = () => setIsExpended((prev) => !prev);

    const renderContent = (text) => {
        return text.split("\n").map((line, idx) => (
            <span key={idx}>
                {line}
                <br />
            </span>
        ));
    };

    const handleUpdateSubmit = async () => {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("comment", comment);
        formData.append("starPoint", starPoint);
        if (imageFile) formData.append("image", imageFile);

        try {
            const response = await putReview({ id: review.id, formData });
            const data = response.data;

            setFacilityData(data.facility);
            setReviews(data.reviews || []);
            setChartData(transformScoreToChartData(data.ratingRatio));
            setEditable(false);
            setImageFile(null);
            setPreviewImage(null);
        } catch (err) {
            showModal("", "리뷰 수정 실패: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCancel = () => {
        setComment(review.comment);
        setStarPoint(review.starPoint);
        setImageFile(null);
        setPreviewImage(null);
        setEditable(false);
    };

    const imageToShow = editable ? previewImage : review.reviewImages?.[0];

    return (
        <Grid item sx={{ width: "100%", padding: "0" }}>
            <Box sx={{ width: "100%" }}>
                <CardContent sx={{ width: "100%", padding: "0 20px" }}>
                    <Stack direction="row" alignItems="center" mb={2}>
                        <Avatar src={review.userProfileImage} />
                        <Typography sx={{ fontSize: "1.2rem", ml: "5px", mr: "8px" }}>{review.userName}</Typography>
                        <Typography sx={{ fontSize: "0.8rem" }} color="text.secondary">
                            {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                        {isMyReview && (
                            <ReviewDropdown
                                user={user}
                                review={review}
                                onUpdate={() => setEditable(true)}
                                onDelete={() => handleReviewDelete(review)}
                            />
                        )}
                    </Stack>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            minHeight: imageToShow ? 100 : "auto",
                        }}
                    >
                        <Box sx={{ display: "flex", flexDirection: "column", pr: "10px", width: "100%" }}>
                            {editable ? (
                                <TextField
                                    multiline
                                    fullWidth
                                    minRows={3}
                                    maxRows={8}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    variant="outlined"
                                    size="small"
                                    sx={{ width: "100%", mb: 1 }}
                                />
                            ) : (
                                <Typography
                                    maxWidth="400px"
                                    component="span"
                                    display="inline"
                                    sx={{ wordBreak: "break-word", flex: 1 }}
                                >
                                    {isExpended ? renderContent(comment) : shortContent}
                                    {isLongContent && (
                                        <Typography
                                            sx={{ color: "gray", cursor: "pointer" }}
                                            onClick={handleExpandClick}
                                        >
                                            {isExpended ? "접기" : "더 보기"}
                                        </Typography>
                                    )}
                                </Typography>
                            )}

                            <StarRatingConstructor
                                starRating={starPoint}
                                setStarRating={setStarPoint}
                                defaultValue={review.starPoint}
                                editable={editable}
                            />
                        </Box>

                        <Box
                            sx={{
                                maxWidth: 80,
                                flexShrink: 0,
                            }}
                        >
                            {editable ? (
                                <Box sx={{ position: "relative", mb: 2 }}>
                                    {previewImage ? (
                                        <CardMedia
                                            component="img"
                                            height="100"
                                            image={previewImage}
                                            alt="preview"
                                            sx={{
                                                borderRadius: 1,
                                                cursor: "pointer",
                                                objectFit: "contain",
                                            }}
                                            onClick={() => document.getElementById(`fileInput-${review.id}`).click()}
                                        />
                                    ) : (
                                        <Box
                                            onClick={() => document.getElementById(`fileInput-${review.id}`).click()}
                                            sx={{
                                                height: 100,
                                                width: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                border: "1px dashed #ccc",
                                                borderRadius: 1,
                                                cursor: "pointer",
                                                color: "#888",
                                                fontSize: 14,
                                            }}
                                        >
                                            이미지를 업로드하려면 클릭하세요
                                        </Box>
                                    )}
                                    <input
                                        id={`fileInput-${review.id}`}
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </Box>
                            ) : (
                                imageToShow && (
                                    <CardMedia
                                        component="img"
                                        height="100"
                                        image={imageToShow}
                                        alt="review"
                                        sx={{
                                            borderRadius: 1,
                                            mb: 2,
                                            objectFit: "contain",
                                            width: "100%",
                                        }}
                                    />
                                )
                            )}
                        </Box>
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        {editable && (
                            <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={handleUpdateCancel}
                                    sx={{
                                        bgcolor: "#FDF1E5",
                                        color: "#E9A260",
                                        "&:hover": {
                                            bgcolor: "#F2DFCE",
                                        },
                                        borderRadius: "4px",
                                        px: 3,
                                        py: 1,
                                    }}
                                >
                                    취소
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={handleUpdateSubmit}
                                    sx={{
                                        bgcolor: "#E9A260",
                                        color: "white",
                                        "&:hover": {
                                            bgcolor: "#d0905a",
                                        },
                                        borderRadius: "4px",
                                        px: 3,
                                        py: 1,
                                    }}
                                >
                                    저장
                                </Button>
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Box>
            {!isLast && <Divider sx={{ my: 2, borderColor: "#ccc", borderBottomWidth: "1px" }} />}
        </Grid>
    );
};

export default ReviewCardItem;
