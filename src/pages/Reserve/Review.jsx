import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Box, Typography, TextField, Button, Divider } from "@mui/material";
import TitleBar from "../../components/Global/TitleBar.jsx";
import FileUploader from "../../components/Reserve/utils/FileUploader.jsx";
import StarRatingConstructor from "../../components/Reserve/utils/StarRatingConstructor.jsx";
import { getFacilityNameAndThumbnail, putReview } from "../../services/reserveService.js";
import Loading from "../../components/Global/Loading.jsx";

const Review = () => {
    const { id } = useParams();
    const [facilityInfo, setFacilityInfo] = useState();
    const text = useRef();
    const [image, setImage] = useState(null);
    const [starRating, setStarRating] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getFacilityNameAndThumbnail(id);
                setFacilityInfo(result.data);
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
        formData.append("rating", starRating);
        formData.append("file", image); // 단일 파일

        try {
            const response = await putReview({ id, formData });

            if (!response.ok) {
                throw new Error("리뷰 업로드 실패");
            }

            alert("리뷰가 성공적으로 등록되었습니다.");
            // 필요 시, 리뷰 상세 페이지로 이동
            navigate(`/reserve/facility/detail/${id}`);
        } catch (error) {
            console.error(error);
            alert("오류가 발생했습니다.");
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
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mt: 2 }}>
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
