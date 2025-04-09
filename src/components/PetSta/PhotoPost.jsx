import React from "react";
import { Box } from "@mui/material";
import PostProfile from "./PostProfile.jsx";
import PostBottom from "./PostBottom.jsx";
import { useNavigate } from "react-router-dom";

const PhotoPost = ({ postId, userId, userName, userPhoto, fileName, likes, comments, content, createdAt }) => {
    const navigate = useNavigate();
    const handlePostClick = () => {
        navigate(`/petsta/post/${postId}`);
    };

    return (
        <Box sx={{ width: "100%", maxHeight: "100vh", marginBottom: 1 }}>
            <Box sx={{ position: "relative" }}>
                <PostProfile userId={userId} userName={userName} userPhoto={userPhoto} />
                <Box onClick={handlePostClick}>
                    <img style={{ width: "100%" }} src={`/mock/PetSta/images/${fileName}`} />
                </Box>
            </Box>

            <PostBottom
                postId={postId}
                userName={userName}
                content={content}
                createdAt={createdAt}
                comments={comments}
                likes={likes}
            />
        </Box>
    );
};

export default PhotoPost;
