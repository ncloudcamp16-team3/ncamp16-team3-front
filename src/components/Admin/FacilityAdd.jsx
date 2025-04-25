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
    Typography,
    Snackbar,
    Alert,
    FormControlLabel,
    Switch,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

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

const FacilityAdd = () => {
    // 상태 관리
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
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

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [operationTimeType, setOperationTimeType] = useState("same"); // "same" 또는 "different"
    const [dailyOpenTimes, setDailyOpenTimes] = useState({
        MON: "09:00",
        TUE: "09:00",
        WED: "09:00",
        THU: "09:00",
        FRI: "09:00",
        SAT: "09:00",
        SUN: "09:00",
    });
    const [dailyCloseTimes, setDailyCloseTimes] = useState({
        MON: "18:00",
        TUE: "18:00",
        WED: "18:00",
        THU: "18:00",
        FRI: "18:00",
        SAT: "18:00",
        SUN: "18:00",
    });

    // 요일별 영업 여부 상태 추가
    const [openDays, setOpenDays] = useState({
        MON: true,
        TUE: true,
        WED: true,
        THU: true,
        FRI: true,
        SAT: true,
        SUN: true,
    });

    // 요일별 시간 변경 핸들러
    const handleDailyOpenTimeChange = (day, time) => {
        setDailyOpenTimes((prev) => ({
            ...prev,
            [day]: time,
        }));
    };

    const handleDailyCloseTimeChange = (day, time) => {
        setDailyCloseTimes((prev) => ({
            ...prev,
            [day]: time,
        }));
    };

    // 영업일 토글 핸들러
    const handleDayToggle = (day) => {
        setOpenDays((prev) => ({
            ...prev,
            [day]: !prev[day],
        }));
    };

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
        if (!facilityType) {
            setSnackbarMessage("업종을 선택해주세요");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        if (!facilityName.trim()) {
            setSnackbarMessage("이름을 입력해주세요");
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
        formData.append("facilityName", facilityName.trim());
        formData.append("facilityType", facilityType.toString());
        formData.append("operationTimeType", operationTimeType);

        if (operationTimeType === "same") {
            formData.append("openTime", openTime);
            formData.append("closeTime", closeTime);
        } else {
            // 각 요일별 시간 데이터 추가
            Object.keys(dailyOpenTimes).forEach((day) => {
                formData.append(`openTimes[${day}]`, dailyOpenTimes[day]);
                formData.append(`closeTimes[${day}]`, dailyCloseTimes[day]);
            });
        }

        formData.append("zipCode", zipCode);
        formData.append("baseAddress", baseAddress);
        formData.append("tel", tel.trim());
        formData.append("detailAddress", detailAddress.trim());
        formData.append("content", content.trim());

        imageFiles.forEach((file) => {
            formData.append("images", file);
        });

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
        });

        try {
            const token = localStorage.getItem("adminToken");

            if (!token) {
                navigate("/admin");
                return;
            }

            const response = await fetch("/api/admin/facility/add", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const contentType = response.headers.get("content-type");
            let data;

            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = { message: "응답이 비어있습니다" };
            }

            if (!response.ok) {
                throw new Error(data.message || "업체 등록에 실패했습니다");
            }

            setSnackbarMessage("업체가 성공적으로 등록되었습니다");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);

            setTimeout(() => {
                navigate("/admin/facility/list");
            }, 2000);
        } catch (error) {
            console.error("업체 등록 오류:", error);
            setSnackbarMessage(error.message || "업체 등록 중 오류가 발생했습니다");
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

    // 우편번호 검색 함수
    const handleSearchZipCode = () => {
        // 예시로 임의의 값을 설정
        setZipCode("12345");
        setIsZipCodeFound(true);
        setBaseAddress("서울특별시 강남구 테헤란로..."); // 검색 결과에 따라 기본주소도 설정
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
                                    {/* 이미지 삭제 버튼 - label 밖에 위치 */}
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
                            // 이미지가 없을 때는 원형 컨테이너와 업로드 레이블
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
                            multiple
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

                    {/* 업체명 & 업종 */}
                    <Box sx={{ width: "100%", overflow: "hidden", pt: 1 }}>
                        {/* 왼쪽 그룹: 업종과 업체명 */}
                        <Box sx={{ float: "left", width: "100%" }}>
                            <Grid container spacing={2}>
                                {/* 첫 번째 열: 업종 */}
                                <Grid item xs={12} sm={6} sx={{ width: "20%" }}>
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
                    </Box>

                    {/* 영업 시간 선택 UI */}
                    <Box sx={{ width: "100%", pt: 1 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                            영업 시간 설정
                        </Typography>

                        {/* 영업 시간 타입 선택 버튼 */}
                        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                            <Button
                                variant={operationTimeType === "same" ? "contained" : "outlined"}
                                onClick={() => setOperationTimeType("same")}
                                sx={{
                                    backgroundColor: operationTimeType === "same" ? "#E9B883" : "transparent",
                                    borderColor: "#E9B883",
                                    color: operationTimeType === "same" ? "white" : "#E9B883",
                                    "&:hover": {
                                        backgroundColor:
                                            operationTimeType === "same" ? "#D9A873" : "rgba(233, 184, 131, 0.04)",
                                    },
                                    width: "40%",
                                    height: "50px",
                                }}
                            >
                                매일 같은 시간에 영업해요
                            </Button>
                            <Button
                                variant={operationTimeType === "different" ? "contained" : "outlined"}
                                onClick={() => setOperationTimeType("different")}
                                sx={{
                                    backgroundColor: operationTimeType === "different" ? "#E9B883" : "transparent",
                                    borderColor: "#E9B883",
                                    color: operationTimeType === "different" ? "white" : "#E9B883",
                                    "&:hover": {
                                        backgroundColor:
                                            operationTimeType === "different" ? "#D9A873" : "rgba(233, 184, 131, 0.04)",
                                    },
                                    width: "40%",
                                }}
                            >
                                요일별로 다르게 영업해요
                            </Button>
                        </Box>

                        {/* 선택된 타입에 따라 다른 UI 표시 */}
                        {operationTimeType === "same" ? (
                            // 매일 같은 시간 입력 UI
                            <Box sx={{ display: "flex" }}>
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
                        ) : (
                            // 요일별 다른 시간 입력 UI
                            <Box sx={{ width: "100%" }}>
                                {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
                                    <Box key={day} sx={{ display: "flex", mb: 2, flexDirection: "column" }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={2}>
                                                <Typography variant="body1">
                                                    {day === "MON"
                                                        ? "월요일"
                                                        : day === "TUE"
                                                          ? "화요일"
                                                          : day === "WED"
                                                            ? "수요일"
                                                            : day === "THU"
                                                              ? "목요일"
                                                              : day === "FRI"
                                                                ? "금요일"
                                                                : day === "SAT"
                                                                  ? "토요일"
                                                                  : "일요일"}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={openDays[day]}
                                                            onChange={() => handleDayToggle(day)}
                                                            color="primary"
                                                            sx={{
                                                                "& .MuiSwitch-switchBase.Mui-checked": {
                                                                    color: "#E9B883",
                                                                    "&:hover": {
                                                                        backgroundColor: "rgba(233, 184, 131, 0.08)",
                                                                    },
                                                                },
                                                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                                                    {
                                                                        backgroundColor: "#E9B883",
                                                                    },
                                                            }}
                                                        />
                                                    }
                                                    label={openDays[day] ? "영업일" : "휴무일"}
                                                />
                                            </Grid>
                                        </Grid>

                                        {/* 영업일인 경우에만 시간 설정 UI 표시 */}
                                        {openDays[day] && (
                                            <Grid container spacing={2} sx={{ mt: 1, ml: 1 }}>
                                                <Grid item xs={5}>
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <Box sx={{ minWidth: "70px", mr: 1, flexShrink: 0 }}>
                                                            오픈시각
                                                        </Box>
                                                        <FormControl size="medium" fullWidth sx={{ minWidth: "180px" }}>
                                                            <Select
                                                                value={dailyOpenTimes[day]}
                                                                onChange={(e) =>
                                                                    handleDailyOpenTimeChange(day, e.target.value)
                                                                }
                                                                displayEmpty
                                                            >
                                                                {Array.from({ length: 24 }).map((_, i) => (
                                                                    <MenuItem
                                                                        key={i}
                                                                        value={`${String(i).padStart(2, "0")}:00`}
                                                                    >
                                                                        {`${String(i).padStart(2, "0")}:00`}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={5}>
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <Box sx={{ minWidth: "70px", mr: 1, flexShrink: 0 }}>
                                                            마감시각
                                                        </Box>
                                                        <FormControl size="medium" fullWidth sx={{ minWidth: "180px" }}>
                                                            <Select
                                                                value={dailyCloseTimes[day]}
                                                                onChange={(e) =>
                                                                    handleDailyCloseTimeChange(day, e.target.value)
                                                                }
                                                                displayEmpty
                                                            >
                                                                {Array.from({ length: 24 }).map((_, i) => (
                                                                    <MenuItem
                                                                        key={i}
                                                                        value={`${String(i).padStart(2, "0")}:00`}
                                                                    >
                                                                        {`${String(i).padStart(2, "0")}:00`}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        )}
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
                    <Box sx={{ display: "flex", gap: 5, height: "50px" }}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                backgroundColor: "#E9B883",
                                "&:hover": {
                                    backgroundColor: "#D9A873",
                                },
                                width: "50%",
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

export default FacilityAdd;
