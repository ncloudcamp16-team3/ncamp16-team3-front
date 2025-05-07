import React, { useRef, useState, useEffect } from "react";
import { Box, Slider } from "@mui/material";
import TitleBar from "../../Global/TitleBar.jsx";
import VideoOn from "../../../assets/images/PetSta/video-on.svg";
import VideoOff from "../../../assets/images/PetSta/video-off.svg";

const AddVideoTrim = ({ videoPreview, onBack, onNext }) => {
    const [trimStart, setTrimStart] = useState(0); // 시작 시간 (왼쪽 thumb)
    const [currentTime, setCurrentTime] = useState(0); // 현재 재생 시간 (가운데 thumb)
    const [trimEnd, setTrimEnd] = useState(0); // 끝 시간 (오른쪽 thumb)

    const videoRef = useRef(null);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleNext = () => {
        onNext({
            videoUrl: videoPreview,
            trimStart,
            trimEnd,
        });
    };

    const togglePlay = () => {
        const video = videoRef.current;
        if (video) {
            if (video.paused) {
                video.play();
                setIsPlaying(true);
            } else {
                video.pause();
                setIsPlaying(false);
            }
        }
    };

    useEffect(() => {
        if (isPlaying && currentTime >= trimEnd - 0.1) {
            const video = videoRef.current;
            if (video) {
                video.currentTime = trimStart;
                video.play();
            }
        }
    }, [currentTime, trimEnd, isPlaying]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
        };

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
            setTrimEnd(video.duration);
        };

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => setIsPlaying(false);

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        video.addEventListener("play", handlePlay);
        video.addEventListener("pause", handlePause);
        video.addEventListener("ended", handleEnded);

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
            video.removeEventListener("play", handlePlay);
            video.removeEventListener("pause", handlePause);
            video.removeEventListener("ended", handleEnded);
        };
    }, []);

    const formatTime = (time) => {
        const min = Math.floor(time / 60)
            .toString()
            .padStart(2, "0");
        const sec = Math.floor(time % 60)
            .toString()
            .padStart(2, "0");
        return `${min}:${sec}`;
    };

    return (
        <Box
            position="fixed"
            top={0}
            maxWidth="500px"
            width="100%"
            height="100vh"
            zIndex={99999}
            bgcolor="black"
            m="0 auto"
        >
            <Box bgcolor="black" color="white">
                <TitleBar name="동영상 업로드" onBack={onBack} />
            </Box>
            <Box position="relative" height="78vh" bgcolor="black">
                <Box
                    width="100%"
                    minHeight="82vh"
                    maxHeight="80vh"
                    display="flex"
                    justifyContent="center"
                    m="0 auto"
                    overflow="hidden"
                    borderRadius="20px"
                >
                    {videoPreview && (
                        <video
                            ref={videoRef}
                            src={videoPreview}
                            controls={false}
                            autoPlay
                            style={{ width: "100%", height: "auto", background: "#000", borderRadius: "20px" }}
                        />
                    )}
                </Box>

                <Box
                    position="absolute"
                    bottom="-33px"
                    width="100%"
                    height="65px"
                    mx="auto"
                    bgcolor="rgba(30,30,30,0.8)"
                >
                    <Box display="flex" alignItems="center" justifyContent="space-between" m="6px 6px 0 6px">
                        {/* 재생/멈춤 버튼 */}
                        <Box onClick={togglePlay} sx={{ cursor: "pointer" }}>
                            <img src={isPlaying ? VideoOff : VideoOn} alt="toggle" />
                        </Box>

                        {/* 재생시간 / 종료시간 표시 */}
                        <Box color="#fff" fontSize="14px" fontWeight="bold">
                            {formatTime(currentTime)} / {formatTime(trimEnd)}
                        </Box>

                        <Box width={24} />
                    </Box>
                    <Box marginX={2}>
                        <Slider
                            track="inverted"
                            value={[trimStart, currentTime, trimEnd]}
                            disableSwap
                            onChange={(_, newValue) => {
                                let [start, current, end] = newValue;

                                // trimStart, trimEnd보다 current가 벗어나는 걸 방지
                                if (current < start) current = start;
                                if (current > end) current = end;

                                setTrimStart(start);
                                setTrimEnd(end);

                                // setCurrentTime은 꼭 마지막에!
                                setCurrentTime(current);

                                // videoRef.current.currentTime도 current로 고정
                                if (videoRef.current) {
                                    videoRef.current.currentTime = current;
                                }
                            }}
                            step={1}
                            min={0}
                            max={duration}
                            sx={{
                                height: "2px",
                                "& .MuiSlider-track": {
                                    backgroundColor: "#FF8E53", // 게이지 채워진 부분 색
                                    height: 4,
                                },
                                "& .MuiSlider-rail": {
                                    backgroundColor: "#e0e0e0", // 게이지 뒷배경
                                    height: 4,
                                },
                                "& .MuiSlider-thumb.Mui-active": {
                                    boxShadow: "none !important",
                                },
                                "& .MuiSlider-thumb:focus, & .MuiSlider-thumb:hover": {
                                    boxShadow: "none !important",
                                },
                                "& .MuiSlider-thumb": {
                                    width: 3,
                                    height: 24,
                                    borderRadius: "0",
                                },
                                "& .MuiSlider-thumb[data-index='0']": {
                                    backgroundColor: "blue",
                                },
                                "& .MuiSlider-thumb[data-index='1']": {
                                    backgroundColor: "white", // 가운데 thumb만 다르게
                                    borderRadius: "50%",
                                    width: 14,
                                    height: 14,
                                },
                                "& .MuiSlider-thumb[data-index='2']": {
                                    backgroundColor: "red",
                                },
                            }}
                        />
                    </Box>
                </Box>
                <Box
                    width="88%"
                    m="20px auto 0"
                    height="48px"
                    borderRadius="12px"
                    bgcolor="#F5A25D"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    color="white"
                    fontWeight="bold"
                    fontSize="16px"
                    sx={{ cursor: "pointer" }}
                    onClick={handleNext}
                >
                    다음
                </Box>
            </Box>
        </Box>
    );
};

export default AddVideoTrim;
