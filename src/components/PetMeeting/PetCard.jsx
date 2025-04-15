import React, { useContext } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";

const PetCard = ({ friend }) => {
    const { pet } = useContext(PetMeetingContext);
    const thumbnailPhoto = friend?.photos.find((photo) => photo.id === friend.thumbnail);
    const navigate = useNavigate();

    const goDetails = () => {
        sessionStorage.setItem("pet", JSON.stringify(pet));
        navigate(`/pet/${friend.id}`);
    };

    return (
        <Box
            sx={{
                borderRadius: "20px",
                width: "100%",
                height: "100%",
                cursor: "pointer",
                mb: 4,
                boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.15)",
                display: "flex",
                alignItems: "center",
                p: 3,
                backgroundColor: "#F2DFCE",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "4px 8px 15px rgba(0, 0, 0, 0.2)",
                },
            }}
            onClick={goDetails}
        >
            <Box
                component="img"
                src={thumbnailPhoto.url}
                sx={{
                    borderRadius: "50%",
                    width: "50%",
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                    boxShadow: "3px 5px 15px rgba(0, 0, 0, 0.3)",
                    border: "4px solid white",
                    mr: 3,
                }}
            />
            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    minWidth: 0,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        mb: 1,
                        fontWeight: "bold",
                        color: "#3e3e3e",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                    }}
                >
                    🐾 {friend.name}
                </Typography>

                <Typography
                    sx={{
                        mb: 1,
                        color: "#555",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                    }}
                >
                    성별: {friend.gender === "MALE" ? "남아" : "여아"}
                </Typography>
                <Typography
                    sx={{
                        mb: 1,
                        color: "#555",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                    }}
                >
                    무게: {friend.weight}kg
                </Typography>
                <Typography
                    sx={{
                        color: "#555",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                    }}
                >
                    주소: {friend.owner.dongName}
                </Typography>
            </Box>
        </Box>
    );
};

export default PetCard;
