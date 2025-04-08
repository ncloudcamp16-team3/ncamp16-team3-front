import React from "react";
import { Box, Typography } from "@mui/material";

const PetCard = ({ friend }) => {
    const thumbnailPhoto = friend?.photos.find((photo) => photo.id === friend.thumbnail);

    return (
        <Box
            sx={{
                borderRadius: "20px",
                width: "100%",
                height: "260px",
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
            onClick={() => {}}
        >
            <Box
                component="img"
                src={thumbnailPhoto.url}
                alt={friend?.name}
                sx={{
                    borderRadius: "50%",
                    width: "200px",
                    height: "200px",
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
                }}
            >
                <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold", color: "#3e3e3e" }}>
                    🐾 이름: {friend.name}
                </Typography>
                <Typography sx={{ mb: 1, color: "#555" }}>
                    성별: {friend.gender === "MALE" ? "남아" : "여아"}
                </Typography>
                <Typography sx={{ mb: 1, color: "#555" }}>몸무게: {friend.weight}kg</Typography>
                <Typography sx={{ color: "#555" }}>동네: {friend.owner.dong_name}</Typography>
            </Box>
        </Box>
    );
};

export default PetCard;
