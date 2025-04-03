import React from "react";
import { Box, IconButton } from "@mui/material";
import PhotoPost from "./PhotoPost.jsx";
import LeftArrow from "../../assets/images/Global/left-arrow-black.svg";
import { useNavigate } from "react-router-dom";

const PhotoDetail = ({ post }) => {
    const navigate = useNavigate();

    return (
        <Box height="92vh" backgroundColor="white" display="flex" flexDirection="column">
            <Box top={0} left={0} display="flex" alignItems="center" padding="10px 15px" fontSize="18px" gap={1}>
                <IconButton onClick={() => navigate(-1)}>
                    <img src={LeftArrow} />
                </IconButton>
                게시물
            </Box>
            <PhotoPost
                user_id={post.user_id}
                content={post.content}
                created_at={post.created_at}
                file_name={post.file_name}
                comments={post.comments}
                post_id={post.post_id}
                user_name={post.user_name}
                user_photo={post.user_photo}
                likes={post.likes}
            />
        </Box>
    );
};

export default PhotoDetail;
