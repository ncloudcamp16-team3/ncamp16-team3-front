import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Box, Typography, TextField, Button, Divider } from "@mui/material";
import TitleBar from "../../components/Global/TitleBar.jsx";
import FileUploader from "../../components/Reserve/utils/FileUploader.jsx";
import StarRatingConstructor from "../../components/Reserve/utils/StarRatingConstructor.jsx";
import { getFacilityNameAndThumbnail, putReview } from "../../services/reserveService.js";
import Loading from "../../components/Global/Loading.jsx";

const Review = () => {
    const { id } = useParams(); // useParams 훅 사용

    const [facilityInfo, setFacilityInfo] = useState();
    const text = useRef();
    const [image, setImage] = useState(null);
    const [starRating, setStarRating] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!id || id === undefined) {
                console.warn("시설 ID가 유효하지 않습니다.");
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const result = await getFacilityNameAndThumbnail(id);
                setFacilityInfo(result);
            } catch (err) {
                setError("시설 정보를 불러오는 중 오류 발생: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async () => {
        const comment = text.current.value;

        if (!starRating || !comment || !image) {
            alert("내용, 별점, 이미지를 모두 입력해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("comment", comment);
        formData.append("starPoint", starRating);
        formData.append("file", image);

        try {
            const response = await putReview(id, formData);
            navigate(`/reserve/${id}`);
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <Container>
                <Loading />
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography>{error}</Typography>
            </Container>
        );
    }

    return (
        <Container>
            <TitleBar name="리뷰 작성" />
            <Divider />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    mt: 2,
                }}
            >
                {/* 이미지 박스 추가 */}
                {facilityInfo?.thumbnail && (
                    <Box
                        component="img"
                        src={facilityInfo.thumbnail}
                        alt={facilityInfo.name || "시설 이미지"}
                        sx={{
                            width: "100%",
                            maxWidth: 400,
                            borderRadius: 2,
                            objectFit: "cover",
                        }}
                    />
                )}

                <Typography sx={{ fontWeight: "bold", fontSize: 24 }}>{facilityInfo?.name}</Typography>

                <StarRatingConstructor starRating={starRating} setStarRating={setStarRating} />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mt: 2 }}>
                <Typography sx={{ fontWeight: "bold", fontSize: 18 }}>이용 후기</Typography>
                <TextField
                    inputRef={text}
                    label="내용을 입력해주세요"
                    multiline
                    rows={6}
                    variant="outlined"
                    sx={{ borderRadius: 3 }}
                    fullWidth
                />
                <FileUploader onFileChange={(file) => setImage(file)} />
                <Button
                    variant="contained"
                    sx={{ bgcolor: "#E9A260", borderRadius: 3, mb: 1 }}
                    size="large"
                    onClick={handleSubmit}
                    fullWidth
                >
                    등 록
                </Button>
            </Box>
        </Container>
    );
};

export default Review;
