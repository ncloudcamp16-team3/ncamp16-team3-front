import React, { useRef, useState } from "react";
import { Box, TextareaAutosize } from "@mui/material";
import TitleBar from "../Global/TitleBar.jsx";
import { useTheme } from "@mui/material/styles";
const AddVideoDetail = ({ videoData, onBack }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);

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
    const theme = useTheme();
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
                    <Box borderRadius="25px" overflow="hidden" display="flex" justifyContent="center">
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
                                borderRadius: "25px",
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
            >
                공유
            </Box>
        </Box>
    );
};

export default AddVideoDetail;
