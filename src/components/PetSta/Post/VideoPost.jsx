import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import PostProfile from "./PostProfile.jsx";
import PostBottom from "./PostBottom.jsx";
import VideoPlayer from "./VideoPlayer.jsx";

const VideoPost = ({
    postId,
    userName,
    userId,
    userPhoto,
    fileName,
    likes,
    comments,
    content,
    createdAt,
    initialLiked,
    initialBookmarked,
    isVisited,
}) => {
    const [isWide, setIsWide] = useState(false); // 화면이 넓은지

    // 🔹 useMemo를 사용하여 isWide 계산 (렌더링 최소화)
    useEffect(() => {
        if (fileName) {
            const video = document.createElement("video");
            video.src = fileName; // 파일 경로 또는 URL을 사용
            video.onloadedmetadata = () => {
                const videoWidth = video.videoWidth;
                const videoHeight = video.videoHeight;
                const ratio = 599 / 565; // 가로/세로 비율
                const videoRatio = videoWidth / videoHeight;
                // 비디오가 가로로 더 넓으면 true, 그렇지 않으면 false
                setIsWide(videoRatio > ratio);
            };
        }
    }, [fileName]);

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
                    <div style={{ position: "relative", width: "100%" }}>
                        <VideoPlayer fileName={fileName} isWide={true} postId={postId} />
                        {/* 프로필 이미지와 사용자 이름 */}
                        <PostProfile
                            userId={userId}
                            userName={userName}
                            userPhoto={userPhoto}
                            isAbsolute={true}
                            isVisited={isVisited}
                        />
                    </div>
                ) : (
                    <div style={{ position: "relative", width: "100%" }}>
                        <PostProfile userName={userName} userId={userId} userPhoto={userPhoto} isVisited={isVisited} />
                        <Box
                            sx={{
                                background: "black",
                                height: "70vh",
                                boxSizing: "border-box",
                            }}
                        >
                            <VideoPlayer fileName={fileName} postId={postId} />
                        </Box>
                        {/* 프로필 이미지와 사용자 이름 */}
                    </div>
                )}
            </Box>
            <PostBottom
                initialLiked={initialLiked}
                initialBookmarked={initialBookmarked}
                postId={postId}
                userName={userName}
                content={content}
                createdAt={createdAt}
                comments={comments}
                likes={likes}
            />
        </Box>
    );
};

export default VideoPost;
