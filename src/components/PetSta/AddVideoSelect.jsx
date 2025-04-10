import React from "react";
import TitleBar from "../../components/Global/TitleBar.jsx";
import { Box } from "@mui/material";
// 이미지 없을 때 보일 기본 아이콘 (예시로 임포트 필요)
import Video from "../../assets/images/PetSta/Video-icon.svg";
import { useTheme } from "@mui/material/styles"; // 실제 경로로 변경하세요

const AddPhotoSelect = ({ videoPreview, setVideoPreview, goNext }) => {
    const theme = useTheme();

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setVideoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box position="relative">
            <TitleBar name="동영상 업로드" />

            {videoPreview ? (
                <Box
                    width="88%"
                    height="70vh"
                    m="0 auto"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    position="relative"
                >
                    <Box overflow="hidden" minHeight="20%" maxHeight="60vh" minWidth="20%" position="relative">
                        <input
                            type="file"
                            id="fileUpload"
                            accept="video/*"
                            onChange={handleVideoChange}
                            style={{ display: "none" }}
                        />

                        <label htmlFor="fileUpload">
                            <Box
                                width="100%"
                                minHeight="66vh"
                                maxHeight="66vh"
                                display="flex"
                                justifyContent="center"
                                m="0 auto"
                                bgcolor="white"
                            >
                                <video
                                    src={videoPreview}
                                    autoPlay
                                    controls={false}
                                    loop
                                    muted
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        objectFit: "contain",
                                        borderRadius: "20px",
                                    }}
                                />
                            </Box>
                        </label>
                    </Box>
                </Box>
            ) : (
                <Box
                    width="88%"
                    height="70vh"
                    bgcolor="#D9D9D9"
                    m="0 auto"
                    borderRadius="20px"
                    alignItems="center"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    position="relative"
                    overflow="hidden"
                >
                    <img src={Video} alt="video-icon" />
                    <Box marginTop="20px" fontWeight="bold">
                        동영상을 업로드 하세요
                    </Box>

                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            opacity: 0,
                            cursor: "pointer",
                        }}
                    />
                </Box>
            )}

            <Box
                bgcolor="#D9D9D9"
                position="absolute"
                bottom="-60px"
                right="6%"
                zIndex={10}
                width="66px"
                height="48px"
                borderRadius="15px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontWeight="bold"
                sx={{
                    color: "white",
                    bgcolor: videoPreview ? theme.brand3 : "#D9D9D9",
                    cursor: videoPreview ? "pointer" : "default",
                }}
                onClick={videoPreview ? goNext : undefined}
            >
                다음
            </Box>
        </Box>
    );
};

export default AddPhotoSelect;
