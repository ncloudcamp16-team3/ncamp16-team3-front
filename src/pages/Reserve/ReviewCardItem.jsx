import React, { useContext, useEffect, useState, useRef } from "react";
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
    IconButton,
} from "@mui/material";
import ReviewDropdown from "./ReviewDropDown";
import { putReview } from "../../services/reserveService";
import StarRatingConstructor from "../../components/Reserve/utils/StarRatingConstructor.jsx";
import { Context } from "../../context/Context.jsx";
import transformScoreToChartData from "../../hook/Reserve/transformScoreToChartData.js";
import DeleteIcon from "@mui/icons-material/Delete";

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
    const [imageToShow, setImageToShow] = useState(review.reviewImages?.[0] || null);
    const [isExpended, setIsExpended] = useState(false);

    const fileInputRef = useRef(); // ✅ 파일 input 참조
    const { handleSnackbarOpen } = useContext(Context);

    useEffect(() => {
        if (!editable) {
            setComment(review.comment);
            setStarPoint(review.starPoint);
        }
    }, [review, editable]);

    useEffect(() => {
        setImageToShow(previewImage || review.reviewImages?.[0] || null);
    }, [previewImage, review.reviewImages]);

    const isLongContent = comment.length > 30;
    const shortContent = isLongContent ? comment.slice(0, 30) + "..." : comment;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
        }
    };

    const handleImageRemove = () => {
        setImageFile(null);
        setPreviewImage(null);
        setImageToShow(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // ✅ input 초기화
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
            handleSnackbarOpen("리뷰가 수정되었습니다");
        } catch (err) {
            handleSnackbarOpen("리뷰 수정 실패 : " + err.message, "error");
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
                        <Box sx={{ display: "flex", flexDirection: "column", pr: "10px", flex: 3 }}>
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
                                    sx={{ mb: 1 }}
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
                                maxWidth: 100,
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "flex-start",
                                flex: 1,
                            }}
                        >
                            {editable ? (
                                <Box sx={{ position: "relative" }}>
                                    {imageToShow ? (
                                        <>
                                            <CardMedia
                                                component="img"
                                                image={imageToShow}
                                                alt="preview"
                                                sx={{
                                                    borderRadius: 1,
                                                    cursor: "pointer",
                                                    objectFit: "contain",
                                                    width: "100%",
                                                }}
                                                onClick={() =>
                                                    document.getElementById(`fileInput-${review.id}`).click()
                                                }
                                            />
                                            <IconButton
                                                size="small"
                                                onClick={handleImageRemove} // ✅ 여기에 함수 적용
                                                sx={{
                                                    position: "absolute",
                                                    top: -10,
                                                    right: -10,
                                                    backgroundColor: "#fff",
                                                    border: "1px solid #ccc",
                                                    p: 0.5,
                                                    "&:hover": {
                                                        backgroundColor: "#f5f5f5",
                                                    },
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <Box
                                            onClick={() => document.getElementById(`fileInput-${review.id}`).click()}
                                            sx={{
                                                width: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                border: "1px dashed #ccc",
                                                borderRadius: 1,
                                                cursor: "pointer",
                                                color: "#888",
                                                fontSize: 14,
                                                height: 100,
                                            }}
                                        >
                                            이미지를 업로드하려면 클릭하세요
                                        </Box>
                                    )}
                                    <input
                                        ref={fileInputRef} // ✅ input ref
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
