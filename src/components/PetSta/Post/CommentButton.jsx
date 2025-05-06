import React from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PetStaComment from "../../../assets/images/Global/comment.svg";

const CommentButton = ({ postId, commentCount }) => {
    const navigate = useNavigate();
    return (
        <Box
            sx={{ padding: 1, display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => navigate(`/petsta/post/comment/${postId}`)}
        >
            <img src={PetStaComment} alt="Comment Icon" />
            <Box sx={{ marginLeft: 1 }}>{commentCount}</Box>
        </Box>
    );
};

export default CommentButton;
