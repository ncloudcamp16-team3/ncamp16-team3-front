import React from "react";
import { Box, Typography } from "@mui/material";
import useTimeAgo from "../../hook/useTimeAgo.js";

const Comment = ({ commentItem }) => {
    const timeAgo = useTimeAgo(commentItem.createdAt);
    return (
        <Box
            sx={{
                py: "5px",
                px: "10px",
                borderBottom: "1px solid rgba(0, 0, 0, 0.5)",
                display: "flex",
                flexDirection: "column",
                mb: "10px",
            }}
        >
            <Box sx={{ display: "flex" }}>
                <Box
                    component="img"
                    src={commentItem.user.photo.url}
                    sx={{
                        borderRadius: "50%",
                        width: "50px",
                        height: "50px",
                    }}
                />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        fontSize: "10px",
                        ml: "10px",
                    }}
                >
                    <Typography>{commentItem.user.nickname}</Typography>
                    <Typography
                        sx={{
                            fontSize: "14px",
                            color: "rgba(0, 0, 0, 0.5)",
                        }}
                    >
                        {timeAgo}
                    </Typography>
                </Box>
            </Box>
            <Typography sx={{ my: "5px" }}>{commentItem.content}</Typography>
        </Box>
    );
};

export default Comment;
