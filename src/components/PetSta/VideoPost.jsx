import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import PostProfile from "./PostProfile.jsx";
import PostBottom from "./PostBottom.jsx";
import VideoPlayer from "./VideoPlayer.jsx";
import { useNavigate } from "react-router-dom";

const VideoPost = ({
    post_id,
    user_name,
    user_photo,
    file_name,
    likes,
    comments,
    content,
    created_at,
}) => {
    const [isWide, setIsWide] = useState(false); // 화면이 넓은지 여부
    const [currentTime, setCurrentTime] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (file_name) {
            const video = document.createElement("video");
            video.src = "./mock/PetSta/videos/" + file_name; // 파일 경로 또는 URL을 사용
            video.onloadedmetadata = () => {
                const videoWidth = video.videoWidth;
                const videoHeight = video.videoHeight;
                const ratio = 599 / 565; // 가로/세로 비율
                const videoRatio = videoWidth / videoHeight;
                // 비디오가 가로로 더 넓으면 true, 그렇지 않으면 false
                setIsWide(videoRatio > ratio);
            };
        }
    }, [file_name]);

    const handlePostClick = () => {
        navigate(`/petsta/post/${post_id}`, { state: { currentTime } });
    };

    return (
        <Box
            sx={{
                width: "100%",
                maxHeight: "100vh",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {isWide ? (
                    <div
                        onClick={handlePostClick}
                        style={{ position: "relative", width: "100%" }}
                    >
                        <VideoPlayer
                            file_name={file_name}
                            isWide={true}
                            setCurrentTime={setCurrentTime}
                        />
                        {/* 프로필 이미지와 사용자 이름 */}
                        <PostProfile
                            user_name={user_name}
                            user_photo={user_photo}
                            isAbsolute={true}
                        />
                    </div>
                ) : (
                    <div
                        onClick={handlePostClick}
                        style={{ position: "relative", width: "100%" }}
                    >
                        <PostProfile
                            user_name={user_name}
                            user_photo={user_photo}
                        />
                        <Box
                            sx={{
                                background: "black",
                                height: "70vh",
                                boxSizing: "border-box",
                            }}
                        >
                            <VideoPlayer
                                file_name={file_name}
                                setCurrentTime={setCurrentTime}
                            />
                        </Box>
                        {/* 프로필 이미지와 사용자 이름 */}
                    </div>
                )}
            </Box>
            <PostBottom
                user_name={user_name}
                content={content}
                created_at={created_at}
                comments={comments}
                likes={likes}
            />
        </Box>
    );
};

export default VideoPost;
