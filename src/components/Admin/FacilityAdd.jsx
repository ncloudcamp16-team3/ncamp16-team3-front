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
import SearchIcon from "@mui/icons-material/Search";

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

const FacilityAdd = () => {
    // 상태 관리
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [facilityName, setFacilityName] = useState("");
    const [facilityType, setFacilityType] = useState("");
    const [openTime, setOpenTime] = useState("09:00");
    const [closeTime, setCloseTime] = useState("18:00");
    const [tel, setTel] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [isZipCodeFound, setIsZipCodeFound] = useState(false);
    const [baseAddress, setBaseAddress] = useState("");
    const [detailAddress, setDetailAddress] = useState("");
    const [content, setContent] = useState("");

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
        event.preventDefault();
        event.stopPropagation();
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // 폼 제출 핸들러
    const handleSubmit = (event) => {
        event.preventDefault();

        // 폼 데이터 구성
        const formData = new FormData();
        formData.append("facilityName", facilityName);
        formData.append("facilityType", facilityType);
        formData.append("openTime", openTime);
        formData.append("closeTime", closeTime);
        formData.append("zipCode", zipCode);
        formData.append("baseAddress", baseAddress);
        formData.append("tel", tel);
        formData.append("detailAddress", detailAddress);
        formData.append("content", content);

        if (imageFile) {
            formData.append("image", imageFile);
        }

        console.log("Form submitted", {
            facilityName,
            facilityType,
            openTime,
            closeTime,
            tel,
            baseAddress,
            zipCode,
            detailAddress,
            content,
            imageFile: imageFile ? imageFile.name : "No image",
        });

        // 여기에 API 호출 로직 추가
    };

    // 우편번호 검색 함수
    const handleSearchZipCode = () => {
        // 예시로 임의의 값을 설정
        setZipCode("12345");
        setIsZipCodeFound(true);
        setBaseAddress("서울특별시 강남구 테헤란로..."); // 검색 결과에 따라 기본주소도 설정
    };

    return (
        <Box sx={{ p: 3, maxWidth: "90%", mx: "auto", borderRadius: 2, border: "1px solid #cccccc", ml: 50, mr: 5 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                {/* 이미지 업로드 영역 */}
                <Box item xs={12} sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
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
                </Box>

                {/* 업체명 & 업종 */}
                <Box sx={{ width: "100%", mb: 3, overflow: "hidden", pt: 1 }}>
                    {/* 왼쪽 그룹: 업종과 업체명 */}
                    <Box sx={{ float: "left", width: "50%" }}>
                        <Grid container spacing={2}>
                            {/* 첫 번째 열: 업종 */}
                            <Grid item xs={12} sm={6} sx={{ width: "30%" }}>
                                <FormControl size="medium" fullWidth>
                                    <InputLabel>업종</InputLabel>
                                    <Select
                                        value={facilityType}
                                        onChange={(e) => setFacilityType(e.target.value)}
                                        label="업종"
                                    >
                                        <MenuItem value="HOTEL">애견호텔</MenuItem>
                                        <MenuItem value="BEAUTY">미용실</MenuItem>
                                        <MenuItem value="CAFE">애견카페</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* 두 번째 열: 업체명 */}
                            <Grid item xs={12} sm={6} sx={{ width: "60%" }}>
                                <TextField
                                    fullWidth
                                    label="업체명"
                                    placeholder="업체명을 적어주세요"
                                    value={facilityName}
                                    onChange={(e) => setFacilityName(e.target.value)}
                                    variant="outlined"
                                    size="medium"
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* 오른쪽 그룹: 오픈시간과 마감시간 */}
                    <Box sx={{ float: "right", width: "50%", display: "flex", justifyContent: "flex-end" }}>
                        <Grid container spacing={2}>
                            {/* 세 번째 열: 오픈시간 */}
                            <Grid item xs={6}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Box sx={{ minWidth: "70px", mr: 1, flexShrink: 0 }}>오픈시각</Box>
                                    <FormControl size="medium" fullWidth sx={{ minWidth: "180px" }}>
                                        <Select
                                            value={openTime}
                                            onChange={(e) => setOpenTime(e.target.value)}
                                            displayEmpty
                                        >
                                            {Array.from({ length: 24 }).map((_, i) => (
                                                <MenuItem key={i} value={`${String(i).padStart(2, "0")}:00`}>
                                                    {`${String(i).padStart(2, "0")}:00`}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>

                            {/* 네 번째 열: 마감시간 */}
                            <Grid item xs={6}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Box sx={{ minWidth: "70px", mr: 1, flexShrink: 0 }}>마감시각</Box>
                                    <FormControl size="medium" fullWidth sx={{ minWidth: "180px" }}>
                                        <Select
                                            value={closeTime}
                                            onChange={(e) => setCloseTime(e.target.value)}
                                            displayEmpty
                                        >
                                            {Array.from({ length: 24 }).map((_, i) => (
                                                <MenuItem key={i} value={`${String(i).padStart(2, "0")}:00`}>
                                                    {`${String(i).padStart(2, "0")}:00`}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                {/* 전화번호, 기본주소, 우편번호, 상세주소 */}
                <Box sx={{ width: "100%", mb: 3, overflow: "hidden", pt: 1 }}>
                    <Box sx={{ float: "left", width: "75%" }}>
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} sm={4} sx={{ width: "20%" }}>
                                {!isZipCodeFound ? (
                                    <Button
                                        variant="contained"
                                        startIcon={<SearchIcon />}
                                        onClick={handleSearchZipCode}
                                        fullWidth
                                        sx={{
                                            height: "56px",
                                            backgroundColor: "#E9B883",
                                            "&:hover": {
                                                backgroundColor: "#D9A873",
                                            },
                                        }}
                                    >
                                        우편번호 찾기
                                    </Button>
                                ) : (
                                    <TextField
                                        fullWidth
                                        label="우편번호"
                                        value={zipCode}
                                        variant="outlined"
                                        size="medium"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        onClick={() => setIsZipCodeFound(false)} // 다시 검색할 수 있도록
                                    />
                                )}
                            </Grid>
                            <Grid item xs={12} sm={4} sx={{ width: "30%" }}>
                                <TextField
                                    fullWidth
                                    label="기본주소"
                                    placeholder="기본주소"
                                    value={baseAddress}
                                    onChange={(e) => setBaseAddress(e.target.value)}
                                    variant="outlined"
                                    size="medium"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} sx={{ width: "45%" }}>
                                <TextField
                                    fullWidth
                                    label="상세주소"
                                    placeholder="상세주소를 적어주세요"
                                    value={detailAddress}
                                    onChange={(e) => setDetailAddress(e.target.value)}
                                    variant="outlined"
                                    size="medium"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ float: "right", width: "20%" }}>
                        <Grid container>
                            <Grid item xs={12} sx={{ width: "100%" }}>
                                <TextField
                                    fullWidth
                                    label="전화번호"
                                    placeholder="전화번호"
                                    value={tel}
                                    onChange={(e) => setTel(e.target.value)}
                                    variant="outlined"
                                    size="medium"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                {/* 상세내용 필드 */}
                <Grid item xs={12} sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        label="상세 내용"
                        placeholder="상세 내용을 적어주세요"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        multiline
                        rows={6}
                        variant="outlined"
                    />
                </Grid>

                {/* 등록 및 뒤로가기 버튼 */}
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            backgroundColor: "#E9B883",
                            "&:hover": {
                                backgroundColor: "#D9A873",
                            },
                            width: "50%",
                            py: 1,
                            fontSize: "1rem",
                            boxShadow: "none",
                        }}
                    >
                        등록
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{
                            borderColor: "#E9B883",
                            color: "#E9B883",
                            "&:hover": {
                                backgroundColor: "rgba(233, 184, 131, 0.04)",
                                borderColor: "#D9A873",
                            },
                            width: "50%",
                            py: 1,
                            fontSize: "1rem",
                            boxShadow: "none",
                        }}
                        onClick={() => {
                            // 뒤로가기 동작
                            window.history.back();
                        }}
                    >
                        뒤로가기
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default FacilityAdd;
