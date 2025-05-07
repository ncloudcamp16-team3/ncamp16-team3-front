import React, { useContext, useRef, useState } from "react";
import { Box, TextareaAutosize, Modal, Backdrop, CircularProgress } from "@mui/material";
import TitleBar from "../../Global/TitleBar.jsx";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { addVideo } from "../../../services/petstaService.js";
import { Context } from "../../../context/Context.jsx";

const AddVideoDetail = ({ videoData, onBack }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [content, setContent] = useState("");
    const [uploading, setUploading] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const theme = useTheme();
    const navigate = useNavigate();
    const { showModal } = useContext(Context);

    const handleVideoClick = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
            setIsPlaying(false);
        } else {
            if (video.currentTime >= videoData.trimEnd) {
                video.currentTime = videoData.trimStart;
            }
            video.play();
            setIsPlaying(true);
        }
    };

    const handleShare = async () => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("content", content);
            formData.append("video", videoData.file);
            formData.append("trimStart", videoData.trimStart);
            formData.append("trimEnd", videoData.trimEnd);

            await addVideo(formData);

            showModal("", "동영상이 업로드되었습니다.", () => navigate("/petsta"));
        } catch (error) {
            console.error(error);
            showModal("", "동영상 업로드 중 문제가 발생했습니다.\n다시 시도해 주세요.");
        } finally {
            setUploading(false);
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
                sx={{ cursor: uploading ? "not-allowed" : "pointer", opacity: uploading ? 0.6 : 1 }}
            >
                공유
            </Box>

            {/* ✅ 업로드 중 스피너 */}
            <Modal
                open={uploading}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                        sx: { backgroundColor: "rgba(0, 0, 0, 0.4)" },
                    },
                }}
            >
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        p={4}
                        bgcolor="white"
                        borderRadius={2}
                        boxShadow={4}
                        minWidth={280}
                    >
                        <CircularProgress size={48} />
                        <Box mt={2} fontSize="16px" fontWeight="medium" color="#333">
                            동영상을 업로드 중입니다...
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default AddVideoDetail;
