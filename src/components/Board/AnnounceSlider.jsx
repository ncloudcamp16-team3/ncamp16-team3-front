import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import AnnounceData from "../../mock/Board/announceList.json";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AnnounceSlider = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: "10px",
                px: "10px",
                py: "3px",
                flex: 1,
                ml: "10px",
                height: "30px",
                overflow: "hidden",
            }}
        >
            <Swiper
                direction="vertical"
                loop={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                speed={1000}
                modules={[Autoplay]}
                style={{ height: "100%", width: "100%" }}
            >
                {AnnounceData.map((item) => (
                    <SwiperSlide key={item.id} onClick={() => navigate(`/announce/${item.id}`)}>
                        <Typography
                            sx={{
                                whiteSpace: "nowrap",
                                cursor: "pointer",
                            }}
                        >
                            {item.title}
                        </Typography>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
};

export default AnnounceSlider;
