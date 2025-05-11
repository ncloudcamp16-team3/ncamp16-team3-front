import React, { useState, useEffect, useContext, useRef } from "react";
import { Box, Typography, Link, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/Context.jsx";
// 모달 컴포넌트
import { WithdrawalModal, NicknameEditModal } from "./MyModal";
import PetSitterQuitModal from "../../components/User/PetSitterQuitModal";
import ProfileImageModal from "../../components/User/Profile/ProfileImageEditModal";
// 섹션 컴포넌트
import UserProfileSection from "../../components/User/Profile/UserProfileSection";
import PetListSection from "../../components/User/Profile/PetListSection";
import PetSitterSection from "../../components/User/Profile/PetSitterSection";
// 전역 컴포넌트
import GlobalSnackbar from "../../components/Global/GlobalSnackbar";
import GlobalConfirmModal from "../../components/Global/GlobalConfirmModal";
// axios 인스턴스
import instance from "../../services/axiosInstance.js";

const MyPage = () => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [sitterStatus, setSitterStatus] = useState({
        registered: false,
        isPending: false,
        isHold: false,
        status: "NOT_REGISTERED",
    });
    const { user, setUser, nc } = useContext(Context);
    const [hover, setHover] = useState({});

    // 모달 상태
    const [openWithdrawalModal, setOpenWithdrawalModal] = useState(false);
    const [openNicknameModal, setOpenNicknameModal] = useState(false);
    const [openQuitPetsitterModal, setOpenQuitPetsitterModal] = useState(false);
    const [openProfileImageModal, setOpenProfileImageModal] = useState(false);
    const [withdrawalInput, setWithdrawalInput] = useState("");

    // 반려동물 삭제 확인 모달 상태 추가
    const [petDeleteConfirmModal, setPetDeleteConfirmModal] = useState({
        open: false,
        petId: null,
    });

    // 로딩 및 오류 상태
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 스낵바 상태
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    // 파일 입력 참조
    const fileInputRef = useRef(null);

    // 마이페이지 데이터 가져오기
    useEffect(() => {
        const fetchMyPageData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // 사용자 정보 API 호출
                // console.log("마이페이지 ");
                const response = await instance.get("/user/mypage");
                // console.log("마이페이지 응답 데이터:", response.data);

                // API에서 받아온 데이터로 상태 업데이트
                if (response.data) {
                    setUser((prevUser) => ({
                        ...prevUser,
                        nickname: response.data.nickname,
                        photo: response.data.profileImageUrl,
                        id: response.data.userId,
                        path: response.data.profileImageUrl,
                    }));

                    // 반려동물 정보 처리
                    if (response.data.pets && Array.isArray(response.data.pets)) {
                        const petsWithProfiles = response.data.pets.map((pet) => {
                            // 프로필 이미지 URL 찾기 로직 개선
                            let profileImageUrl = null;

                            // 1. 사진 정보가 photos 배열로 제공되는 경우
                            if (pet.photos && Array.isArray(pet.photos) && pet.photos.length > 0) {
                                // 우선 썸네일 사진을 찾음
                                const thumbnailPhoto = pet.photos.find((photo) => photo.thumbnail);

                                if (thumbnailPhoto) {
                                    profileImageUrl = thumbnailPhoto.path;
                                } else {
                                    // 썸네일이 없으면 첫 번째 사진 사용
                                    profileImageUrl = pet.photos[0].path;
                                }
                            }
                            // 2. profileImageUrl 필드가 직접 제공되는 경우
                            else if (pet.profileImageUrl) {
                                profileImageUrl = pet.profileImageUrl;
                            }
                            // 3. petPhotoUrls 배열이 제공되는 경우
                            else if (
                                pet.petPhotoUrls &&
                                Array.isArray(pet.petPhotoUrls) &&
                                pet.petPhotoUrls.length > 0
                            ) {
                                profileImageUrl = pet.petPhotoUrls[0];
                            }

                            return {
                                ...pet,
                                profileImageUrl: profileImageUrl,
                                type: pet.type || pet.petType?.name || "",
                                gender: pet.gender || "정보 없음",
                                birth: pet.birth || pet.birthDate || "",
                                weight: pet.weight || 0,
                                name: pet.name || "",
                                introduction: pet.introduction || pet.info || "",
                                isNeutered: pet.isNeutered !== undefined ? pet.isNeutered : pet.neutered,
                            };
                        });

                        setPets(petsWithProfiles);
                    } else {
                        setPets([]);
                    }

                    // 펫시터 상태 확인
                    if (response.data.petSitterStatus) {
                        setSitterStatus({
                            registered: response.data.petSitterStatus === "APPROVE",
                            isPending: response.data.petSitterStatus === "NONE",
                            isHold: response.data.petSitterStatus === "PENDING",
                            status: response.data.petSitterStatus,
                            age: response.data.petSitterInfo?.age,
                            petType: response.data.petSitterInfo?.petType,
                            petTypesFormatted: response.data.petSitterInfo?.petTypesFormatted,
                            petCount: response.data.petSitterInfo?.petCount,
                            houseType: response.data.petSitterInfo?.houseType,
                            experience: response.data.petSitterInfo?.sitterExp,
                            comment: response.data.petSitterInfo?.comment,
                            image: response.data.petSitterInfo?.imagePath,
                        });
                    } else {
                        setSitterStatus({
                            registered: false,
                            isPending: false,
                            isHold: false,
                            status: "NOT_REGISTERED",
                        });
                    }
                }
            } catch (err) {
                console.error("마이페이지 데이터 로드 실패:", err);
                console.error("에러 상세:", err.response || err.message);

                if (err.response && err.response.status === 401) {
                    setError("로그인이 필요합니다.");
                    setSnackbar({
                        open: true,
                        message: "로그인이 필요합니다. 로그인 페이지로 이동합니다.",
                        severity: "error",
                    });
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                } else {
                    setError("마이페이지 정보를 불러오는데 실패했습니다.");
                    setSnackbar({
                        open: true,
                        message: "마이페이지 정보를 불러오는데 실패했습니다.",
                        severity: "error",
                    });
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyPageData();

        // 펫시터 등록 이벤트 리스너 추가
        const handlePetSitterRegistered = (event) => {
            setSitterStatus({
                registered: true,
                ...event.detail.info,
            });
        };

        window.addEventListener("petSitterRegistered", handlePetSitterRegistered);

        return () => {
            window.removeEventListener("petSitterRegistered", handlePetSitterRegistered);
        };
    }, [setUser, navigate]);

    // 스낵바 닫기 핸들러
    const handleSnackbarClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    // 반려동물 관련 핸들러
    const handleEditPet = (petId) => {
        navigate(`/pet/edit/${petId}`);
    };

    const handleHoverEnter = (id) => setHover((prev) => ({ ...prev, [id]: true }));
    const handleHoverLeave = (id) => setHover((prev) => ({ ...prev, [id]: false }));

    const handleAddPet = () => {
        navigate("/add-pet");
    };

    // 반려동물 삭제 확인 모달 핸들러 추가
    const handleOpenDeletePetModal = (petId) => {
        setPetDeleteConfirmModal({
            open: true,
            petId: petId,
        });
    };

    const handleCloseDeletePetModal = () => {
        setPetDeleteConfirmModal({
            open: false,
            petId: null,
        });
    };

    // 반려동물 삭제 함수 수정
    const handleDeletePet = async (petId) => {
        // 모달을 통해 확인을 받은 경우에만 실행
        try {
            await instance.delete(`/pet/${petId}`);
            setPets(pets.filter((pet) => pet.id !== petId));
            setSnackbar({
                open: true,
                message: "반려동물 정보가 삭제되었습니다.",
                severity: "success",
            });
        } catch (err) {
            console.error("반려동물 삭제 실패:", err);

            if (err.response && err.response.status === 401) {
                setSnackbar({
                    open: true,
                    message: "인증이 만료되었습니다. 다시 로그인해주세요.",
                    severity: "error",
                });
                setTimeout(() => navigate("/login"), 2000);
                return;
            }

            setSnackbar({
                open: true,
                message: err.response?.data?.message || "반려동물 정보 삭제 중 오류가 발생했습니다.",
                severity: "error",
            });
        }
    };

    // 모달 핸들러
    const handleOpenWithdrawalModal = () => setOpenWithdrawalModal(true);
    const handleCloseWithdrawalModal = () => {
        setOpenWithdrawalModal(false);
        setWithdrawalInput("");
    };

    const handleWithdrawalInputChange = (e) => setWithdrawalInput(e.target.value);

    const handleWithdrawal = async () => {
        if (withdrawalInput === "탈퇴합니다") {
            try {
                const res = await instance.delete("/user/withdraw");

                const channelNames = res.data.channelNames;
                if (Array.isArray(channelNames) && channelNames.length > 0) {
                    for (const channelName of channelNames) {
                        try {
                            await nc.deleteChannel(channelName);
                        } catch (deleteErr) {
                            console.warn(`❗채널 삭제 실패: ${channelName}`, deleteErr);
                        }
                    }
                }

                setUser(null);
                setPets([]);
                setSitterStatus({});
                localStorage.clear();
                sessionStorage.clear();

                document.cookie.split(";").forEach(function (c) {
                    document.cookie = c
                        .replace(/^ +/, "")
                        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });

                navigate("/withdrawal-complete");
            } catch (err) {
                console.error("회원 탈퇴 처리 실패:", err);

                if (err.response?.status === 401) {
                    setSnackbar({
                        open: true,
                        message: "회원탈퇴 되셨습니다.",
                        severity: "info",
                    });
                    setTimeout(() => navigate("/login"), 1500);
                } else {
                    setSnackbar({
                        open: true,
                        message:
                            "회원 탈퇴 처리 중 오류가 발생했습니다: " +
                            (err.response?.data?.error || err.message || "알 수 없는 오류"),
                        severity: "error",
                    });
                }
            }
            handleCloseWithdrawalModal();
        } else {
            setSnackbar({
                open: true,
                message: "'탈퇴합니다'를 정확히 입력해주세요.",
                severity: "warning",
            });
        }
    };

    // 닉네임 관련 핸들러
    const handleOpenNicknameModal = () => setOpenNicknameModal(true);
    const handleCloseNicknameModal = () => setOpenNicknameModal(false);

    const handleNicknameSave = async (newNickname) => {
        try {
            // 닉네임 유효성 검사 (2-8자)
            if (newNickname.length < 2 || newNickname.length > 8) {
                setSnackbar({
                    open: true,
                    message: "닉네임은 2~8자 사이로 입력해주세요.",
                    severity: "warning",
                });
                return;
            }

            const response = await instance.put("/user/nickname", { nickname: newNickname });

            if (response.data && response.data.nickname) {
                setUser((prev) => ({ ...prev, nickname: response.data.nickname }));
                setSnackbar({
                    open: true,
                    message: "닉네임이 성공적으로 변경되었습니다.",
                    severity: "success",
                });
            } else {
                throw new Error("닉네임 업데이트 응답 형식이 올바르지 않습니다.");
            }
        } catch (err) {
            console.error("닉네임 변경 실패:", err);

            if (err.response && err.response.status === 401) {
                setSnackbar({
                    open: true,
                    message: "인증이 만료되었습니다. 다시 로그인해주세요.",
                    severity: "error",
                });
                setTimeout(() => navigate("/login"), 2000);
                return;
            }

            // 중복 닉네임 오류 처리
            if (err.response?.data?.error?.includes("이미 사용 중인 닉네임")) {
                setSnackbar({
                    open: true,
                    message: "이미 사용 중인 닉네임입니다.",
                    severity: "warning",
                });
                return;
            }

            setSnackbar({
                open: true,
                message: err.response?.data?.error || "닉네임 변경 중 오류가 발생했습니다.",
                severity: "error",
            });
        }
    };

    // 프로필 사진 관련 핸들러
    const handleOpenProfileImageModal = () => {
        setOpenProfileImageModal(true);
    };

    const handleCloseProfileImageModal = () => {
        setOpenProfileImageModal(false);
    };

    const handleProfileImageUpdate = (imageUrl) => {
        // Context를 통해 전역 상태 업데이트
        setUser((prev) => ({
            ...prev,
            photo: imageUrl,
            path: imageUrl,
        }));
    };

    const handleProfileClick = () => {
        handleOpenProfileImageModal();
    };

    // 펫시터 관련 핸들러
    const handlePetSitterAction = () => {
        if (sitterStatus.registered || sitterStatus.isPending) {
            navigate("/petsitter/edit");
        } else {
            navigate("/petsitter-register");
        }
    };

    const handleOpenQuitPetsitterModal = () => {
        setOpenQuitPetsitterModal(true);
    };

    const handleCloseQuitPetsitterModal = () => {
        setOpenQuitPetsitterModal(false);
    };

    const handleQuitPetsitter = async () => {
        try {
            const response = await instance.post("/petsitter/quit", {});

            if (response.status === 200) {
                setSnackbar({
                    open: true,
                    message: "펫시터 탈퇴가 완료되었습니다.",
                    severity: "success",
                });

                setSitterStatus({
                    registered: false,
                    isPending: false,
                    status: "NOT_REGISTERED",
                });
                localStorage.removeItem("petSitterRegistrationCompleted");
                localStorage.removeItem("petSitterInfo");
                handleCloseQuitPetsitterModal();
            }
        } catch (err) {
            console.error("펫시터 탈퇴 오류:", err);

            if (err.response && err.response.status === 401) {
                setSnackbar({
                    open: true,
                    message: "인증이 만료되었습니다. 다시 로그인해주세요.",
                    severity: "error",
                });
                setTimeout(() => navigate("/login"), 2000);
                return;
            }

            setSnackbar({
                open: true,
                message: err.response?.data?.message || "펫시터 탈퇴 처리 중 오류가 발생했습니다.",
                severity: "error",
            });
        }
    };

    return (
        <Box sx={{ py: 3, px: 2, maxWidth: "100%", margin: "0 auto" }}>
            {isLoading ? (
                <Box
                    sx={{
                        textAlign: "center",
                        my: 4,
                        height: "60vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CircularProgress color="primary" />
                </Box>
            ) : error ? (
                <Box sx={{ textAlign: "center", my: 4, color: "error.main" }}>
                    <Typography>{error}</Typography>
                    <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
                        새로고침
                    </Button>
                </Box>
            ) : (
                <>
                    {/* 사용자 프로필 섹션 */}
                    <UserProfileSection
                        user={user}
                        onNicknameEdit={handleOpenNicknameModal}
                        onProfileClick={handleProfileClick}
                        fileInputRef={fileInputRef}
                    />

                    {/* 반려동물 목록 섹션 */}
                    <PetListSection
                        pets={pets}
                        onEditPet={handleEditPet}
                        onDeletePet={handleOpenDeletePetModal}
                        hover={hover}
                        onHoverEnter={handleHoverEnter}
                        onHoverLeave={handleHoverLeave}
                        onAddPet={handleAddPet}
                    />

                    {/* 펫시터 섹션 */}
                    <PetSitterSection
                        sitterInfo={sitterStatus}
                        onEditClick={handlePetSitterAction}
                        onQuitClick={handleOpenQuitPetsitterModal}
                        onApplyClick={handlePetSitterAction}
                    />

                    {/* 회원 탈퇴 링크 */}
                    <Box sx={{ mt: 6, textAlign: "right" }}>
                        <Link
                            component="button"
                            variant="body2"
                            onClick={handleOpenWithdrawalModal}
                            sx={{ color: "#999", textDecoration: "underline" }}
                        >
                            회원 탈퇴하기
                        </Link>
                    </Box>

                    {/* 모달 컴포넌트 */}
                    <WithdrawalModal
                        open={openWithdrawalModal}
                        onClose={handleCloseWithdrawalModal}
                        inputValue={withdrawalInput}
                        onInputChange={handleWithdrawalInputChange}
                        onWithdrawal={handleWithdrawal}
                    />

                    <NicknameEditModal
                        open={openNicknameModal}
                        onClose={handleCloseNicknameModal}
                        currentNickname={user?.nickname || ""}
                        onSave={handleNicknameSave}
                    />

                    <PetSitterQuitModal
                        open={openQuitPetsitterModal}
                        onClose={handleCloseQuitPetsitterModal}
                        onConfirm={handleQuitPetsitter}
                    />

                    {/* 프로필 이미지 모달 */}
                    <ProfileImageModal
                        open={openProfileImageModal}
                        onClose={handleCloseProfileImageModal}
                        currentImage={user?.path || "/src/assets/images/User/profile-pic.jpg"}
                        onImageUpdate={handleProfileImageUpdate}
                    />

                    {/* 반려동물 삭제 확인 모달  */}
                    <GlobalConfirmModal
                        open={petDeleteConfirmModal.open}
                        onClose={handleCloseDeletePetModal}
                        onConfirm={() => {
                            if (petDeleteConfirmModal.petId) {
                                handleDeletePet(petDeleteConfirmModal.petId);
                                handleCloseDeletePetModal();
                            }
                        }}
                        title="반려동물 삭제"
                        description="정말로 이 반려동물 정보를 삭제하시겠습니까?"
                        confirmText="삭제"
                        cancelText="취소"
                    />

                    {/* 스낵바  */}
                    <GlobalSnackbar
                        open={snackbar.open}
                        message={snackbar.message}
                        severity={snackbar.severity}
                        handleSnackbarClose={handleSnackbarClose}
                    />
                </>
            )}
        </Box>
    );
};

export default MyPage;
