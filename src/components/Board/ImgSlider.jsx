import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Box } from "@mui/material";
import RightArrow from "../../assets/images/PetMeeting/right-arrow.svg";
import LeftArrow from "../../assets/images/PetMeeting/left-arrow.svg";

const ImgSlide = ({ photos }) => {
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
                onSwiper={(swiper) => {
                    setTimeout(() => {
                        swiper.update();
                        if (swiper.navigation) {
                            swiper.navigation.update();
                        }
                    }, 100); // 또는 requestAnimationFrame
                }}
                modules={[Pagination, Navigation]}
                spaceBetween={20}
                slidesPerView={1}
                pagination={{ clickable: true }}
                navigation={{ nextEl: ".swiper-button-next-custom", prevEl: ".swiper-button-prev-custom" }}
                loop={true}
                style={{ height: "100%" }}
            >
                {photos?.map((path, idx) => (
                    <SwiperSlide key={idx}>
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                overflow: "hidden",
                            }}
                        >
                            <img
                                src={path}
                                alt={`slide-${idx}`}
                                style={{
                                    width: "auto",
                                    height: "100%",
                                    maxWidth: "100%",
                                    objectFit: "contain",
                                }}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            {photos?.length > 1 && (
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
                        "&:hover": {
                            transform: "translateY(-50%) scale(1.15)",
                            filter: "brightness(1.2)",
                        },
                    }}
                />
            )}
            {photos?.length > 1 && (
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
                        "&:hover": {
                            transform: "translateY(-50%) scale(1.15)",
                            filter: "brightness(1.2)",
                        },
                    }}
                />
            )}
        </Box>
    );
};

export default ImgSlide;
