import React, { useRef, useState } from "react";
import { Box, TextareaAutosize } from "@mui/material";
import TitleBar from "../../Global/TitleBar.jsx";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { addVideo } from "../../../services/petstaService.js";
const AddVideoDetail = ({ videoData, onBack }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [content, setContent] = useState(""); // ← 내용 저장
    const theme = useTheme();
    const navigate = useNavigate(); // ← 이동용

    const handleVideoClick = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
            setIsPlaying(false);
        } else {
            // trimEnd에 도달해 있는 상태라면 trimStart부터 다시 시작
            if (video.currentTime >= videoData.trimEnd) {
                video.currentTime = videoData.trimStart;
            }
            video.play();
            setIsPlaying(true);
        }
    };

    const handleShare = async () => {
        try {
            const formData = new FormData();
            formData.append("content", content);
            formData.append("video", videoData.file); // videoData에 file 있어야 함
            formData.append("trimStart", videoData.trimStart);
            formData.append("trimEnd", videoData.trimEnd);

            await addVideo(formData);

            alert("동영상이 업로드되었습니다!");
            navigate("/petsta");
        } catch (error) {
            console.error(error);
            alert("업로드 실패!");
        }
    };

    return (
        <Box>
            <TitleBar name="동영상 업로드" onBack={onBack} />

            <Box
                width="100%"
                minHeight="35vh"
                maxHeight="35vh"
                display="flex"
                justifyContent="center"
                m="0 auto"
                bgcolor="white"
            >
                {videoData?.videoUrl && (
                    <Box mx={3} overflow="hidden" display="flex" justifyContent="center">
                        <video
                            autoPlay
                            ref={videoRef}
                            src={videoData.videoUrl}
                            controls={false}
                            onClick={handleVideoClick}
                            onLoadedMetadata={() => {
                                if (videoRef.current) {
                                    videoRef.current.currentTime = videoData.trimStart;
                                }
                            }}
                            onTimeUpdate={() => {
                                if (videoRef.current && videoRef.current.currentTime >= videoData.trimEnd) {
                                    videoRef.current.pause();
                                    setIsPlaying(false);
                                }
                            }}
                            style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                                cursor: "pointer",
                            }}
                        />
                    </Box>
                )}
            </Box>

            <Box display="flex" flexDirection="column" width="88%" m="20px auto">
                <Box fontWeight="bold" mb="8px">
                    내용
                </Box>

                <TextareaAutosize
                    minRows={8}
                    placeholder="내용을 적어주세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px",
                        fontSize: "16px",
                        borderRadius: "12px",
                        border: "1px solid #ccc",
                        resize: "none",
                        fontFamily: "inherit",
                    }}
                />
            </Box>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="88%"
                m="0 auto"
                bgcolor={theme.brand3}
                borderRadius="12px"
                height="48px"
                color="white"
                fontSize="18px"
                fontWeight="bold"
                onClick={handleShare}
                sx={{ cursor: "pointer" }}
            >
                공유
            </Box>
        </Box>
    );
};

export default AddVideoDetail;
