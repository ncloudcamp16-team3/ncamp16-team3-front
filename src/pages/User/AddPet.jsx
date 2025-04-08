import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
    Button,
    IconButton,
    Stack,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import petEx from "/src/assets/images/User/pet_ex.svg";

const AddPet = () => {
    const navigate = useNavigate();

    const [petData, setPetData] = useState({
        name: "",
        type: "",
        birthDate: "",
        breed: "",
        gender: "",
        isNeutered: false,
        weight: "",
        bodyType: "",
        favorites: "",
        introduction: "",
    });

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [images, setImages] = useState([null, null, null, null, null, null]);
    const [imagePreviews, setImagePreviews] = useState([null, null, null, null, null, null]);
    const [isFavorite, setIsFavorite] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPetData({
            ...petData,
            [name]: value,
        });
    };

    const handleRadioChange = (e) => {
        setPetData({
            ...petData,
            gender: e.target.value,
        });
    };

    const handleNeuteredChange = (e) => {
        setPetData({
            ...petData,
            isNeutered: e.target.checked,
        });
    };

    const handleFavoriteToggle = () => {
        setIsFavorite(!isFavorite);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const newImages = [...images];
            newImages[currentImageIndex] = file;
            setImages(newImages);

            const reader = new FileReader();
            reader.onloadend = () => {
                const newPreviews = [...imagePreviews];
                newPreviews[currentImageIndex] = reader.result;
                setImagePreviews(newPreviews);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageNavigation = (index) => {
        setCurrentImageIndex(index);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("제출된 데이터:", petData);
        console.log(
            "업로드된 이미지:",
            images.filter((img) => img !== null)
        );
        console.log("즐겨찾기 여부:", isFavorite);

        navigate("/mypage");
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <Box sx={{ bgcolor: "white", minHeight: "100vh", pb: 8 }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    borderBottom: "1px solid #eee",
                }}
            >
                <IconButton onClick={handleGoBack} sx={{ mr: 1 }}>
                    <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    반려동물 정보추가
                </Typography>
            </Box>

            <Box
                sx={{
                    position: "relative",
                    mx: "auto",
                    my: 2,
                    width: "calc(100% - 32px)",
                    height: 240,
                    borderRadius: 4,
                    bgcolor: imagePreviews[currentImageIndex] ? "transparent" : "#FFC0CB",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {imagePreviews[currentImageIndex] ? (
                    <Box
                        component="img"
                        src={imagePreviews[currentImageIndex]}
                        alt="반려동물 사진"
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 4,
                        }}
                    />
                ) : (
                    <Box
                        component="img"
                        src={petEx}
                        alt="반려동물 사진"
                        sx={{
                            width: "auto",
                            height: "80%",
                            objectFit: "contain",
                        }}
                    />
                )}

                <IconButton
                    component="label"
                    sx={{
                        position: "absolute",
                        bottom: 16,
                        left: 16,
                        bgcolor: "#363636",
                        color: "white",
                        "&:hover": { bgcolor: "#000000" },
                    }}
                >
                    <AddIcon />
                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </IconButton>

                <IconButton
                    onClick={handleFavoriteToggle}
                    sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        color: isFavorite ? "#FFD700" : "white",
                    }}
                >
                    <StarIcon />
                </IconButton>

                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        position: "absolute",
                        bottom: 16,
                        right: 16,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    {imagePreviews.map((preview, index) => (
                        <Box
                            key={index}
                            onClick={() => handleImageNavigation(index)}
                            sx={{
                                width: index === currentImageIndex ? 24 : 8,
                                height: 8,
                                borderRadius: 4,
                                bgcolor: index === currentImageIndex ? "white" : "rgba(255, 255, 255, 0.5)",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                            }}
                        />
                    ))}
                </Stack>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ px: 2 }}>
                <Typography variant="h6" sx={{ my: 2, fontWeight: "bold" }}>
                    기본정보
                </Typography>

                <Typography variant="body2" sx={{ mb: 1 }}>
                    이름
                </Typography>
                <TextField
                    fullWidth
                    size="small"
                    name="name"
                    value={petData.name}
                    onChange={handleChange}
                    placeholder="반려동물 이름을 입력하세요"
                    sx={{ mb: 2 }}
                />

                <Typography variant="body2" sx={{ mb: 1 }}>
                    생일
                </Typography>
                <TextField
                    fullWidth
                    size="small"
                    type="date"
                    name="birthDate"
                    value={petData.birthDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                />

                <Typography variant="h6" sx={{ my: 2, fontWeight: "bold" }}>
                    상세정보
                </Typography>

                <Typography variant="body2" sx={{ mb: 1 }}>
                    품종
                </Typography>
                <TextField
                    fullWidth
                    size="small"
                    name="breed"
                    value={petData.breed}
                    onChange={handleChange}
                    placeholder="예) 사모예드"
                    sx={{ mb: 2 }}
                />

                <Typography variant="body2" sx={{ mb: 1 }}>
                    성별
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <RadioGroup row name="gender" value={petData.gender} onChange={handleRadioChange} sx={{ mr: 2 }}>
                        <FormControlLabel value="남아" control={<Radio />} label="남아" />
                        <FormControlLabel value="여아" control={<Radio />} label="여아" />
                    </RadioGroup>
                    <FormControlLabel
                        control={<Checkbox checked={petData.isNeutered} onChange={handleNeuteredChange} />}
                        label="중성화 여부"
                    />
                </Box>

                <Typography variant="body2" sx={{ mb: 1 }}>
                    몸무게
                </Typography>
                <TextField
                    fullWidth
                    size="small"
                    name="weight"
                    value={petData.weight}
                    onChange={handleChange}
                    placeholder="몸무게(kg)"
                    sx={{ mb: 2 }}
                />

                <Typography variant="body2" sx={{ mb: 1 }}>
                    체형
                </Typography>
                <TextField
                    fullWidth
                    size="small"
                    name="bodyType"
                    value={petData.bodyType}
                    onChange={handleChange}
                    placeholder="통통"
                    sx={{ mb: 2 }}
                />

                <Typography variant="body2" sx={{ mb: 1 }}>
                    좋아하는것
                </Typography>
                <TextField
                    fullWidth
                    size="small"
                    name="favorites"
                    value={petData.favorites}
                    onChange={handleChange}
                    placeholder="ex) 공놀이, 산책"
                    sx={{ mb: 2 }}
                />

                <Typography variant="body2" sx={{ mb: 1 }}>
                    소개
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name="introduction"
                    value={petData.introduction}
                    onChange={handleChange}
                    placeholder="10~50 글자 사이로 아이를 소개해주세요"
                    sx={{ mb: 3 }}
                />

                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    sx={{
                        py: 1.5,
                        bgcolor: "#E9A260",
                        color: "white",
                        fontWeight: "bold",
                        "&:hover": { bgcolor: "#d0905a" },
                        mb: 2,
                        borderRadius: "8px",
                    }}
                >
                    저장
                </Button>
            </Box>
        </Box>
    );
};

export default AddPet;
