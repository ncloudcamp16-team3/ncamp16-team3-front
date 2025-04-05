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
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloseIcon from "@mui/icons-material/Close";

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

const Notice = () => {
    // 상태 관리
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [boardType, setBoardType] = useState("");
    const fileInputRef = useRef(null);

    // 이미지 업로드 핸들러
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            // 이미지 미리보기 URL 생성
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // 이미지 삭제 핸들러
    const handleImageDelete = (event) => {
        event.preventDefault(); // 기본 동작 방지
        event.stopPropagation(); // 이벤트 버블링 방지
        setImageFile(null);
        setImagePreview(null);
        // input 엘리먼트 초기화
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // 폼 제출 핸들러
    const handleSubmit = (event) => {
        event.preventDefault();

        // 폼 데이터 구성
        const formData = new FormData();
        formData.append("boardType", boardType);
        formData.append("title", title);
        formData.append("content", content);
        if (imageFile) {
            formData.append("image", imageFile);
        }

        console.log("Form submitted", {
            boardType,
            title,
            content,
            imageFile: imageFile ? imageFile.name : "No image",
        });

        // 여기에 API 호출 로직 추가
    };

    return (
        <Box sx={{ p: 3, maxWidth: "90%", mx: "auto", borderRadius: 2, border: "1px solid #cccccc", ml: 50, mr: 5 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={6} sx={{ display: "flex", flexDirection: "column", p: 5 }}>
                    {/* 이미지 업로드 영역 */}
                    <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                        {/* 이미지가 있을 때와 없을 때 분리된 UI 구조 */}
                        {imagePreview ? (
                            // 이미지가 있을 때는 사각형 컨테이너 표시
                            <SquareImageContainer>
                                <Box
                                    component="img"
                                    src={imagePreview}
                                    alt="미리보기"
                                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                                {/* 이미지 삭제 버튼 - label 밖에 위치 */}
                                <DeleteButtonContainer>
                                    <IconButton
                                        aria-label="delete image"
                                        onClick={handleImageDelete}
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
                        ) : (
                            // 이미지가 없을 때는 원형 컨테이너와 업로드 레이블
                            <ImageUploadButton htmlFor="upload-image">
                                <CircleImageContainer>
                                    <PhotoCameraIcon sx={{ fontSize: 150, color: "#757575" }} />
                                </CircleImageContainer>
                            </ImageUploadButton>
                        )}
                        {/* 파일 입력은 항상 존재하지만 숨겨져 있음 */}
                        <input
                            id="upload-image"
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: "none" }}
                        />
                    </Grid>

                    {/* 게시판 유형 선택 드롭다운 추가 */}
                    <Grid item xs={12}>
                        <FormControl variant="outlined" sx={{ width: "40%" }}>
                            <InputLabel>게시판 선택</InputLabel>
                            <Select
                                value={boardType}
                                onChange={(e) => setBoardType(e.target.value)}
                                label="게시판 유형"
                            >
                                <MenuItem value="자유게시판">자유게시판</MenuItem>
                                <MenuItem value="질문게시판">질문게시판</MenuItem>
                                <MenuItem value="정보게시판">정보게시판</MenuItem>
                                <MenuItem value="중고장터">중고장터</MenuItem>
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
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 2,
                                backgroundColor: "#E9B883",
                                "&:hover": {
                                    backgroundColor: "#D9A873",
                                },
                                width: "500px",
                                float: "right",
                                fontSize: "large",
                            }}
                        >
                            등록
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Notice;
