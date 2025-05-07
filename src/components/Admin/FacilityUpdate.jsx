import React, { useState, useRef, useEffect } from "react";
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
    CircularProgress,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useParams } from "react-router-dom";
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

const FacilityUpdate = () => {
    // URL 파라미터에서 시설 ID 가져오기
    const { id } = useParams();
    const navigate = useNavigate();

    // 상태 관리
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [name, setName] = useState("");
    const [facilityTypeId, setFacilityTypeId] = useState("");
    const [openTime, setOpenTime] = useState("09:00");
    const [closeTime, setCloseTime] = useState("18:00");
    const [tel, setTel] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [isZipCodeFound, setIsZipCodeFound] = useState(false);
    const [address, setAddress] = useState("");
    const [detailAddress, setDetailAddress] = useState("");
    const [comment, setComment] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [existingImages, setExistingImages] = useState([]);
    const [existingImageIds, setExistingImageIds] = useState([]);
    const [loading, setLoading] = useState(true);

    const fileInputRef = useRef(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [mapScriptLoaded, setMapScriptLoaded] = useState(false);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [submitLoading, setSubmitLoading] = useState(false);

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

    // 문자열 타입을 ID로 매핑하는 객체
    const facilityTypeMapping = {
        HOTEL: 1,
        BEAUTY: 2,
        CAFE: 3,
    };

    // 기존 시설 데이터 불러오기
    const loadFacilityData = async () => {
        try {
            setLoading(true);
            const response = await adminAxios.get(`/api/admin/facility/${id}`);

            if (!response.data) {
                throw new Error("시설 정보를 불러오는데 실패했습니다");
            }

            const facility = response.data;
            console.log("시설 정보:", facility);

            const typeId = facilityTypeMapping[facility.facilityType] || "";

            // 기본 정보 설정
            setName(facility.name || "");
            setFacilityTypeId(typeId);
            setTel(facility.tel || "");
            setAddress(facility.address || "");
            setDetailAddress(facility.detailAddress || "");
            setComment(facility.comment || "");
            setLatitude(facility.latitude);
            setLongitude(facility.longitude);

            // console.log("latitude: " + latitude);
            // console.log("longitude: " + longitude);

            // 이미지 처리 (예외 처리 수정)
            if (facility.imagePaths && Array.isArray(facility.imagePaths)) {
                console.log("이미지 데이터:", facility.imagePaths);

                // 이미지 URL 설정
                setExistingImages(facility.imagePaths);

                // URL에서 파일 경로만 추출 (물음표 이전 부분)
                const filePathsOnly = facility.imagePaths
                    .map((url) => {
                        const pathOnly = url.split("?")[0]; // URL 쿼리 파라미터 제거

                        // 파일 경로만 추출 (예: uploads/facility/file.jpg)
                        const pathMatch = pathOnly.match(/uploads\/facility\/([^\/]+)$/);
                        if (pathMatch && pathMatch[1]) {
                            return pathMatch[1]; // 파일명만 추출
                        }
                        return null;
                    })
                    .filter((path) => path !== null);

                // 이미지 ID 설정
                setExistingImageIds(filePathsOnly);
                console.log("추출된 파일 경로: " + filePathsOnly);
            } else {
                console.warn("이미지 데이터가 없거나 배열이 아님:", facility.imagePaths);
                setExistingImages([]);
                setExistingImageIds([]);
            }

            // 영업 시간 처리
            if (facility.openingHours) {
                // 모든 요일의 시간이 같은지 확인
                const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

                // 영업일인 요일만 필터링
                const openDays = days.filter((day) => facility.openingHours[day] && facility.openingHours[day].isOpen);

                // 각 요일별 오픈 및 마감 시간 추출
                const openTimes = {};
                const closeTimes = {};
                const dayOpenStatus = {};

                days.forEach((day) => {
                    const dayData = facility.openingHours[day];
                    // isOpen 여부 설정
                    dayOpenStatus[day] = dayData ? dayData.isOpen : false;

                    // 영업 시간 설정 (null 체크 및 시간 포맷 처리)
                    if (dayData && dayData.isOpen) {
                        openTimes[day] = dayData.openTime ? dayData.openTime.substring(0, 5) : "09:00";
                        closeTimes[day] = dayData.closeTime ? dayData.closeTime.substring(0, 5) : "18:00";
                    } else {
                        // 휴무일 기본값
                        openTimes[day] = "09:00";
                        closeTimes[day] = "18:00";
                    }
                });

                // 모든 영업일의 시간이 동일한지 확인
                const uniqueOpenTimes = [...new Set(openDays.map((day) => openTimes[day]))];
                const uniqueCloseTimes = [...new Set(openDays.map((day) => closeTimes[day]))];

                if (uniqueOpenTimes.length == 1 && uniqueCloseTimes.length == 1 && openDays.length == 7) {
                    // 모든 요일 동일한 시간
                    setOperationTimeType("same");
                    setOpenTime(uniqueOpenTimes[0]);
                    setCloseTime(uniqueCloseTimes[0]);
                } else {
                    // 요일별 다른 시간
                    setOperationTimeType("different");
                    setDailyOpenTimes(openTimes);
                    setDailyCloseTimes(closeTimes);
                    setOpenDays(dayOpenStatus);
                }
            } else {
                // openingHours가 없는 경우 기본값
                setOperationTimeType("same");
                setOpenTime("09:00");
                setCloseTime("18:00");
            }

            // 주소가 있으면 우편번호 검색됨 상태로 설정
            if (facility.address) {
                setIsZipCodeFound(true);
            }
        } catch (error) {
            console.error("시설 정보 불러오기 실패: ", error);
            setSnackbarMessage("시설 정보를 불러오는데 실패했습니다");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 시설 정보 불러오기
        loadFacilityData();

        // 우편번호 스크립트 로드
        const loadPostcodeScript = () => {
            return new Promise((resolve) => {
                const script = document.querySelector("script[src*='daum.postcode']");
                if (script) {
                    // console.log("우편번호 스크립트 이미 로드됨");
                    setScriptLoaded(true);
                    resolve();
                    return;
                }

                // console.log("우편번호 스크립트 로드 시작");
                const postcodeScript = document.createElement("script");
                postcodeScript.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
                postcodeScript.async = true;
                postcodeScript.onload = () => {
                    // console.log("우편번호 스크립트 로드 완료");
                    setScriptLoaded(true);
                    resolve();
                };

                document.body.appendChild(postcodeScript);
            });
        };

        // 카카오 맵 스크립트 로드
        const loadKakaoMapScript = () => {
            return new Promise((resolve) => {
                // console.log("카카오맵 스크립트 로드 시작");

                // 이미 로드된 스크립트가 있는지 확인
                const existingScript = document.querySelector("script[src*='kakao.maps.api']");
                if (existingScript) {
                    // console.log("카카오맵 스크립트 이미 로드됨");
                    if (window.kakao && window.kakao.maps) {
                        // console.log("카카오맵 객체 이미 초기화됨");
                        setMapScriptLoaded(true);
                        resolve();
                    } else {
                        // console.log("카카오맵 객체 초기화 대기중...");
                        const checkKakaoInterval = setInterval(() => {
                            if (window.kakao && window.kakao.maps) {
                                // console.log("카카오맵 객체 초기화 확인됨");
                                clearInterval(checkKakaoInterval);
                                setMapScriptLoaded(true);
                                resolve();
                            }
                        }, 100);
                    }
                    return;
                }

                // 스크립트 새로 로드
                const kakaoScript = document.createElement("script");
                kakaoScript.src =
                    "//dapi.kakao.com/v2/maps/sdk.js?appkey=7ac55a0491ab1e4fb8a487b6d212f9bd&libraries=services";
                kakaoScript.async = true;

                kakaoScript.onload = () => {
                    // console.log("카카오맵 스크립트 로드 완료");

                    // kakao 객체가 초기화될 때까지 대기
                    const checkKakaoInterval = setInterval(() => {
                        if (window.kakao && window.kakao.maps) {
                            // console.log("카카오맵 객체 초기화 완료");
                            clearInterval(checkKakaoInterval);
                            setMapScriptLoaded(true);
                            resolve();
                        }
                    }, 100);
                };

                document.body.appendChild(kakaoScript);
            });
        };

        // 순차적으로 스크립트 로드
        loadPostcodeScript()
            .then(() => loadKakaoMapScript())
            .catch((err) => {
                console.error("스크립트 로드 오류:", err);
            });
    }, [id]);

    // 주소를 좌표로 변환
    const convertAddressToCoords = (address) => {
        return new Promise((resolve) => {
            if (!address) {
                // console.log("주소가 없음");
                resolve(false);
                return;
            }

            // 지도 스크립트가 로드될 때까지 대기
            const waitForMapScript = () => {
                if (window.kakao && window.kakao.maps) {
                    setMapScriptLoaded(true);
                    return true;
                }
                return false;
            };

            const attemptGeocode = () => {
                let attempts = 0;

                const tryGeocode = () => {
                    if (attempts >= 20) {
                        // console.log("좌표 변환 시도 횟수 초과");
                        setSnackbarMessage("주소 좌표 변환에 실패했습니다. 다시 시도해주세요.");
                        setSnackbarSeverity("error");
                        setOpenSnackbar(true);
                        resolve(false);
                        return;
                    }

                    attempts++;

                    if (!waitForMapScript()) {
                        // console.log(`좌표 변환 대기 중... (${attempts}/20)`);
                        setTimeout(tryGeocode, 100);
                        return;
                    }

                    try {
                        const geocoder = new window.kakao.maps.services.Geocoder();

                        geocoder.addressSearch(address, (result, status) => {
                            if (status === window.kakao.maps.services.Status.OK) {
                                const lat = result[0].y;
                                const lng = result[0].x;

                                // console.log(`주소 변환 성공: 위도=${lat}, 경도=${lng}`);

                                setLatitude(lat);
                                setLongitude(lng);
                                resolve(true);
                            } else {
                                console.error("주소 변환 실패:", status);
                                setSnackbarMessage("주소를 좌표로 변환하는데 실패했습니다.");
                                setSnackbarSeverity("error");
                                setOpenSnackbar(true);
                                resolve(false);
                            }
                        });
                    } catch (error) {
                        console.error("Geocoder 에러:", error);
                        setSnackbarMessage("좌표 변환 중 오류가 발생했습니다.");
                        setSnackbarSeverity("error");
                        setOpenSnackbar(true);
                        resolve(false);
                    }
                };

                tryGeocode();
            };

            attemptGeocode();
        });
    };

    // 우편번호 검색 함수
    const handleSearchZipCode = async () => {
        if (!scriptLoaded) {
            setSnackbarMessage("주소 검색 서비스를 로드 중입니다. 잠시 후 다시 시도해주세요.");
            setSnackbarSeverity("warning");
            setOpenSnackbar(true);
            return;
        }

        // Daum 우편번호 서비스 실행
        new window.daum.Postcode({
            oncomplete: async function (data) {
                // 도로명 주소 변수
                let roadAddr = data.roadAddress;
                let extraRoadAddr = "";

                // 주소 정보 설정
                if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
                    extraRoadAddr += data.bname;
                }
                if (data.buildingName !== "" && data.apartment === "Y") {
                    extraRoadAddr += extraRoadAddr !== "" ? ", " + data.buildingName : data.buildingName;
                }
                if (extraRoadAddr !== "") {
                    extraRoadAddr = " (" + extraRoadAddr + ")";
                }

                // 우편번호와 주소 정보 설정
                setZipCode(data.zonecode);
                setAddress(roadAddr);
                setIsZipCodeFound(true);

                // 주소를 좌표로 변환
                // console.log("좌표 변환 시작...");
                const success = await convertAddressToCoords(roadAddr);
                // console.log("좌표 변환 결과:", success);
            },
        }).open();
    };

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
        if (imageFiles.length + existingImages.length + files.length > MAX_IMAGES) {
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
        if (index < existingImages.length) {
            // 기존 이미지 삭제
            const updateImages = [...existingImages];
            const removedImage = updateImages.splice(index, 1)[0];
            setExistingImages(updateImages);

            const match = removedImage.match(/\/(\d+)\.(jpg|png|jpeg|gif)$/i);
            if (match) {
                const idToRemove = parseInt(match[1], 10);
                setExistingImageIds((prev) => prev.filter((id) => id !== idToRemove));
            }
        } else {
            // 새 이미지 삭제
            const adjustedIndex = index - existingImages.length;

            const newFiles = [...imageFiles];
            const newPreviews = [...imagePreviews];

            newFiles.splice(adjustedIndex, 1);
            newPreviews.splice(adjustedIndex, 1);

            setImageFiles(newFiles);
            setImagePreviews(newPreviews);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // 기존 이미지 삭제 핸들러
    const handleExistingImageDelete = (index) => {
        const newExistingImages = [...existingImages];
        const newExistingImageIds = [...existingImageIds];

        newExistingImages.splice(index, 1);
        newExistingImageIds.splice(index, 1);

        setExistingImages(newExistingImages);
        setExistingImageIds(newExistingImageIds);
    };

    // 폼 제출 핸들러
    const handleSubmit = async (event) => {
        event.preventDefault();

        // 유효성 검사
        if (!facilityTypeId) {
            setSnackbarMessage("업종을 선택해주세요");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        if (!name.trim()) {
            setSnackbarMessage("이름을 입력해주세요");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        if (!comment.trim()) {
            setSnackbarMessage("내용을 입력해주세요");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        // 위도/경도 확인
        if (!latitude || !longitude) {
            console.log("위도/경도 누락:", { latitude, longitude, address });

            // 주소가 있으면 좌표 변환 재시도
            if (address) {
                setSnackbarMessage("주소 좌표를 얻는 중입니다...");
                setSnackbarSeverity("info");
                setOpenSnackbar(true);

                const success = await convertAddressToCoords(address);

                if (!success || !latitude || !longitude) {
                    setSnackbarMessage("주소 좌표를 얻을 수 없습니다. 주소를 다시 확인해주세요.");
                    setSnackbarSeverity("error");
                    setOpenSnackbar(true);
                    return;
                }
            } else {
                setSnackbarMessage("유효한 주소를 입력해주세요");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
                return;
            }
        }

        setSubmitLoading(true);

        // 폼 데이터 구성
        const facilityData = {
            facilityTypeId: facilityTypeId,
            name: name.trim(),
            tel: tel.trim(),
            address: address.trim(),
            detailAddress: detailAddress.trim(),
            comment: comment.trim(),
            latitude: latitude,
            longitude: longitude,
            openTimes:
                operationTimeType === "same"
                    ? {
                          MON: openTime,
                          TUE: openTime,
                          WED: openTime,
                          THU: openTime,
                          FRI: openTime,
                          SAT: openTime,
                          SUN: openTime,
                      }
                    : dailyOpenTimes,
            closeTimes:
                operationTimeType === "same"
                    ? {
                          MON: closeTime,
                          TUE: closeTime,
                          WED: closeTime,
                          THU: closeTime,
                          FRI: closeTime,
                          SAT: closeTime,
                          SUN: closeTime,
                      }
                    : dailyCloseTimes,
            openDays:
                operationTimeType === "same"
                    ? {
                          MON: true,
                          TUE: true,
                          WED: true,
                          THU: true,
                          FRI: true,
                          SAT: true,
                          SUN: true,
                      }
                    : openDays,
        };

        // FormData 객체 생성
        const formData = new FormData();

        // JSON 데이터를 Blob으로 변환하여 추가
        const dataBlob = new Blob([JSON.stringify(facilityData)], { type: "application/json" });
        formData.append("data", dataBlob);

        // 이미지 처리
        // 1. 새 이미지 파일 추가
        if (imageFiles.length > 0) {
            imageFiles.forEach((file) => {
                formData.append("newImages", file);
            });
        }

        // 유지할 이미지 ID 추가
        console.log("existingImageIds (원본):", existingImageIds);

        // 이미지 ID가 있는 경우만 추가
        if (existingImageIds.length > 0) {
            // 문자열로 직접 폼데이터에 추가
            formData.append("imageIdsToKeep", JSON.stringify(existingImageIds));
            console.log("유지할 이미지 ID 추가됨:", JSON.stringify(existingImageIds));
        } else {
            // 빈 배열이라도 명시적으로 추가 (서버에서 null 대신 빈 배열로 받게)
            formData.append("imageIdsToKeep", JSON.stringify([]));
            console.log("유지할 이미지 ID가 없어 빈 배열 추가됨");
        }

        try {
            for (let [key, value] of formData.entries()) {
                console.log(
                    `FormData 항목 - ${key}:`,
                    key === "data" ? "(JSON Blob)" : key === "newImages" ? "(파일)" : value
                );
            }

            const response = await adminAxios.patch(`/api/admin/facility/${id}/update`, formData);

            if (response.status !== 200) {
                throw new Error(response.data.message || "업체 수정에 실패했습니다");
            }

            console.log("업데이트 응답: ", response.data);

            setSnackbarMessage("업체가 성공적으로 수정되었습니다");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);

            setTimeout(() => {
                navigate(`/admin/facility/list/${id}`);
            }, 1000);
        } catch (error) {
            console.error("업체 수정 오류:", error);

            const errorMessage = error.response?.data?.message || error.message || "업체 수정 중 오류가 발생했습니다";

            setSnackbarMessage(errorMessage || "업체 수정 중 오류가 발생했습니다");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        } finally {
            setSubmitLoading(false);
        }
    };

    // 스낵바 핸들러
    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
    };

    // 로딩 중이면 로딩 화면 표시
    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>시설 정보를 불러오는 중...</Typography>
            </Box>
        );
    }

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
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            시설 이미지
                        </Typography>

                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
                            {/* 기존 이미지 표시 */}
                            {existingImages.map((image, index) => (
                                <SquareImageContainer key={`existing-${index}`}>
                                    <Box
                                        component="img"
                                        src={image}
                                        alt={`기존 이미지 ${index + 1}`}
                                        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                    <DeleteButtonContainer>
                                        <IconButton
                                            aria-label="delete image"
                                            onClick={() => handleExistingImageDelete(index)}
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
                            ))}

                            {/* 새로 업로드한 이미지 미리보기 */}
                            {imagePreviews.map((preview, index) => (
                                <SquareImageContainer key={`new-${index}`}>
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
                            ))}

                            {/* 이미지 추가 버튼 */}
                            {existingImages.length + imagePreviews.length < MAX_IMAGES && (
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
                                            이미지 추가 ({existingImages.length + imagePreviews.length}/{MAX_IMAGES})
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
                        </Box>

                        {/* 이미지 제한 안내 메시지 */}
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ textAlign: "center", display: "block", mb: 3 }}
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
                                <Grid item xs={12} sm={6} sx={{ width: "10%" }}>
                                    <FormControl size="medium" fullWidth>
                                        <InputLabel>업종</InputLabel>
                                        <Select
                                            value={facilityTypeId}
                                            onChange={(e) => setFacilityTypeId(e.target.value)}
                                            label="업종"
                                        >
                                            <MenuItem value={1}>애견호텔</MenuItem>
                                            <MenuItem value={2}>미용실</MenuItem>
                                            <MenuItem value={3}>애견카페</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} sx={{ width: "40%" }}>
                                    <TextField
                                        fullWidth
                                        label="업체 전화번호"
                                        placeholder="01012341234"
                                        value={tel}
                                        onChange={(e) => {
                                            const onlyNums = e.target.value.replace(/\D/g, ""); // 숫자만 필터
                                            if (onlyNums.length <= 11) {
                                                setTel(onlyNums);
                                            }
                                        }}
                                        variant="outlined"
                                        size="medium"
                                    />
                                </Grid>

                                {/* 두 번째 열: 업체명 */}
                                <Grid item xs={12} sm={6} sx={{ width: "100%" }}>
                                    <TextField
                                        fullWidth
                                        label="업체명"
                                        placeholder="업체명을 적어주세요"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
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
                                    width: "50%",
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
                                    width: "50%",
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
                                    <Box key={day} sx={{ display: "flex", mb: 2, height: "60px" }}>
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

                                            {/* 영업일/휴무일 스위치 */}
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

                                            {/* 영업일인 경우에만 시간 설정 UI 표시 */}
                                            {openDays[day] && (
                                                <Grid item xs={4}>
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
                                            )}

                                            {openDays[day] && (
                                                <Grid item xs={4}>
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
                                            )}
                                        </Grid>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>

                    <Grid container spacing={2} sx={{ height: "auto", flexWrap: "wrap" }}>
                        <Grid item xs={12} sm={2}>
                            {!isZipCodeFound ? (
                                <Button
                                    variant="contained"
                                    startIcon={<SearchIcon />}
                                    onClick={handleSearchZipCode}
                                    fullWidth
                                    disabled={!scriptLoaded}
                                    sx={{
                                        height: "57px",
                                        backgroundColor: "#E9B883",
                                        "&:hover": {
                                            backgroundColor: "#D9A873",
                                        },
                                    }}
                                >
                                    {scriptLoaded ? "우편번호 찾기" : "주소검색 로딩중..."}
                                </Button>
                            ) : (
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setZipCode("");
                                            setAddress("");
                                            setDetailAddress("");
                                            setIsZipCodeFound(false);
                                        }}
                                        sx={{
                                            minWidth: "40px",
                                            height: "57px",
                                            borderColor: "#E9B883",
                                            color: "#E9B883",
                                            "&:hover": {
                                                backgroundColor: "rgba(233, 184, 131, 0.04)",
                                                borderColor: "#D9A873",
                                            },
                                        }}
                                    >
                                        <CloseIcon />
                                    </Button>
                                </Box>
                            )}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="기본주소"
                                placeholder="기본주소"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                variant="outlined"
                                size="medium"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <TextField
                                fullWidth
                                label="상세주소"
                                placeholder="상세주소를 적어주세요"
                                value={detailAddress}
                                onChange={(e) => setDetailAddress(e.target.value)}
                                variant="outlined"
                                size="medium"
                                sx={{ width: "400px" }}
                            />
                        </Grid>
                    </Grid>

                    {/* 상세내용 필드 */}
                    <Grid item xs={12} sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            label="상세 내용"
                            placeholder="상세 내용을 적어주세요"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
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
                            disabled={submitLoading}
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
                            {submitLoading ? (
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                                    수정 중...
                                </Box>
                            ) : (
                                "수정"
                            )}
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
                                navigate(`/admin/facility/list/${id}`);
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

export default FacilityUpdate;
