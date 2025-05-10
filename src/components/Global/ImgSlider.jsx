import Slider from "react-slick";
import { Box } from "@mui/material";
import RightArrow from "../../assets/images/PetMeeting/right-arrow.svg";
import LeftArrow from "../../assets/images/PetMeeting/left-arrow.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../css/board/ImgSlider.css";

const PrevArrow = ({ onClick }) => (
    <Box
        component="img"
        src={LeftArrow}
        onClick={onClick}
        sx={{
            position: "absolute",
            top: "50%",
            left: 0,
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
);

const NextArrow = ({ onClick }) => (
    <Box
        component="img"
        src={RightArrow}
        onClick={onClick}
        sx={{
            position: "absolute",
            top: "50%",
            right: 0,
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
);

const ImgSlide = ({ photos, borderRadius }) => {
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: photos?.length > 1,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        dotsClass: "slick-dots custom-dots",
        dots: true,
    };

    return (
        <Box
            sx={{
                backgroundColor: "#FDF1E5",
                width: "100%",
                height: "250px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                borderRadius: borderRadius ? "20px" : undefined,
                mb: "10px",
                overflow: "hidden",
            }}
        >
            <Slider {...settings} style={{ width: "100%", height: "100%" }}>
                {photos?.map((path, idx) => (
                    <Box
                        key={idx}
                        sx={{
                            width: "100%",
                            height: "250px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                            textAlign: "center",
                        }}
                    >
                        <Box
                            component="img"
                            src={path}
                            alt={`slide-${idx}`}
                            sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                display: "block",
                                margin: "0 auto",
                            }}
                        />
                    </Box>
                ))}
            </Slider>
        </Box>
    );
};

export default ImgSlide;
