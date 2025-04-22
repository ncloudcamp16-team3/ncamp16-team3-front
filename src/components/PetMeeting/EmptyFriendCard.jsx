import React, { useContext } from "react";
import { Box, Typography } from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";

const EmptyFriendCard = () => {
    const { friendType } = useContext(PetMeetingContext);
    return (
        <Box
            sx={{
                borderRadius: "16px",
                border: "2px dashed rgba(0, 0, 0, 0.2)",
                width: "100%",
                height: "230px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fefefe",
                position: "relative",
                cursor: "default",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
        >
            <SentimentDissatisfiedIcon sx={{ fontSize: 48, color: "#aaa", mb: 1 }} />
            <Typography variant="h6" sx={{ color: "#666", fontWeight: 500 }}>
                동네친구가 없어요
            </Typography>
            <Typography variant="body2" sx={{ color: "#999", mt: 0.5 }}>
                {friendType === "산책친구들" ? "산책" : "놀이"} 중인 친구가 아직 없어요
            </Typography>
        </Box>
    );
};

export default EmptyFriendCard;
