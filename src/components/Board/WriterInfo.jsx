import React from "react";
import { Box, Typography } from "@mui/material";

const WriterInfo = ({ postData }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                m: "15px 0 10px 0",
            }}
        >
            <Box
                component="img"
                src={postData.authorProfileImg}
                sx={{
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    mr: "10px",
                }}
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "18px",
                    }}
                >
                    {postData.authorNickname}
                </Typography>
                <Typography
                    sx={{
                        fontSize: "14px",
                        color: "rgba(0, 0, 0, 0.4)",
                    }}
                >
                    {postData.authorAddress}
                </Typography>
            </Box>
        </Box>
    );
};

export default WriterInfo;
