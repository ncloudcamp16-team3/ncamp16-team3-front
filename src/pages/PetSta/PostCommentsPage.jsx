import React from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import comments from "../../mock/PetSta/comments.json";
import PostCommentItem from "../../components/PetSta/PostCommentItem.jsx";

const PostCommentPage = () => {
    const { post_id } = useParams();

    // post_id에 해당하는 댓글 중 parent_id가 null인 것만 필터링
    const filteredComments = comments.filter(
        (comment) => comment.post_id === Number(post_id) && comment.parent_id === null
    );

    return (
        <Box height="80vh" margin={1} padding={2} border="1px solid #C8C8C8" borderRadius="10px">
            <Box textAlign="center" fontWeight="bold" fontSize="18px" paddingBottom={2}>
                댓글
            </Box>
            {filteredComments.length > 0 ? (
                filteredComments.map((comment) => <PostCommentItem key={comment.id} comment={comment} />)
            ) : (
                <Box textAlign="center" fontSize="16px" color="gray">
                    댓글이 없습니다.
                </Box>
            )}
        </Box>
    );
};

export default PostCommentPage;
