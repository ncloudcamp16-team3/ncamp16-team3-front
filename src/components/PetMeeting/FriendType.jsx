import { useState } from "react";
import { Box, Typography } from "@mui/material";

const FriendType = () => {
    const [selected, setSelected] = useState("option1"); // 초기 선택 값

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
                    backgroundColor: selected === "option1" ? "#E9A260" : "transparent",
                    color: selected === "option1" ? "white" : "black",
                    transition: "0.3s",
                    width: "50%",
                    textAlign: "center",
                    margin: "3px 0 3px 3px",
                }}
                onClick={() => setSelected("option1")}
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
                    backgroundColor: selected === "option2" ? "#E9A260" : "transparent",
                    color: selected === "option2" ? "white" : "black",
                    transition: "0.3s",
                    width: "50%",
                    textAlign: "center",
                    margin: "3px 3px 3px 0px",
                }}
                onClick={() => setSelected("option2")}
            >
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    놀이 친구들
                </Typography>
            </Box>
        </Box>
    );
};

export default FriendType;
