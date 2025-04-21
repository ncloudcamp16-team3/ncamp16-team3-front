import React, { useState } from "react";
import { Box, Typography, TextField, Button, IconButton, Stack, Divider, Chip } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TitleBar from "../../components/Global/TitleBar.jsx";
import { useNavigate } from "react-router-dom";
import petEx from "/src/assets/images/User/pet_ex.svg";
import axios from "axios";

const AddPet = () => {
  const navigate = useNavigate();

  const [petData, setPetData] = useState({
    name: "",
    type: "",
    birthDate: "",
    gender: "",
    isNeutered: false,
    weight: "",
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

  const handlePrevImage = () => {
    // 이전 이미지로 이동 (순환)
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? imagePreviews.length - 1 : prevIndex - 1));
  };

  const handleNextImage = () => {
    // 다음 이미지로 이동 (순환)
    setCurrentImageIndex((prevIndex) => (prevIndex === imagePreviews.length - 1 ? 0 : prevIndex + 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 필수 입력값 검증
    if (
      !petData.name ||
      !petData.birthDate ||
      !petData.type ||
      !petData.gender ||
      petData.weight === "" ||
      !petData.introduction
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    // FormData 객체 생성
    const formData = new FormData();

    // 반려동물 데이터 JSON 변환 및 추가
    const petDataJson = JSON.stringify({
      name: petData.name,
      type: petData.type,
      birthDate: petData.birthDate,
      gender: petData.gender,
      isNeutered: petData.isNeutered,
      weight: parseFloat(petData.weight),
      introduction: petData.introduction,
      isFavorite: isFavorite,
    });
    formData.append("petData", new Blob([petDataJson], { type: "application/json" }));

    // 이미지 추가
    const validImages = images.filter((img) => img !== null);
    validImages.forEach((image, index) => {
      formData.append("images", image);
    });

    try {
      // API 호출
      const response = await axios.post("/api/pet/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      // 성공 시 처리
      alert("반려동물 등록이 완료되었습니다.");
      navigate("/mypage");
    } catch (error) {
      console.error("반려동물 등록 오류:", error);
      alert(error.response?.data?.message || "반려동물 등록 중 오류가 발생했습니다.");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const petTypes = ["강아지", "고양이", "햄스터", "앵무새", "물고기", "기타"];

  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh", pb: 8 }}>
      <TitleBar name="반려동물 정보추가" onBack={handleGoBack} />

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

        {/* 좌측 화살표 - 하얀색만 표시 */}
        <IconButton
          onClick={handlePrevImage}
          sx={{
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            color: "white",
            bgcolor: "transparent",
            "&:hover": { bgcolor: "transparent" },
            zIndex: 2,
          }}
        >
          <ArrowBackIosNewIcon fontSize="medium" />
        </IconButton>

        {/* 우측 화살표 - 하얀색만 표시 */}
        <IconButton
          onClick={handleNextImage}
          sx={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            color: "white",
            bgcolor: "transparent",
            "&:hover": { bgcolor: "transparent" },
            zIndex: 2,
          }}
        >
          <ArrowForwardIosIcon fontSize="medium" />
        </IconButton>

        <IconButton
          component="label"
          sx={{
            position: "absolute",
            bottom: 16,
            left: 16,
            bgcolor: "#363636",
            color: "white",
            "&:hover": { bgcolor: "#000000" },
            zIndex: 2,
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
            zIndex: 2,
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
            zIndex: 2,
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
          이름 <span style={{ color: "red" }}>*</span>
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
          생일 <span style={{ color: "red" }}>*</span>
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

        <Divider sx={{ my: 3, borderColor: "#f0f0f0", borderWidth: 2 }} />

        <Typography variant="h6" sx={{ my: 2, fontWeight: "bold" }}>
          상세정보
        </Typography>

        <Typography variant="body2" sx={{ mb: 1 }}>
          반려동물을 등록해주세요 <span style={{ color: "red" }}>*</span>
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "nowrap", overflowX: "auto", mb: 3, gap: 1 }}>
          {petTypes.map((type) => (
            <Chip
              key={type}
              label={type}
              onClick={() => setPetData({ ...petData, type })}
              color={petData.type === type ? "primary" : "default"}
              variant={petData.type === type ? "filled" : "outlined"}
              sx={{
                borderColor: "#d3d3d3",
                bgcolor: petData.type === type ? "#E9A260" : "transparent",
                color: petData.type === type ? "white" : "black",
                "&:hover": {
                  bgcolor: petData.type === type ? "#d0905a" : "rgba(0,0,0,0.04)",
                },
                minWidth: "70px",
                flexShrink: 0,
              }}
            />
          ))}
        </Box>

        <Typography variant="body2" sx={{ mb: 1 }}>
          아이의 성별을 선택해주세요 <span style={{ color: "red" }}>*</span>
        </Typography>
        <Box sx={{ display: "flex", width: "100%", mb: 2, gap: 1 }}>
          <Button
            variant={petData.gender === "남아" ? "contained" : "outlined"}
            onClick={() => setPetData({ ...petData, gender: "남아" })}
            sx={{
              flex: 1,
              borderColor: "#d3d3d3",
              color: petData.gender === "남아" ? "white" : "black",
              bgcolor: petData.gender === "남아" ? "#E9A260" : "transparent",
              "&:hover": {
                bgcolor: petData.gender === "남아" ? "#d0905a" : "rgba(0,0,0,0.04)",
                borderColor: "#ccc",
              },
              textTransform: "none",
              py: 1,
              borderRadius: 2,
            }}
          >
            남아
          </Button>
          <Button
            variant={petData.gender === "여아" ? "contained" : "outlined"}
            onClick={() => setPetData({ ...petData, gender: "여아" })}
            sx={{
              flex: 1,
              borderColor: "#d3d3d3",
              color: petData.gender === "여아" ? "white" : "black",
              bgcolor: petData.gender === "여아" ? "#E9A260" : "transparent",
              "&:hover": {
                bgcolor: petData.gender === "여아" ? "#d0905a" : "rgba(0,0,0,0.04)",
                borderColor: "#ccc",
              },
              textTransform: "none",
              py: 1,
              borderRadius: 2,
            }}
          >
            여아
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mb: 1 }}>
          중성화 여부 <span style={{ color: "red" }}>*</span>
        </Typography>
        <Box sx={{ display: "flex", width: "100%", mb: 2, gap: 1 }}>
          <Button
            variant={petData.isNeutered ? "contained" : "outlined"}
            onClick={() => setPetData({ ...petData, isNeutered: true })}
            sx={{
              flex: 1,
              borderColor: "#d3d3d3",
              color: petData.isNeutered ? "white" : "black",
              bgcolor: petData.isNeutered ? "#E9A260" : "transparent",
              "&:hover": {
                bgcolor: petData.isNeutered ? "#d0905a" : "rgba(0,0,0,0.04)",
                borderColor: "#ccc",
              },
              textTransform: "none",
              py: 1,
              borderRadius: 2,
            }}
          >
            O
          </Button>
          <Button
            variant={!petData.isNeutered ? "contained" : "outlined"}
            onClick={() => setPetData({ ...petData, isNeutered: false })}
            sx={{
              flex: 1,
              borderColor: "#d3d3d3",
              color: !petData.isNeutered ? "white" : "black",
              bgcolor: !petData.isNeutered ? "#E9A260" : "transparent",
              "&:hover": {
                bgcolor: !petData.isNeutered ? "#d0905a" : "rgba(0,0,0,0.04)",
                borderColor: "#ccc",
              },
              textTransform: "none",
              py: 1,
              borderRadius: 2,
            }}
          >
            X
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mb: 1 }}>
          몸무게 <span style={{ color: "red" }}>*</span>
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
          소개 <span style={{ color: "red" }}>*</span>
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
