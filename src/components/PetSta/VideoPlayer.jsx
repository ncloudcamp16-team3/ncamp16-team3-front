import React, { useContext, useEffect, useRef, useState } from "react";
import AudioOff from "../../assets/images/PetSta/audio-off.png";
import AudioOn from "../../assets/images/PetSta/audio-on.png";
import { Box } from "@mui/material";
import { Context } from "../../context/Context.jsx";

const VideoPlayer = ({ file_name, isWide = false, setCurrentTime }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const { isMute, toggleMute } = useContext(Context);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const video = entry.target;
                        if (video && !isPlaying) {
                            video.play();
                            setIsPlaying(true);
                        }
                    } else {
                        const video = entry.target;
                        if (video) {
                            video.pause();
                            setIsPlaying(false);
                        }
                    }
                });
            },
            { threshold: 0.75 }
        );

        const videoElement = videoRef.current;
        if (videoElement) {
            observer.observe(videoElement);
        }

        return () => {
            if (videoElement) {
                observer.unobserve(videoElement);
            }
        };
    }, [isPlaying]);

    return (
        <Box
            position="relative"
            width="100%"
            height={isWide ? "auto" : "100%"}
            overflow="hidden"
        >
            <video
                ref={videoRef}
                style={{
                    width: "100%",
                    height: isWide ? "auto" : "100%",
                    objectFit: "contain",
                    transform: isWide ? "" : "scale(0.999)",
                }}
                muted={isMute}
                onTimeUpdate={() => {
                    if (videoRef.current) {
                        setCurrentTime(videoRef.current.currentTime);
                    }
                }}
            >
                <source
                    src={`/mock/PetSta/videos/${file_name}`}
                    type="video/mp4"
                />
            </video>

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                borderRadius="50%"
                position="absolute"
                bottom="10px"
                right="10px"
                backgroundColor="#262626"
                color="white"
                width="25px"
                height="25px"
                onClick={(event) => {
                    event.stopPropagation();
                    toggleMute();
                }}
                sx={{ cursor: "pointer" }}
            >
                <img
                    src={isMute ? AudioOff : AudioOn}
                    alt={isMute ? "Mute" : "Unmute"}
                    style={{ objectFit: "cover" }}
                    width="13px"
                    height="13px"
                />
            </Box>
        </Box>
    );
};

export default VideoPlayer;
