import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import useTimeAgo from "../../hook/useTimeAgo.js";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Context } from "../../context/Context.jsx";
import { useTheme } from "@mui/material/styles";
import DropdownCommentBtns from "./DropdownCommentBtns.jsx";
import { deleteComment, getComments, updateComment } from "../../services/boardService.js";
import replyIcon from "../../assets/images/Board/reply.png";

const CommentCard = ({ commentItem, handleReply, scrollToComment, handleSnackbarOpen, setPostComments, postId }) => {
    const { user } = useContext(Context);
    const timeAgo = useTimeAgo(commentItem.createdAt);
    const [dropCommentBtn, setDropCommentBtn] = useState(false);
    const [updateAble, setUpdateAble] = useState(false);
    const [comment, setComment] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropCommentBtn && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropCommentBtn(false); // 🔹 외부 클릭 시 닫기
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropCommentBtn]);

    useEffect(() => {
        setComment(commentItem.content);
    }, []);

    const requestCommentUpdate = () => {
        updateComment(comment, commentItem.id, user.id)
            .then((res) => {
                console.log("응답 결과: " + res.message);
                setUpdateAble(false);

                return getComments(postId);
            })
            .then((res) => {
                console.log(res.data);
                setPostComments(res.data);
            })
            .catch((err) => {
                console.log("에러 발생: " + err.message);
                handleSnackbarOpen(err.message, "error");
            });
    };

    const requestCommentDelete = () => {
        deleteComment(commentItem.id, user.id)
            .then((res) => {
                console.log("응답 결과: " + res.message);
                handleSnackbarOpen(res.message, "success");
                setPostComments(res.data);
            })
            .catch((err) => {
                console.log("에러 발생: " + err.message);
                handleSnackbarOpen(err.message, "error");
            });
    };

    const theme = useTheme();
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                }}
            >
                {commentItem.hasParent && (
                    <Box
                        component="img"
                        src={replyIcon}
                        sx={{
                            height: "30px",
                            mt: "10px",
                        }}
                    />
                )}
                {commentItem.deleted ? (
                    <Typography
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "1.2rem",
                            my: "5px",
                            pl: "25px",
                            pb: "10px",
                            pr: "5px",
                            color: "gray",
                            height: "65px",
                            flex: "1",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.5)",
                        }}
                    >
                        삭제된 댓글입니다.
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            py: "5px",
                            px: "10px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            flexDirection: "column",
                            mb: "10px",
                            position: "relative",
                            flex: "1",
                        }}
                    >
                        <Box sx={{ display: "flex" }}>
                            <Box
                                component="img"
                                src={commentItem?.authorProfileImg}
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
                                <Typography>{commentItem.authorNickname}</Typography>
                                <Typography
                                    sx={{
                                        fontSize: "14px",
                                        color: "rgba(0, 0, 0, 0.5)",
                                    }}
                                >
                                    {timeAgo}
                                    {commentItem.modified && "(수정됨)"}
                                </Typography>
                            </Box>
                        </Box>
                        {user.id === commentItem.authorId && (
                            <Box ref={dropdownRef}>
                                <MoreVertIcon
                                    onClick={() => {
                                        if (!dropCommentBtn) {
                                            setDropCommentBtn(true);
                                        }
                                    }}
                                    sx={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "10px",
                                        cursor: "pointer",
                                        color: theme.brand3,
                                        fontSize: "28px",
                                    }}
                                />
                                <DropdownCommentBtns
                                    dropCommentBtn={dropCommentBtn}
                                    setDropCommentBtn={setDropCommentBtn}
                                    setUpdateAble={setUpdateAble}
                                    requestCommentDelete={requestCommentDelete}
                                />
                            </Box>
                        )}
                        <Box
                            sx={{
                                display: "flex",
                            }}
                        >
                            {commentItem.refComment && (
                                <Typography
                                    onClick={
                                        commentItem.refComment.deletedAuthor
                                            ? undefined
                                            : () => scrollToComment(commentItem.refComment.id)
                                    }
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        fontSize: "1rem",
                                        my: "5px",
                                        py: 0.5,
                                        pl: "3px",
                                        pr: "5px",
                                        color: commentItem.refComment.deletedAuthor ? "gray" : "blue",
                                        cursor: commentItem.refComment.deletedAuthor ? undefined : "pointer",
                                        fontStyle: commentItem.refComment.deletedAuthor && "italic",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    @
                                    {commentItem.refComment.deletedAuthor
                                        ? "삭제된 회원"
                                        : commentItem.refComment.authorNickname}
                                </Typography>
                            )}
                            <TextField
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                variant={updateAble ? "outlined" : "standard"}
                                fullWidth
                                multiline
                                InputProps={{
                                    readOnly: !updateAble,
                                    disableUnderline: true,
                                    sx: {
                                        fontSize: "1rem",
                                        my: "5px",
                                        border: updateAble ? "1px solid #ccc" : "none",
                                        borderRadius: "4px",
                                        py: 0.5,
                                        pl: "3px",
                                        "& input": {
                                            padding: 0,
                                        },
                                    },
                                }}
                            />
                        </Box>
                        {updateAble && (
                            <Box sx={{ display: "flex", justifyContent: "end", gap: "10px", mb: "5px" }}>
                                <Button
                                    onClick={requestCommentUpdate}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: theme.brand3,
                                        borderRadius: "20px",
                                    }}
                                >
                                    댓글 수정
                                </Button>
                                <Button
                                    onClick={() => {
                                        setComment(commentItem.content);
                                        setUpdateAble(false);
                                    }}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: theme.brand4,
                                        borderRadius: "20px",
                                    }}
                                >
                                    취소
                                </Button>
                            </Box>
                        )}
                        <Box sx={{ display: "flex", justifyContent: "end", gap: "10px" }}>
                            <Typography
                                onClick={() => handleReply(commentItem.id, commentItem.authorNickname)}
                                sx={{
                                    color: "gray",
                                    borderRadius: "20px",
                                    cursor: "pointer",
                                }}
                            >
                                답글 달기
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default CommentCard;
