import Slider from "react-slick";
import { Box } from "@mui/material";
import RightArrow from "../../assets/images/PetMeeting/right-arrow.svg";
import LeftArrow from "../../assets/images/PetMeeting/left-arrow.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

const ImgSlide = ({ photos }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: photos?.length > 1,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        appendDots: (dots) => (
            <Box
                sx={{
                    position: "absolute",
                    bottom: "10px",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    zIndex: 10,
                }}
            >
                <ul style={{ margin: 0, padding: 0, display: "flex" }}>
                    {dots.map((dot, index) => (
                        <li
                            key={index}
                            style={{
                                margin: "0",
                            }}
                        >
                            {dot}
                        </li>
                    ))}
                </ul>
            </Box>
        ),
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
                overflow: "hidden",
                position: "relative",
                borderRadius: "20px",
                mb: "10px",
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
