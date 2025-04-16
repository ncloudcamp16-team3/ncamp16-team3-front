import React from "react";
import LikeBtn from "./LikeBtn.jsx";
import { Box, Button, InputBase } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const WriteComment = ({ liked, setLiked, setPostData, comment, setComment, postId }) => {
    const theme = useTheme();
    const requestCommentCreate = () => {
        alert(postId + "게시물에 " + comment + " 댓글 작성 요청");
        window.location.reload();
    };
    return (
        <Box
            sx={{
                position: "fixed",
                bottom: "85px",
                left: "10px",
                right: "10px",
                height: "50px",
                maxWidth: "480px",
                backgroundColor: theme.brand2,
                borderRadius: "10px",
                color: "white",
                zIndex: 1000,
                margin: "0 auto",
                alignItems: "center",
                display: "flex",
                p: "2px",
            }}
        >
            <LikeBtn liked={liked} setLiked={setLiked} setPostData={setPostData} />
            <InputBase
                placeholder="댓글을 작성해주세요"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    flex: 1,
                    height: "calc(100% - 10px)",
                    mr: "50px",
                    pl: "10px",
                }}
            />
            <Button
                onClick={requestCommentCreate}
                variant="contained"
                sx={{
                    position: "absolute",
                    right: "15px",
                    borderRadius: "25px",
                    height: "38px",
                    width: "70px",
                    backgroundColor: theme.brand3,
                    boxShadow: "none",
                    "&:hover": {
                        backgroundColor: "#d88e4f",
                        boxShadow: "none",
                    },
                }}
            >
                작성
            </Button>
        </Box>
    );
};

export default WriteComment;
