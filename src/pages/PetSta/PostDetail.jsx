import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import posts from "../../mock/PetSta/posts.json";
import { Box, IconButton, Typography } from "@mui/material";
import LeftArrow from "../../assets/images/Global/left-arrow-white.svg";
import UserIcon from "../../components/PetSta/UserIcon.jsx";
import PetstaHeart from "../../assets/images/PetSta/petsta-heart-white.svg";
import PetstaBookmark from "../../assets/images/PetSta/petsta-bookmark-white.svg";
import PetstaComment from "../../assets/images/PetSta/petsta-comment-white.svg";
import { Context } from "../../context/Context.jsx";
import AudioOff from "../../assets/images/PetSta/audio-off.png";
import AudioOn from "../../assets/images/PetSta/audio-on.png";

const PostDetail = () => {
    const { post_id } = useParams();
    const [isExpended, setIsExpended] = useState(false);
    const [like_count, setLike_count] = useState("");
    const [comment_count, setComment_count] = useState("");
    const [showIcon, setShowIcon] = useState(false);
    const videoRef = useRef(null);
    const { isMute, toggleMute } = useContext(Context);
    const location = useLocation();
    const currentTime = location.state?.currentTime || 0;

    const renderContent = (text) => {
        return text.split("\n").map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        ));
    };

    const post = posts.find((p) => p.post_id === post_id);
    const navigate = useNavigate();
    const handleClick = () => {
        toggleMute();
        setShowIcon(true);

        setTimeout(() => {
            setShowIcon(false);
        }, 500);
    };

    useEffect(() => {
        if (post.likes >= 10000) {
            setLike_count((post.likes / 10000).toFixed(1) + "만");
        } else {
            setLike_count(post.likes.toString());
        }
    }, [post.likes]);

    useEffect(() => {
        if (post.comments >= 10000) {
            setComment_count((post.comments / 10000).toFixed(1) + "만");
        } else {
            setComment_count(post.comments.toString());
        }
    }, [post.comments]);

    const shortContent =
        post.content.length > 20
            ? post.content.slice(0, 20) + "..."
            : post.content;

    // 🔥 비디오가 로드된 후 currentTime 설정
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = currentTime;
            console.log(currentTime);
        }
    }, [currentTime]);

    return (
        <div>
            <Box
                height="92vh"
                backgroundColor="black"
                display="flex"
                alignItems="center"
                position="relative"
            >
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
                        <img
                            src={isMute ? AudioOff : AudioOn}
                            width="25px"
                            height="25px"
                        />
                    </Box>
                )}
                {/* 상단 오버레이 (제목 & 뒤로가기) */}
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    샤
                    display="flex"
                    alignItems="center"
                    padding="10px 15px"
                    color="white"
                    fontSize="18px"
                    zIndex="999"
                >
                    <IconButton onClick={() => navigate(-1)}>
                        <img src={LeftArrow} />
                    </IconButton>
                    동영상
                </Box>
                <Box
                    position="absolute"
                    bottom="0px"
                    left="0"
                    color="white"
                    zIndex="100"
                    padding="15px"
                >
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <UserIcon userInfo={post} />
                        <Typography fontWeight="bold">
                            {post.user_name}
                        </Typography>
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
                        sx={{
                            wordBreak: "break-word", // 긴 텍스트가 줄 바뀌도록 설정
                            flex: "1", // 나머지 공간을 차지하도록 설정
                        }}
                        onClick={() => setIsExpended(!isExpended)}
                    >
                        {isExpended
                            ? renderContent(post.content)
                            : shortContent}
                    </Typography>
                </Box>
                <Box
                    position="absolute"
                    right="5px"
                    bottom="50px"
                    color="white"
                    zIndex="999"
                >
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        width="50px"
                    >
                        <div>
                            <img src={PetstaHeart} width="32px" height="32px" />
                        </div>
                        {post.likes > 0 && (
                            <Typography>{like_count}</Typography>
                        )}
                        <div>
                            <img
                                src={PetstaComment}
                                width="32px"
                                height="32px"
                            />
                        </div>
                        {post.comments > 0 && (
                            <Typography>{comment_count}</Typography>
                        )}
                        <div>
                            <img
                                src={PetstaBookmark}
                                width="32px"
                                height="32px"
                            />
                        </div>
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
                    <source
                        src={`/mock/PetSta/videos/${post.file_name}`}
                        type="video/mp4"
                    />
                </video>
            </Box>
        </div>
    );
};

export default PostDetail;
