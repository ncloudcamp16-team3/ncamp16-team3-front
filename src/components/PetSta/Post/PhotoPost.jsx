import React from "react";
import { Box } from "@mui/material";
import PostProfile from "./PostProfile.jsx";
import PostBottom from "./PostBottom.jsx";
import { useNavigate } from "react-router-dom";

const PhotoPost = ({
    postId,
    userId,
    userName,
    userPhoto,
    fileName,
    likes,
    comments,
    content,
    createdAt,
    initialLiked,
    initialBookmarked,
    isVisited,
}) => {
    const navigate = useNavigate();
    const handlePostClick = () => {
        navigate(`/petsta/post/${postId}`);
    };

    return (
        <Box sx={{ width: "100%", maxHeight: "100vh", marginBottom: 1 }}>
            <Box sx={{ position: "relative" }}>
                <PostProfile userId={userId} userName={userName} userPhoto={userPhoto} isVisited={isVisited} />
                <Box onClick={handlePostClick}>
                    <img style={{ width: "100%" }} src={`${fileName}`} />
                </Box>
            </Box>

            <PostBottom
                initialLiked={initialLiked}
                initialBookmarked={initialBookmarked}
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
