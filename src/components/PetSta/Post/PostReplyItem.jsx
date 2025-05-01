import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserIcon from "../UserIcon.jsx";
import MyCommentDropdown from "./MyCommentDropdown.jsx";
import { Context } from "../../../context/Context.jsx";
import { deletePetstaComment } from "../../../services/petstaService.js";

const PostReplyItem = ({ reply, onReply, onRemove }) => {
    const { user } = useContext(Context);
    const isMyComment = user?.id === reply.userId;

    const [dropOpen, setDropOpen] = useState(false);
    const [updateAble, setUpdateAble] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropOpen(false); // 🔹 외부 클릭 시 닫기
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropOpen]);

    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await deletePetstaComment(reply.id);
            onRemove(reply.id); // 🔥 삭제 반영
        } catch (e) {
            alert("삭제 실패");
        }
    };

    const userInfo = {
        userName: reply.userName,
        isVisited: reply.isVisited,
        userPhoto: reply.userPhoto,
        userId: reply.userId,
    };

    const renderContentWithMentions = (content) => {
        const mentionRegex = /(@\S+)/g;
        const parts = content.split(mentionRegex);

        return parts.map((part, index) => {
            if (mentionRegex.test(part)) {
                const mentionedName = part.replace("@", "");
                const mentionedUser = reply.mention?.nickname === mentionedName ? reply.mention : null;

                return (
                    <Typography
                        key={index}
                        component="span"
                        color="primary"
                        sx={{ cursor: mentionedUser ? "pointer" : "default", fontWeight: "bold" }}
                        onClick={() => {
                            if (mentionedUser) {
                                navigate(`/petsta/user/${mentionedUser.userId}`);
                            }
                        }}
                    >
                        {part}
                    </Typography>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <Box display="flex" alignItems="flex-start" paddingTop={3} gap={1}>
            <UserIcon userInfo={userInfo} />
            <Box flex={1}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                        <Typography fontWeight="bold">{userInfo.userName || "알 수 없음"}</Typography>
                        <Typography fontSize="12px" color="gray" marginLeft={1}>
                            {reply.createdAt}
                        </Typography>
                    </Box>

                    {isMyComment && (
                        <Box sx={{ position: "relative" }} ref={dropdownRef}>
                            <Typography
                                onClick={() => setDropOpen(!dropOpen)}
                                fontSize="20px"
                                sx={{ ml: 1, cursor: "pointer", userSelect: "none" }}
                            >
                                ⋯
                            </Typography>
                            <MyCommentDropdown
                                open={dropOpen}
                                setOpen={setDropOpen}
                                onEdit={() => {
                                    setUpdateAble(true);
                                    setDropOpen(false);
                                }}
                                onDelete={() => {
                                    handleDelete();
                                    setDropOpen(false);
                                }}
                            />
                        </Box>
                    )}
                </Box>

                <Typography>{renderContentWithMentions(reply.content)}</Typography>

                {!reply.deleted && (
                    <Typography
                        fontSize="14px"
                        color="#A8A8A9"
                        sx={{ cursor: "pointer", marginTop: 0.5 }}
                        onClick={() => onReply(reply)}
                    >
                        답글 달기
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default PostReplyItem;
