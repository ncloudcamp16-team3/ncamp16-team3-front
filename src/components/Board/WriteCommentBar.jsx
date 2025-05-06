import React from "react";
import LikeBtn from "./LikeBtn.jsx";
import { Box, Button, InputBase } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const WriteCommentBar = ({
    comment,
    setComment,
    liked,
    likeBtnClick,
    commentInputRef,
    requestCommentCreate,
    isReply,
}) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                bottom: "85px",
                left: "10px",
                right: "10px",
                height: "50px",
                width: "100%",
                backgroundColor: theme.brand2,
                borderRadius: isReply ? "0 0 10px 10px" : "10px",
                color: "white",
                zIndex: 1000,
                margin: "0 auto",
                alignItems: "center",
                display: "flex",
                p: "2px",
            }}
        >
            <LikeBtn likeBtnClick={likeBtnClick} liked={liked} fontSize="35px" />

            <InputBase
                inputRef={commentInputRef}
                placeholder="댓글을 작성해주세요"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        requestCommentCreate();
                    }
                }}
                sx={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    fontSize: "15px",
                    flex: 1,
                    height: "calc(100% - 10px)",
                    mr: "50px",
                    pl: "10px",
                    pr: "35px",
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

export default WriteCommentBar;
