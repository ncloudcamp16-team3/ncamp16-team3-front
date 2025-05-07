import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import LeftArrow from "../../../assets/images/Global/left-arrow-white.svg";
import UserIcon from "../UserIcon.jsx";
import PetstaComment from "../../../assets/images/PetSta/petsta-comment-white.svg";
import { Context } from "../../../context/Context.jsx";
import AudioOff from "../../../assets/images/PetSta/audio-off.png";
import AudioOn from "../../../assets/images/PetSta/audio-on.png";
import { useNavigate } from "react-router-dom";
import BookmarkButton from "./BookmarkButton.jsx";
import LikeButton from "./LikeButton.jsx";
import FollowButton from "./FollowButton.jsx";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { deletePetstaPost } from "../../../services/petstaService.js";
import * as PropTypes from "prop-types";
import MyPostCenterMenu from "./MyPostCenterMenu.jsx";
import GlobalModal from "../../Global/GlobalConfirmModal.jsx";

MyPostCenterMenu.propTypes = {
    open: PropTypes.any,
    onClose: PropTypes.func,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
};
const VideoDetail = ({ post, currentTime = 0 }) => {
    const [isExpended, setIsExpended] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes); // 숫자
    const [likeCountDisplay, setLikeCountDisplay] = useState(""); // 문자열
    const [commentCount, setCommentCount] = useState(post.comments); // 숫자
    const [commentCountDisplay, setCommentCountDisplay] = useState(""); // 문자열
    const [showIcon, setShowIcon] = useState(false);
    const [dropOpen, setDropOpen] = useState(false);
    const videoRef = useRef(null);
    const { isMute, toggleMute, user } = useContext(Context);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [centerMenuOpen, setCenterMenuOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const handleDeleteClick = () => {
        setCenterMenuOpen(false);
        setConfirmDeleteOpen(true);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropOpen]);

    const handleLikeChange = (newLiked) => {
        setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));
    };

    useEffect(() => {
        if (likeCount >= 10000) {
            setLikeCountDisplay((likeCount / 10000).toFixed(1) + "만");
        } else {
            setLikeCountDisplay(likeCount.toString());
        }
    }, [likeCount]);

    useEffect(() => {
        if (commentCount >= 10000) {
            setCommentCountDisplay((commentCount / 10000).toFixed(1) + "만");
        } else {
            setCommentCountDisplay(commentCount.toString());
        }
    }, [commentCount]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = currentTime;
        }
    }, [currentTime]);

    const handleClick = () => {
        toggleMute();
        setShowIcon(true);
        setTimeout(() => {
            setShowIcon(false);
        }, 500);
    };

    const renderContent = (text) => {
        return text.split("\n").map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        ));
    };

    const handleDeletePost = async () => {
        try {
            await deletePetstaPost(post.postId);
            setConfirmDeleteOpen(false);
            navigate(-1);
        } catch (e) {
            alert("게시글 삭제 실패");
        }
    };

    const shortContent = post.content.length > 20 ? post.content.slice(0, 20) + "..." : post.content;

    return (
        <Box height="92vh" backgroundColor="black" display="flex" alignItems="center" position="relative">
            {/* 음소거 아이콘 */}
            {showIcon && (
                <Box
                    position="absolute"
                    top="45%"
                    left="45%"
                    zIndex="1000"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    bgcolor="rgba(0, 0, 0, 0.5)"
                    borderRadius="50%"
                    width="50px"
                    height="50px"
                >
                    <img src={isMute ? AudioOff : AudioOn} width="25px" height="25px" />
                </Box>
            )}
            {/* 상단 뒤로가기 */}
            <Box
                position="absolute"
                top={0}
                left={0}
                display="flex"
                alignItems="center"
                padding="10px 15px"
                color="white"
                fontSize="18px"
                zIndex="999"
                gap={1}
            >
                <IconButton onClick={() => navigate(-1)}>
                    <img src={LeftArrow} />
                </IconButton>
                동영상
            </Box>
            {/* 하단 유저 정보 및 게시글 */}
            <Box position="absolute" bottom="0px" left="0" color="white" zIndex="100" padding="15px">
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <UserIcon userInfo={post} />
                    <Typography fontWeight="bold">{post.userName}</Typography>
                    {user.id !== post.userId && <FollowButton isWhite={true} userId={post.userId} />}
                </Box>
                <Typography
                    component="span"
                    display="inline"
                    sx={{ wordBreak: "break-word", flex: "1" }}
                    onClick={() => setIsExpended(!isExpended)}
                >
                    {isExpended ? renderContent(post.content) : shortContent}
                </Typography>
            </Box>
            {/* 좋아요, 댓글, 북마크 */}
            <Box position="absolute" right="5px" bottom="50px" color="white" zIndex="9999">
                <Box display="flex" flexDirection="column" alignItems="center" width="50px">
                    <LikeButton
                        postId={post.postId}
                        initialLiked={post.initialLiked}
                        onLikeChange={handleLikeChange}
                        isWhite={true}
                        width={32}
                    />
                    {likeCount > 0 && <Typography>{likeCountDisplay}</Typography>}

                    <Box mt={1} onClick={() => navigate(`/petsta/post/comment/${post.postId}`)}>
                        <img src={PetstaComment} width="32px" height="32px" />
                    </Box>
                    {commentCount > 0 && <Typography>{commentCountDisplay}</Typography>}

                    <Box mt={1} mb={1}>
                        <BookmarkButton
                            initialBookmarked={post.initialBookmarked}
                            postId={post.postId}
                            isWhite={true}
                            width={32}
                        />
                    </Box>
                    {user.id === post.userId && (
                        <Box mt={1} sx={{ position: "relative" }} ref={dropdownRef}>
                            <MoreVertIcon
                                onClick={() => setCenterMenuOpen(true)}
                                sx={{ fontSize: "35px", cursor: "pointer" }}
                            />
                            <MyPostCenterMenu
                                open={centerMenuOpen}
                                onClose={() => setCenterMenuOpen(false)}
                                onDelete={handleDeleteClick}
                                onEdit={() => {
                                    setCenterMenuOpen(false);
                                    navigate(`/petsta/post/edit/video/${post.postId}`);
                                }}
                            />
                        </Box>
                    )}
                </Box>
            </Box>
            {/* 비디오 */}
            <video
                onClick={handleClick}
                ref={videoRef}
                style={{
                    width: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    transform: "scale(0.999)",
                }}
                muted={isMute}
                autoPlay
                loop
            >
                <source src={`${post.fileName}`} type="video/mp4" />
            </video>

            <GlobalModal
                open={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                message={{
                    title: "게시글 삭제",
                    text: "정말 이 게시글을 삭제하시겠습니까?",
                    confirmText: "삭제",
                    cancelText: "취소",
                    showCancel: true,
                    onConfirm: handleDeletePost,
                }}
            />
        </Box>
    );
};

export default VideoDetail;
