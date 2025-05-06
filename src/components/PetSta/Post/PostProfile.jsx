import React, { useContext, useState } from "react";
import { Box, Typography } from "@mui/material";
import UserIcon from "../UserIcon.jsx";
import { toggleFollow as toggleFollowAPI } from "../../../services/memberService.js";
import { useFollow } from "../../../context/FollowContext.jsx";
import { Context } from "../../../context/Context.jsx";
import { deletePetstaPost } from "../../../services/petstaService.js";
import { useNavigate } from "react-router-dom";
import MyPostCenterMenu from "./MyPostCenterMenu.jsx";
// ★ 추가

const PostProfile = ({ userName, userId, userPhoto, isVisited, isAbsolute = false, postId, onRemove, fileType }) => {
    const { user } = useContext(Context);
    const { followMap, toggleFollow } = useFollow(); // ★ 추가
    const isFollow = followMap[userId] || false;
    const [centerMenuOpen, setCenterMenuOpen] = useState(false);
    const navigate = useNavigate();
    const userInfo = {
        userName,
        userId,
        userPhoto,
        isVisited,
    };

    const handleDeletePost = async () => {
        try {
            await deletePetstaPost(postId);
            if (onRemove) {
                onRemove(postId); // 🔥 삭제 후 UI에서 제거
            } else {
                navigate(-1);
            }
        } catch (e) {
            alert("게시글 삭제 실패");
        }
    };

    const handleFollowClick = async () => {
        try {
            await toggleFollow(userId); // context 상태 변경
            await toggleFollowAPI(userId); // 서버 요청
        } catch (error) {
            console.error("팔로우 실패", error);
        }
    };

    const handleEdit = () => {
        setCenterMenuOpen(false);
        const routeType = fileType === "VIDEO" ? "video" : "photo";
        navigate(`/petsta/post/edit/${routeType}/${postId}`);
    };

    return (
        <Box
            sx={{
                justifyContent: "space-between",
                display: "flex",
                alignItems: "center",
                padding: "8px",
                position: isAbsolute ? "absolute" : "static",
                top: isAbsolute ? 5 : "auto",
                left: isAbsolute ? 0 : "auto",
                zIndex: isAbsolute ? 1 : "auto",
                width: "100%",
            }}
        >
            <Box display="flex" alignItems="center">
                <UserIcon userInfo={userInfo} />
                <Typography
                    sx={{
                        color: isAbsolute ? "white" : "inherit",
                        marginLeft: 1,
                        fontWeight: "bold",
                    }}
                >
                    {userName}
                </Typography>
            </Box>
            {user.id !== userId && (
                <Box
                    border="1px solid"
                    borderColor={isAbsolute ? "white" : "inherit"}
                    borderRadius={1}
                    paddingX={1}
                    paddingY={0.2}
                    textAlign="center"
                    onClick={handleFollowClick}
                    sx={{
                        color: isAbsolute ? "white" : "inherit",
                        cursor: "pointer",
                    }}
                >
                    {isFollow ? "팔로잉" : "팔로우"}
                </Box>
            )}
            {user.id === userId && (
                <Box sx={{ position: "relative" }}>
                    <Typography
                        onClick={() => setCenterMenuOpen(true)}
                        fontSize="20px"
                        sx={{ ml: 1, cursor: "pointer", userSelect: "none", color: isAbsolute ? "white" : "inherit" }}
                    >
                        ⋯
                    </Typography>
                    <MyPostCenterMenu
                        open={centerMenuOpen}
                        onClose={() => setCenterMenuOpen(false)}
                        onDelete={handleDeletePost}
                        onEdit={handleEdit}
                    />
                </Box>
            )}
        </Box>
    );
};

export default PostProfile;
