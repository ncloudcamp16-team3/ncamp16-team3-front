import React, { useEffect, useRef, useState } from "react";

const VideoPlayer = ({ file_name, isWide = false }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // 비디오가 50% 이상 보이면 재생 시작
                        const video = entry.target;
                        if (video && !isPlaying) {
                            video.play();
                            setIsPlaying(true);
                        }
                    } else {
                        // 비디오가 화면에서 벗어나면 일시 정지
                        const video = entry.target;
                        if (video) {
                            video.pause();
                            setIsPlaying(false);
                        }
                    }
                });
            },
            {
                threshold: 0.75, // 비디오가 화면의 50% 이상 보일 때
            }
        );

        const videoElement = videoRef.current;
        if (videoElement) {
            observer.observe(videoElement);
        }

        // Clean up observer on unmount
        return () => {
            if (videoElement) {
                observer.unobserve(videoElement);
            }
        };
    }, [isPlaying]);

    return (
        <video
            ref={videoRef}
            style={{
                width: "100%",
                objectFit: "contain",
                height: isWide ? "" : "100%",
                transform: isWide ? "" : "scale(0.999",
            }}
            muted // 음소거 상태로 자동 재생을 허용
        >
            <source
                src={`./mock/PetSta/videos/${file_name}`}
                type="video/mp4"
            />
        </video>
    );
};

export default VideoPlayer;
