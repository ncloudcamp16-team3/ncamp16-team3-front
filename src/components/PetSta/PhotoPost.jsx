import React from "react";
import { Box } from "@mui/material";
import PostProfile from "./PostProfile.jsx";
import PostBottom from "./PostBottom.jsx"; // 좋아요, 댓글 아이콘

const PhotoPost = ({
    user_name,
    user_photo,
    file_name,
    likes,
    comments,
    content,
    created_at,
}) => {
    console.log({ user_name, user_photo });
    return (
        <Box sx={{ width: "100%", maxHeight: "100vh", marginBottom: 1 }}>
            <Box sx={{ position: "relative" }}>
                <PostProfile user_name={user_name} user_photo={user_photo} />
                <img
                    style={{ width: "100%" }}
                    src={`./mock/PetSta/images/${file_name}`}
                />
            </Box>

            <PostBottom
                user_name={user_name}
                content={content}
                created_at={created_at}
                comments={comments}
                likes={likes}
            />
        </Box>
    );
};

export default PhotoPost;
