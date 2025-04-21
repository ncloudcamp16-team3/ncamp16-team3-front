import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import LeftArrow from "../../../assets/images/Global/left-arrow-white.svg";
import UserIcon from "../UserIcon.jsx";
import PetstaHeart from "../../../assets/images/PetSta/petsta-heart-white.svg";
import PetstaBookmark from "../../../assets/images/PetSta/petsta-bookmark-white.svg";
import PetstaComment from "../../../assets/images/PetSta/petsta-comment-white.svg";
import { Context } from "../../../context/Context.jsx";
import AudioOff from "../../../assets/images/PetSta/audio-off.png";
import AudioOn from "../../../assets/images/PetSta/audio-on.png";
import { useNavigate } from "react-router-dom";

const VideoDetail = ({ post, currentTime = 0 }) => {
    const [isExpended, setIsExpended] = useState(false);
    const [likeCount, setLikeCount] = useState("");
    const [commentCount, setCommentCount] = useState("");
    const [showIcon, setShowIcon] = useState(false);
    const videoRef = useRef(null);
    const { isMute, toggleMute } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (post.likes >= 10000) {
            setLikeCount((post.likes / 10000).toFixed(1) + "만");
        } else {
            setLikeCount(post.likes.toString());
        }
    }, [post.likes]);

    useEffect(() => {
        if (post.comments >= 10000) {
            setCommentCount((post.comments / 10000).toFixed(1) + "만");
        } else {
            setCommentCount(post.comments.toString());
        }
    }, [post.comments]);

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

    const shortContent = post.content.length > 20 ? post.content.slice(0, 20) + "..." : post.content;

    return (
        <Box height="92vh" backgroundColor="black" display="flex" alignItems="center" position="relative">
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
            <Box position="absolute" bottom="0px" left="0" color="white" zIndex="100" padding="15px">
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <UserIcon userInfo={post} />
                    <Typography fontWeight="bold">{post.userName}</Typography>
                    <Box
                        border="1px solid #FFFFFF"
                        borderRadius="10px"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        width="60px"
                        height="30px"
                    >
                        <Typography fontSize="12px" fontWeight="bold">
                            팔로우
                        </Typography>
                    </Box>
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
            <Box position="absolute" right="5px" bottom="50px" color="white" zIndex="999">
                <Box display="flex" flexDirection="column" alignItems="center" width="50px">
                    <Box>
                        <img src={PetstaHeart} width="32px" height="32px" />
                    </Box>
                    {post.likes > 0 && <Typography>{likeCount}</Typography>}
                    <Box
                        mt={1}
                        onClick={() => {
                            navigate(`/petsta/post/comment/${post.postId}`);
                        }}
                    >
                        <img src={PetstaComment} width="32px" height="32px" />
                    </Box>
                    {post.comments > 0 && <Typography>{commentCount}</Typography>}
                    <Box mt={1} mb={1}>
                        <img src={PetstaBookmark} width="32px" height="32px" />
                    </Box>
                </Box>
            </Box>
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
                <source src={`/mock/PetSta/videos/${post.fileName}`} type="video/mp4" />
            </video>
        </Box>
    );
};

export default VideoDetail;
