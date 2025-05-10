import React, { useContext, useState } from "react";
import { Grid, Card, CardContent, Avatar, Typography, TextField, Button, Box, Stack, CardMedia } from "@mui/material";
import ReviewDropdown from "./ReviewDropDown"; // 드롭다운 버튼 컴포넌트
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
}) => {
    const isMyReview = user?.id === review.userId;
    const [editable, setEditable] = useState(false);
    const [comment, setComment] = useState(review.comment);
    const [starPoint, setStarPoint] = useState(review.starPoint);
    const [image, setImage] = useState(review.reviewImages?.[0] || null);
    const [imageFile, setImageFile] = useState(null);

    // 모달 관련
    const { showModal } = useContext(Context);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImage(URL.createObjectURL(file));
        }
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
            console.log(data);

            setFacilityData(data.facility);
            setReviews(data.reviews || []);
            setChartData(transformScoreToChartData(data.ratingRatio));
            setEditable(false);
            showModal("", "리뷰가 수정되었습니다.");
        } catch (err) {
            showModal("", "리뷰 수정 실패: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCancel = () => {
        setComment(review.comment);
        setStarPoint(review.starPoint);
        setImage(review.reviewImages?.[0] || null);
        setEditable(false);
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
                                onDelete={() => handleReviewDelete(review)}
                            />
                        )}
                    </Stack>
                    {editable ? (
                        <Box sx={{ position: "relative", mb: 2 }}>
                            {image ? (
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={image}
                                    alt="review"
                                    sx={{ borderRadius: 1, cursor: "pointer", boxShadow: 3 }}
                                    onClick={() => document.getElementById(`fileInput-${review.id}`).click()}
                                />
                            ) : (
                                <Box
                                    onClick={() => document.getElementById(`fileInput-${review.id}`).click()}
                                    sx={{
                                        height: 180,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: "1px dashed #ccc",
                                        borderRadius: 1,
                                        cursor: "pointer",
                                        color: "#888",
                                        fontSize: 14,
                                        boxShadow: 1,
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
                        image && (
                            <CardMedia
                                component="img"
                                height="180"
                                image={image}
                                alt="review"
                                sx={{ borderRadius: 1, mb: 2, boxShadow: 1, objectFit: "contain" }}
                            />
                        )
                    )}

                    <TextField
                        fullWidth
                        multiline
                        minRows={1}
                        maxRows={5} // 최대 5줄까지 확장
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        disabled={!editable}
                        variant="outlined"
                        sx={{
                            mt: 0.25, // 상단 마진 (기존 대비 절반)
                            mb: 0.25, // 하단 마진
                            fontSize: "large",
                            "& .MuiOutlinedInput-root": {
                                bgcolor: "transparent",
                                "& .MuiOutlinedInput-notchedOutline": {
                                    border: "none",
                                },
                                borderBottom: editable ? "1px solid #ccc" : "none",
                                "&.Mui-disabled": {
                                    "& input, & textarea": {
                                        color: "#000", // 비활성화 상태일 때도 검정색
                                        WebkitTextFillColor: "#000", // iOS 사파리에서 회색 텍스트 제거
                                    },
                                },
                            },
                            "& .MuiInputBase-inputMultiline": {
                                padding: "4px 0", // 줄 간격 조절
                            },
                        }}
                    />

                    <StarRatingConstructor
                        starRating={starPoint}
                        setStarRating={setStarPoint}
                        defaultValue={review.starPoint}
                        editable={editable}
                    />

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 2, pt: 3 }}>
                            {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                        {editable && (
                            <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                                <Button size="small" variant="contained" onClick={handleUpdateCancel}>
                                    취소
                                </Button>
                                <Button size="small" variant="contained" onClick={handleUpdateSubmit}>
                                    저장
                                </Button>
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default ReviewCardItem;
