import React, { useRef } from "react";
import PetDetails from "../../mock/PetMeeting/petDetails.json";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import LeftArrow from "../../assets/images/PetMeeting/left-arrow.svg";
import RightArrow from "../../assets/images/PetMeeting/right-arrow.svg";

import { Box } from "@mui/material";

const Petdetails = () => {
    const petDetails = useRef(PetDetails);
    const friendInfo = petDetails.current;
    const thumbnailPhoto = friendInfo.photos.find((photo) => photo.id === friendInfo.thumbnail);

    // 섬네일 가장 앞에 배치하도록 정렬
    const sortedPhotos = [thumbnailPhoto, ...friendInfo.photos.filter((photo) => photo.id !== friendInfo.thumbnail)];

    return (
        <Box
            sx={{
                backgroundColor: "#ddd",
                width: "100%",
                height: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
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
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "10px",
                    zIndex: 10,
                    transform: "translateY(-50%)",
                    color: "#fff",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    padding: "6px 10px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    userSelect: "none",
                }}
            >
                {LeftArrow}
            </Box>
            <Box
                className="swiper-button-next-custom"
                sx={{
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    zIndex: 10,
                    transform: "translateY(-50%)",
                    color: "#fff",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    padding: "6px 10px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    userSelect: "none",
                }}
            >
                {RightArrow}
            </Box>
        </Box>
    );
};

export default Petdetails;
