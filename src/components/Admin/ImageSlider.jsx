import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ImageSlider = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // 이미지가 없거나 변경될 때 인덱스 리셋
    useEffect(() => {
        setCurrentIndex(0);
    }, [images]);

    // 이전 이미지로 이동
    const goToPrevious = () => {
        const isFirstImage = currentIndex === 0;
        const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    // 다음 이미지로 이동
    const goToNext = () => {
        const isLastImage = currentIndex === images.length - 1;
        const newIndex = isLastImage ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    // 이미지가 없는 경우
    if (!images || images.length === 0) {
        return (
            <Box
                sx={{
                    width: 300,
                    height: 300,
                    borderRadius: "20px",
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Typography>이미지 없음</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ position: "relative", width: 300, height: 300 }}>
            {/* 좌우 화살표 버튼 */}
            {images.length > 1 && (
                <>
                    <IconButton
                        onClick={goToPrevious}
                        sx={{
                            position: "absolute",
                            left: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                            zIndex: 1,
                            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.8)" },
                        }}
                    >
                        <ArrowBackIosNewIcon />
                    </IconButton>

                    <IconButton
                        onClick={goToNext}
                        sx={{
                            position: "absolute",
                            right: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                            zIndex: 1,
                            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.8)" },
                        }}
                    >
                        <ArrowForwardIosIcon />
                    </IconButton>
                </>
            )}

            {/* 이미지 컨테이너 */}
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "20px",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                {/* 현재 선택된 이미지 */}
                <img
                    src={images[currentIndex]}
                    alt={`시설 이미지 ${currentIndex + 1}`}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                    }}
                />

                {/* 이미지 인디케이터 (하단 점) */}
                {images.length > 1 && (
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 10,
                            left: "50%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            gap: 1,
                        }}
                    >
                        {images.map((_, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    backgroundColor: index === currentIndex ? "#E9A260" : "rgba(255, 255, 255, 0.5)",
                                    cursor: "pointer",
                                }}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default ImageSlider;
