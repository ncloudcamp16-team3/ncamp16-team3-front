import React from "react";
import { Box } from "@mui/material";
import PostProfile from "./PostProfile.jsx";
import PostBottom from "./PostBottom.jsx";
import { useNavigate } from "react-router-dom";

const PhotoPost = ({ post_id, user_id, user_name, user_photo, file_name, likes, comments, content, created_at }) => {
    const navigate = useNavigate();
    const handlePostClick = () => {
        navigate(`/petsta/post/${post_id}`);
    };

    return (
        <Box sx={{ width: "100%", maxHeight: "100vh", marginBottom: 1 }}>
            <Box sx={{ position: "relative" }}>
                <PostProfile user_id={user_id} user_name={user_name} user_photo={user_photo} />
                <Box onClick={handlePostClick}>
                    <img style={{ width: "100%" }} src={`/mock/PetSta/images/${file_name}`} />
                </Box>
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
