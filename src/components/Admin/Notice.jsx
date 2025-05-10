import React, { useState, useRef } from "react";
import {
    Box,
    TextField,
    Button,
    Grid,
    styled,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    Snackbar,
    Alert,
    Typography,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import adminAxios from "./adminAxios.js";

// 스타일된 컴포넌트
const ImageUploadButton = styled("label")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
}));

// 이미지가 없을 때 원형 컨테이너
const CircleImageContainer = styled(Box)(({ theme }) => ({
    width: 300,
    height: 300,
    borderRadius: "50%",
    backgroundColor: "#f5f5f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing(1),
    overflow: "hidden",
}));

// 이미지가 있을 때 사각형 컨테이너
const SquareImageContainer = styled(Box)(({ theme }) => ({
    width: 300,
    height: 300,
    backgroundColor: "#f5f5f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing(1),
    overflow: "hidden",
    position: "relative", // 삭제 버튼의 절대 위치 지정을 위해 추가
}));

// 이미지 삭제 버튼 컨테이너
const DeleteButtonContainer = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 10,
}));

const MAX_IMAGES = 5;

const Notice = () => {
    // 상태 관리
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [boardTypeId, setBoardTypeId] = useState("");
    const fileInputRef = useRef(null);

    // 추가 state들
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 이미지 업로드 핸들러
    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);

        // 현재 이미지 수 + 새로 선택한 이미지 수가 최대치를 넘는지 확인
        if (imageFiles.length + files.length > MAX_IMAGES) {
            setSnackbarMessage(`최대 ${MAX_IMAGES}개의 이미지만 업로드할 수 있습니다`);
            setSnackbarSeverity("warning");
            setOpenSnackbar(true);

            // 입력 초기화
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            return;
        }

        if (files.length > 0) {
            // 기존 파일과 합치기
            const newFiles = [...imageFiles, ...files];
            setImageFiles(newFiles);

            // 미리보기 생성
            const previews = files.map((file) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result);
                    };
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(previews).then((results) => {
                setImagePreviews([...imagePreviews, ...results]);
            });
        }

        // 입력 초기화
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // 이미지 삭제 핸들러
    const handleImageDelete = (index) => {
        const newFiles = [...imageFiles];
        const newPreviews = [...imagePreviews];

        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);

        setImageFiles(newFiles);
        setImagePreviews(newPreviews);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // 폼 제출 핸들러
    const handleSubmit = async (event) => {
        event.preventDefault();

        // 유효성 검사
        if (!boardTypeId) {
            setSnackbarMessage("게시판을 선택해주세요");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        if (!title.trim()) {
            setSnackbarMessage("제목을 입력해주세요");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        if (!content.trim()) {
            setSnackbarMessage("내용을 입력해주세요");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        setLoading(true);

        // 폼 데이터 구성
        const formData = new FormData();
        formData.append("boardTypeId", boardTypeId.toString());
        formData.append("title", title.trim());
        formData.append("content", content.trim());

        if (imageFiles && imageFiles.length > 0) {
            imageFiles.forEach((file) => {
                formData.append("images", file);
            });
        }

        try {
            const response = await adminAxios.post("/api/admin/announce/post", formData);

            if (!response.data) {
                throw new Error("응답이 비어있습니다");
            }

            setSnackbarMessage("공지사항이 성공적으로 등록되었습니다");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);

            // 성공 시 1초 후 목록 페이지로 이동
            setTimeout(() => {
                navigate("/admin/board/list");
            }, 1000);
        } catch (error) {
            console.error("공지사항 등록 오류:", error);
            setSnackbarMessage(error.response?.data?.message || "공지사항 등록 중 오류가 발생했습니다");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    // 스낵바 핸들러 추가
    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <Box
            sx={{
                p: 3,
                maxWidth: "90%",
                mx: "auto",
                borderRadius: 2,
                border: "1px solid #cccccc",
                ml: 50,
                mr: 5,
                backgroundColor: "white",
            }}
        >
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={6} sx={{ display: "flex", flexDirection: "column", p: 5 }}>
                    {/* 이미지 업로드 영역 */}
                    <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 2 }}>
                        {imagePreviews.length > 0 ? (
                            // 선택된 이미지들 표시
                            imagePreviews.map((preview, index) => (
                                <SquareImageContainer key={index}>
                                    <Box
                                        component="img"
                                        src={preview}
                                        alt={`미리보기 ${index + 1}`}
                                        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                    <DeleteButtonContainer>
                                        <IconButton
                                            aria-label="delete image"
                                            onClick={() => handleImageDelete(index)}
                                            size="small"
                                            sx={{
                                                backgroundColor: "rgba(255, 255, 255, 0.7)",
                                                "&:hover": {
                                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                                },
                                            }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </DeleteButtonContainer>
                                </SquareImageContainer>
                            ))
                        ) : (
                            // 이미지가 없을 때는 업로드 버튼 표시
                            <ImageUploadButton htmlFor="upload-image">
                                <CircleImageContainer>
                                    <PhotoCameraIcon sx={{ fontSize: 150, color: "#757575" }} />
                                </CircleImageContainer>
                            </ImageUploadButton>
                        )}

                        {/* 추가 업로드 버튼 - 이미지가 있어도 더 추가할 수 있도록 */}
                        {imagePreviews.length > 0 && imagePreviews.length < MAX_IMAGES && (
                            <ImageUploadButton htmlFor="upload-image">
                                <Box
                                    sx={{
                                        width: 300,
                                        height: 300,
                                        border: "2px dashed #ccc",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        "&:hover": {
                                            backgroundColor: "#f5f5f5",
                                        },
                                    }}
                                >
                                    <PhotoCameraIcon sx={{ fontSize: 60, color: "#757575" }} />
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        이미지 추가 ({imagePreviews.length}/{MAX_IMAGES})
                                    </Typography>
                                </Box>
                            </ImageUploadButton>
                        )}

                        {/* 파일 입력 - multiple 속성 추가 */}
                        <input
                            id="upload-image"
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple // 다중 선택 가능하도록
                            onChange={handleImageUpload}
                            style={{ display: "none" }}
                        />
                    </Grid>

                    {/* 이미지 제한 안내 메시지 */}
                    <Grid item xs={12}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ textAlign: "center", display: "block" }}
                        >
                            최대 {MAX_IMAGES}개의 이미지를 업로드할 수 있습니다
                        </Typography>
                    </Grid>

                    {/* 게시판 유형 선택 드롭다운 추가 */}
                    <Grid item xs={12}>
                        <FormControl variant="outlined" sx={{ width: "40%" }}>
                            <InputLabel>게시판 선택</InputLabel>
                            <Select
                                value={boardTypeId}
                                onChange={(e) => setBoardTypeId(e.target.value)}
                                label="게시판 유형"
                            >
                                <MenuItem value={1}>자유게시판</MenuItem>
                                <MenuItem value={2}>중고장터</MenuItem>
                                <MenuItem value={3}>정보게시판</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* 제목 필드 */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="제목"
                            placeholder="제목을 적어주세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            variant="outlined"
                        />
                    </Grid>

                    {/* 상세내용 필드 */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="내용"
                            placeholder="내용을 적어주세요"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            multiline
                            rows={8}
                            variant="outlined"
                        />
                    </Grid>

                    {/* 등록 버튼 */}
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            sx={{
                                mt: 2,
                                backgroundColor: "#e2ccb5",
                                "&:hover": { backgroundColor: "#d4bea7" },
                                color: "#000",
                                width: "300px",
                                fontSize: "large",
                                float: "right",
                                ml: 3,
                            }}
                            onClick={() => window.history.back()}
                        >
                            뒤로
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{
                                mt: 2,
                                backgroundColor: "#E9B883",
                                "&:hover": {
                                    backgroundColor: "#D9A873",
                                },
                                width: "300px",
                                fontSize: "large",
                                float: "right",
                            }}
                        >
                            {loading ? "등록 중..." : "등록"}
                        </Button>
                    </Grid>
                </Grid>

                {/* 스낵바 추가 */}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
};

export default Notice;
