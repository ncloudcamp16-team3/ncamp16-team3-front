import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Box, Typography, TextField, Button, Divider } from "@mui/material";
import FileUploader from "../utils/FileUploader.jsx";
import StarRatingConstructor from "../utils/StarRatingConstructor.jsx";

const ReviewInputFormView = () => {
    const { id } = useParams();
    const [facilityInfo, setFacilityInfo] = useState();
    const text = useRef();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [starRating, setStarRating] = useState();

    useEffect(() => {
        const found = reserveList.find((r) => r.id === parseInt(id));

        if (found) {
            setFacilityInfo(found);
        }
    }, [id]);

    const handleSubmit = () => {
        const comment = text.current.value;
        const rating = starRating;
        console.log(rating);
        console.log(comment);
        console.log(uploadedFiles);
    };

    return (
        <Container>
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
                <FileUploader />
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

export default ReviewInputFormView;
