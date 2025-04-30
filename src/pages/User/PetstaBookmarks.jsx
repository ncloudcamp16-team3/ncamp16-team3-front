import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TitleBar from "../../components/Global/TitleBar.jsx";
import { getPetstaBookmarks } from "../../services/bookmarkService.js";

const PetstaBookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                setLoading(true);
                const data = await getPetstaBookmarks();

                // 추가된 디버깅 로그
                console.log("펫스타 북마크 원본 데이터:", data);
                console.log("데이터 타입:", typeof data);
                console.log("데이터 길이:", data.length);
                console.log("첫 번째 항목:", data[0]);

                // 데이터 구조에 따라 조정
                const processedBookmarks = Array.isArray(data) ? data : data.data ? data.data : [];

                console.log("처리된 북마크:", processedBookmarks);

                setBookmarks(processedBookmarks);
            } catch (error) {
                console.error("북마크를 불러오는 중 오류 발생:", error);
                setBookmarks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, []);

    const handlePostClick = (postId) => {
        navigate(`/petsta/post/${postId}`);
    };

    return (
        <Box sx={{ bgcolor: "white", minHeight: "100vh", pb: 8 }}>
            <TitleBar name="펫스타 북마크" />

            {/* 이미지 그리드 */}
            <Box sx={{ p: 2 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                        <CircularProgress size={40} />
                    </Box>
                ) : bookmarks.length > 0 ? (
                    <Grid container spacing={1.5}>
                        {bookmarks.map((item) => {
                            // 디버깅을 위해 로그 추가
                            console.log("렌더링 아이템:", item);

                            return (
                                <Grid item xs={6} key={item.id || item.postId}>
                                    <Box
                                        onClick={() => handlePostClick(item.postId)}
                                        sx={{
                                            position: "relative",
                                            width: "100%",
                                            paddingTop: "100%",
                                            borderRadius: 2,
                                            overflow: "hidden",
                                            cursor: "pointer",
                                            mb: 1.5,
                                            border: "2px solid red", // 테두리 추가
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={item.fileName}
                                            alt="펫스타 이미지"
                                            onError={(e) => {
                                                console.error("이미지 로딩 실패:", item.fileName);
                                                e.target.style.display = "none";
                                                e.target.parentNode.innerHTML = `<div style="width:100%; height:100%; background:lightgray; display:flex; justify-content:center; align-items:center;">이미지 로드 실패</div>`;
                                            }}
                                            sx={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                        {item.fileType === "VIDEO" && (
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
                            );
                        })}
                    </Grid>
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "calc(100vh - 200px)",
                        }}
                    >
                        <Typography variant="subtitle1" color="text.secondary">
                            북마크한 펫스타가 없습니다.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            펫스타에서 북마크를 추가해보세요!
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default PetstaBookmarks;
