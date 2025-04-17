import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TitleBar from "../../components/Global/TitleBar.jsx";

const mockPetstaBookmarks = [
    {
        id: 1,
        thumbnail: "/mock/PetMeeting/images/pet5.jpg",
        fileType: "photo",
    },
    {
        id: 2,
        thumbnail: "/mock/Global/images/windows_bg.jpg",
        fileType: "photo",
    },
    {
        id: 3,
        thumbnail: "/mock/PetMeeting/images/pet2.jpg",
        fileType: "video",
    },
    {
        id: 4,
        thumbnail: "/mock/Global/images/cat.jpg",
        fileType: "photo",
    },
];

const PetstaBookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Mock 데이터 사용
        setBookmarks(mockPetstaBookmarks);
    }, []);

    const handlePostClick = (postId) => {
        navigate(`/petsta/post/${postId}`);
    };

    return (
        <Box sx={{ bgcolor: "white", minHeight: "100vh", pb: 8 }}>
            <TitleBar name="펫스타 북마크" />

            {/* 이미지 */}
            <Box sx={{ p: 2 }}>
                <Grid container spacing={1.5}>
                    {bookmarks.map((item) => (
                        <Grid item xs={6} key={item.id}>
                            <Box
                                onClick={() => handlePostClick(item.id)}
                                sx={{
                                    position: "relative",
                                    width: "100%",
                                    paddingTop: "100%", // 1:1 비율로 유지
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    mb: 1.5,
                                }}
                            >
                                <Box
                                    component="img"
                                    src={item.thumbnail}
                                    alt="펫스타 이미지"
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                                {item.fileType === "video" && (
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            width: "30px",
                                            height: "30px",
                                            bgcolor: "rgba(0,0,0,0.5)",
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {/* 플레이 버튼 아이콘 */}
                                        <Box
                                            sx={{
                                                width: 0,
                                                height: 0,
                                                borderTop: "8px solid transparent",
                                                borderBottom: "8px solid transparent",
                                                borderLeft: "12px solid white",
                                                ml: "2px",
                                            }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default PetstaBookmarks;
