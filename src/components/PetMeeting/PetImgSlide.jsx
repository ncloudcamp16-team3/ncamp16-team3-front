import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Box } from "@mui/material";
import RightArrow from "../../assets/images/PetMeeting/right-arrow.svg";
import LeftArrow from "../../assets/images/PetMeeting/left-arrow.svg";

const PetImgSlide = ({ petDetails }) => {
    const thumbnailPhoto = petDetails.photos.find((photo) => photo.id === petDetails.thumbnail);

    // 섬네일 가장 앞에 배치하도록 정렬
    const sortedPhotos = [thumbnailPhoto, ...petDetails.photos.filter((photo) => photo.id !== petDetails.thumbnail)];

    return (
        <Box
            sx={{
                backgroundColor: "#FDF1E5",
                width: "100%",
                height: "250px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                position: "relative",
                borderRadius: "20px",
                mb: "10px",
            }}
        >
            <Swiper
                modules={[Pagination, Navigation]}
                spaceBetween={20}
                slidesPerView={1}
                pagination={{ clickable: true }}
                navigation={{ nextEl: ".swiper-button-next-custom", prevEl: ".swiper-button-prev-custom" }}
                loop={true}
                style={{ height: "100%" }}
            >
                {sortedPhotos.map((src, idx) => (
                    <SwiperSlide key={idx}>
                        <img
                            src={src.url}
                            alt={`slide-${idx}`}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                display: "block",
                            }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
            <Box
                className="swiper-button-prev-custom"
                component="img"
                src={LeftArrow}
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "0",
                    zIndex: 10,
                    transform: "translateY(-50%)",
                    borderRadius: "50%",
                    cursor: "pointer",
                    userSelect: "none",
                    width: "40px",
                    height: "40px",
                }}
            />
            <Box
                className="swiper-button-next-custom"
                component="img"
                src={RightArrow}
                sx={{
                    position: "absolute",
                    top: "50%",
                    right: "0",
                    zIndex: 10,
                    transform: "translateY(-50%)",
                    borderRadius: "50%",
                    cursor: "pointer",
                    userSelect: "none",
                    width: "40px",
                    height: "40px",
                }}
            />
        </Box>
    );
};

export default PetImgSlide;
