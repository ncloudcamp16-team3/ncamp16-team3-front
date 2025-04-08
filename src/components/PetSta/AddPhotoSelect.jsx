import React from "react";
import TitleBar from "../../components/Global/TitleBar.jsx";
import { Box } from "@mui/material";
// 이미지 없을 때 보일 기본 아이콘 (예시로 임포트 필요)
import Photo from "../../assets/images/PetSta/photo-icon.svg";
import { useTheme } from "@mui/material/styles"; // 실제 경로로 변경하세요

const AddPhotoSelect = ({ imagePreview, setImagePreview, goNext }) => {
    const theme = useTheme();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box position="relative">
            <TitleBar name="사진 업로드" />

            {imagePreview ? (
                // 이미지가 업로드된 상태
                <Box
                    width="88%"
                    height="70vh"
                    m="0 auto"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    position="relative"
                >
                    <Box
                        overflow="hidden"
                        minHeight="20%"
                        minWidth="20%"
                        borderRadius="25px"
                        position="relative"
                        sx={{}}
                    >
                        <input
                            type="file"
                            id="fileUpload"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: "none" }} // 완전히 숨김
                        />

                        <label htmlFor="fileUpload">
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "20px",
                                    overflow: "hidden",
                                    cursor: "pointer", // 여기서 커서 처리 가능
                                }}
                            >
                                <img
                                    src={imagePreview}
                                    alt="preview"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                    }}
                                />
                            </Box>
                        </label>
                    </Box>
                </Box>
            ) : (
                // 업로드 전 상태
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
                    <img src={Photo} alt="photo-icon" />
                    <Box marginTop="20px" fontWeight="bold">
                        사진을 업로드 하세요
                    </Box>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
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
                    bgcolor: imagePreview ? theme.brand3 : "#D9D9D9",
                    cursor: imagePreview ? "pointer" : "default",
                }}
                onClick={imagePreview ? goNext : undefined}
            >
                다음
            </Box>
        </Box>
    );
};

export default AddPhotoSelect;
