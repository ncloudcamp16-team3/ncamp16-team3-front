import React, { useState, useEffect, useContext, useRef } from "react";
import { Box, Typography, Link, Button } from "@mui/material";
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
// axios 인스턴스 가져오기
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
    const { user, setUser } = useContext(Context);
    const [hover, setHover] = useState({});

    // 모달 상태
    const [openWithdrawalModal, setOpenWithdrawalModal] = useState(false);
    const [openNicknameModal, setOpenNicknameModal] = useState(false);
    const [openQuitPetsitterModal, setOpenQuitPetsitterModal] = useState(false);
    const [openProfileImageModal, setOpenProfileImageModal] = useState(false);
    const [withdrawalInput, setWithdrawalInput] = useState("");

    // 로딩 및 오류 상태
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 파일 입력 참조
    const fileInputRef = useRef(null);

    // 마이페이지 데이터 가져오기
    useEffect(() => {
        const fetchMyPageData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // 사용자 정보 API 호출 (인스턴스 사용)
                const response = await instance.get("/user/mypage");

                console.log("마이페이지 응답 데이터:", response.data);

                // API에서 받아온 데이터로 상태 업데이트
                if (response.data) {
                    setUser((prevUser) => ({
                        ...prevUser,
                        nickname: response.data.nickname,
                        photo: response.data.profileImageUrl,
                        id: response.data.userId,
                        path: response.data.profileImageUrl,
                    }));

                    setPets(response.data.pets || []);

                    // 펫시터 상태 확인
                    if (response.data.petSitterStatus) {
                        setSitterStatus({
                            registered: response.data.petSitterStatus === "APPROVE",
                            isPending: response.data.petSitterStatus === "NONE",
                            isHold: response.data.petSitterStatus === "PENDING",
                            status: response.data.petSitterStatus,
                            age: response.data.petSitterInfo?.age,
                            petType: response.data.petSitterInfo?.petType,
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

                if (err.response && err.response.status === 401) {
                    setError("로그인이 필요합니다.");
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                } else {
                    setError("마이페이지 정보를 불러오는데 실패했습니다.");
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

    // 반려동물 관련 핸들러
    const handleEditPet = (petId) => {
        navigate(`/pet/edit/${petId}`);
    };

    const handleHoverEnter = (id) => setHover((prev) => ({ ...prev, [id]: true }));
    const handleHoverLeave = (id) => setHover((prev) => ({ ...prev, [id]: false }));

    const handleAddPet = () => {
        navigate("/add-pet");
    };

    const handleDeletePet = async (petId) => {
        if (window.confirm("정말로 이 반려동물 정보를 삭제하시겠습니까?")) {
            try {
                // instance 사용하여 API 호출
                await instance.delete(`/pet/${petId}`);
                setPets(pets.filter((pet) => pet.id !== petId));
                alert("반려동물 정보가 삭제되었습니다.");
            } catch (err) {
                console.error("반려동물 삭제 실패:", err);

                if (err.response && err.response.status === 401) {
                    alert("인증이 만료되었습니다. 다시 로그인해주세요.");
                    navigate("/login");
                    return;
                }

                alert(err.response?.data?.message || "반려동물 정보 삭제 중 오류가 발생했습니다.");
            }
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
                // 백엔드 API 호출 - 탈퇴 처리 (instance 사용)
                await instance.delete("/user/withdraw");

                // 상태 및 스토리지 완전 초기화
                setUser(null); // 컨텍스트 사용자 정보 초기화
                setPets([]); // 펫 정보 초기화
                setSitterStatus({}); // 펫시터 정보 초기화

                // 로컬 스토리지 전체 클리어
                localStorage.clear();

                // 쿠키 삭제 시도 (주요 인증 쿠키)
                document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

                alert("회원 탈퇴가 완료되었습니다.");

                // 즉시 로그인 페이지로 이동
                window.location.href = "/login"; // navigate 대신 강제 리로드
            } catch (err) {
                console.error("회원 탈퇴 처리 실패:", err);
                console.error("오류 상세 정보:", err.response?.data);

                if (err.response?.status === 401) {
                    alert("회원탈퇴 되셨습니다.");
                    navigate("/login");
                } else {
                    alert(
                        "회원 탈퇴 처리 중 오류가 발생했습니다: " +
                            (err.response?.data?.error || err.message || "알 수 없는 오류")
                    );
                }
            }
            handleCloseWithdrawalModal();
        } else {
            alert("'탈퇴합니다'를 정확히 입력해주세요.");
        }
    };

    // 닉네임 관련 핸들러
    const handleOpenNicknameModal = () => setOpenNicknameModal(true);
    const handleCloseNicknameModal = () => setOpenNicknameModal(false);

    const handleNicknameSave = async (newNickname) => {
        try {
            // instance 사용하여 API 호출
            const response = await instance.put("/user/nickname", { nickname: newNickname });

            if (response.data && response.data.nickname) {
                setUser((prev) => ({ ...prev, nickname: response.data.nickname }));
                alert("닉네임이 성공적으로 변경되었습니다.");
            } else {
                throw new Error("닉네임 업데이트 응답 형식이 올바르지 않습니다.");
            }
        } catch (err) {
            console.error("닉네임 변경 실패:", err);

            if (err.response && err.response.status === 401) {
                alert("인증이 만료되었습니다. 다시 로그인해주세요.");
                navigate("/login");
                return;
            }

            alert(err.response?.data?.error || "닉네임 변경 중 오류가 발생했습니다.");
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

    // 기존 함수 수정 - 클릭 시 모달 열기
    const handleProfileClick = () => {
        handleOpenProfileImageModal();
    };

    // 펫시터 관련 핸들러
    const handlePetSitterAction = () => {
        if (sitterStatus.registered || sitterStatus.isPending) {
            // 이미 펫시터인 경우 정보 수정 페이지로 이동
            navigate("/petsitter/edit");
        } else {
            // 펫시터가 아닌 경우 등록 페이지로 이동
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
        if (window.confirm("정말로 펫시터를 그만두시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
            try {
                // instance 사용하여 API 호출
                const response = await instance.post("/petsitter/quit", {});

                if (response.status === 200) {
                    alert("펫시터 탈퇴가 완료되었습니다.");
                    // 펫시터 상태 업데이트
                    setSitterStatus({
                        registered: false,
                        isPending: false,
                        status: "NOT_REGISTERED",
                    });

                    // 로컬 스토리지에서 펫시터 정보 제거
                    localStorage.removeItem("petSitterRegistrationCompleted");
                    localStorage.removeItem("petSitterInfo");

                    // 모달 닫기
                    handleCloseQuitPetsitterModal();
                }
            } catch (err) {
                console.error("펫시터 탈퇴 오류:", err);

                if (err.response && err.response.status === 401) {
                    alert("인증이 만료되었습니다. 다시 로그인해주세요.");
                    navigate("/login");
                    return;
                }

                alert(err.response?.data?.message || "펫시터 탈퇴 처리 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <Box sx={{ py: 3, px: 2, maxWidth: "100%", margin: "0 auto" }}>
            {isLoading ? (
                <Box sx={{ textAlign: "center", my: 4 }}>
                    <Typography>로딩 중...</Typography>
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
                        onAddPet={handleAddPet}
                        fileInputRef={fileInputRef}
                    />

                    {/* 반려동물 목록 섹션 */}
                    <PetListSection
                        pets={pets}
                        onEditPet={handleEditPet}
                        onDeletePet={handleDeletePet}
                        hover={hover}
                        onHoverEnter={handleHoverEnter}
                        onHoverLeave={handleHoverLeave}
                    />

                    {/* 펫시터 섹션 */}
                    <PetSitterSection
                        sitterInfo={sitterStatus}
                        onEditClick={handlePetSitterAction}
                        onQuitClick={handleOpenQuitPetsitterModal}
                        onApplyClick={handlePetSitterAction}
                    />

                    {/* 회원 탈퇴 링크 */}
                    <Box sx={{ mt: 6, textAlign: "center" }}>
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
                        onWithdraw={handleWithdrawal}
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
                </>
            )}
        </Box>
    );
};
export default MyPage;
