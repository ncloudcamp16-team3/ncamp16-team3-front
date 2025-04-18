import React, { useContext, useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import useTimeAgo from "../../hook/useTimeAgo.js";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Context } from "../../context/Context.jsx";
import { useTheme } from "@mui/material/styles";
import DropdownCommentBtns from "./DropdownCommentBtns.jsx";

const CommentCard = ({ commentItem }) => {
    const { user } = useContext(Context);
    const timeAgo = useTimeAgo(commentItem.createdAt);
    const [dropCommentBtn, setDropCommentBtn] = useState(false);
    const [updateAble, setUpdateAble] = useState(false);
    const [comment, setComment] = useState("");

    useEffect(() => {
        setComment(commentItem.content);
    }, []);

    const requestCommentUpdate = () => {
        alert(commentItem.id + "번 댓글\n" + comment + "으로 내용 수정요청");
        window.location.reload();
    };

    const requestCommentDelete = () => {
        alert(commentItem.id + "번 댓글 삭제요청");
        window.location.reload();
    };
    const theme = useTheme();
    return (
        <Box
            sx={{
                py: "5px",
                px: "10px",
                borderBottom: "1px solid rgba(0, 0, 0, 0.5)",
                display: "flex",
                flexDirection: "column",
                mb: "10px",
                position: "relative",
            }}
        >
            <Box sx={{ display: "flex" }}>
                <Box
                    component="img"
                    src={commentItem.user.photo.url}
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
                    <Typography>{commentItem.user.nickname}</Typography>
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
            {user.id === commentItem.user.id && (
                <Box>
                    <MoreVertIcon
                        onClick={() => setDropCommentBtn(!dropCommentBtn)}
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
                        "& input": {
                            padding: 0,
                            height: "15rem",
                        },
                    },
                }}
            />
            {updateAble && (
                <Box sx={{ display: "flex", justifyContent: "end" }}>
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
                </Box>
            )}
        </Box>
    );
};

export default CommentCard;
