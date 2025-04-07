import { useContext } from "react";
import { Box, Typography } from "@mui/material";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";

const FriendType = () => {
    const { friendType, setFriendType } = useContext(PetMeetingContext);

    return (
        <Box
            sx={{
                display: "flex",
                gap: 0,
                margin: "20px 0",
                backgroundColor: "rgba(46, 45, 45, 0.1)",
                borderRadius: "8px",
            }}
        >
            <Box
                sx={{
                    padding: "7px 0",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: friendType === "산책친구들" ? "#E9A260" : "transparent",
                    color: friendType === "산책친구들" ? "white" : "black",
                    transition: "0.3s",
                    width: "50%",
                    textAlign: "center",
                    margin: "3px 0 3px 3px",
                }}
                onClick={() => setFriendType("산책친구들")}
            >
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    산책 친구들
                </Typography>
            </Box>

            <Box
                sx={{
                    padding: "7px 0",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: friendType === "놀이친구들" ? "#E9A260" : "transparent",
                    color: friendType === "놀이친구들" ? "white" : "black",
                    transition: "0.3s",
                    width: "50%",
                    textAlign: "center",
                    margin: "3px 3px 3px 0px",
                }}
                onClick={() => setFriendType("놀이친구들")}
            >
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    놀이 친구들
                </Typography>
            </Box>
        </Box>
    );
};

export default FriendType;
