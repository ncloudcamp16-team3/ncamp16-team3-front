import React, { useState, useEffect, useContext, useRef } from "react";
import { Box, Typography, Button, Card, CardContent, IconButton, Link, Tooltip, Avatar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import petEx from "/src/assets/images/User/pet_ex.svg";
import sitter from "/src/assets/images/User/petsit_req.svg";
import petsData from "../../mock/User/pet.json";
import sitterStatusData from "../../mock/User/petsitter.json";
import { WithdrawalModal, NicknameEditModal } from "./MyModal";
import { Context } from "../../context/Context.jsx";
import { useNavigate } from "react-router-dom";
import penIcon1 from "/src/assets/images/User/pen_1.svg";
import penIcon2 from "/src/assets/images/User/pen_2.svg";

const MyPage = () => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [sitterStatus, setSitterStatus] = useState({});
    const { user, setUser } = useContext(Context);
    const [hover, setHover] = useState({});
    const [openWithdrawalModal, setOpenWithdrawalModal] = useState(false);
    const [openNicknameModal, setOpenNicknameModal] = useState(false);
    const [withdrawalInput, setWithdrawalInput] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {
        setPets(petsData);

        // 펫시터 상태 확인
        const fetchSitterStatus = async () => {
            try {
                // 기본 상태 설정
                setSitterStatus(sitterStatusData[0]);

                // 로컬 스토리지에서 펫시터 등록 완료 상태와 정보 확인
                const registrationCompleted = localStorage.getItem("petSitterRegistrationCompleted");
                if (registrationCompleted === "true") {
                    // 등록 정보도 함께 가져옴
                    const sitterInfo = JSON.parse(localStorage.getItem("petSitterInfo") || "{}");

                    // 상태 업데이트
                    setSitterStatus((prev) => ({
                        ...prev,
                        registered: true,
                        age: sitterInfo.age || "20대",
                        petType: sitterInfo.petType || "강아지",
                        petCount: sitterInfo.petCount || "1마리",
                        houseType: sitterInfo.houseType || "아파트",
                        comment: sitterInfo.comment || "제 가족이라는 마음으로 돌봐드려요 ♥",
                        image: sitterInfo.image,
                    }));

                    // 상태 확인 후 로컬 스토리지 초기화 (선택사항)
                    // localStorage.removeItem("petSitterRegistrationCompleted");
                    // localStorage.removeItem("petSitterInfo");
                }
            } catch (error) {
                console.error("펫시터 상태 로드 오류:", error);
            }
        };

        fetchSitterStatus();
    }, []);

    const handleEditPet = (petId) => {
        navigate(`/pet/edit/${petId}`);
    };

    const handleHoverEnter = (id) => setHover((prev) => ({ ...prev, [id]: true }));
    const handleHoverLeave = (id) => setHover((prev) => ({ ...prev, [id]: false }));

    const handleOpenWithdrawalModal = () => setOpenWithdrawalModal(true);
    const handleCloseWithdrawalModal = () => {
        setOpenWithdrawalModal(false);
        setWithdrawalInput("");
    };

    const handleWithdrawalInputChange = (e) => setWithdrawalInput(e.target.value);

    const handleWithdrawal = () => {
        if (withdrawalInput === "탈퇴합니다") {
            console.log("회원탈퇴 처리");
            handleCloseWithdrawalModal();
        } else {
            alert("'탈퇴합니다'를 정확히 입력해주세요.");
        }
    };

    const handleOpenNicknameModal = () => setOpenNicknameModal(true);
    const handleCloseNicknameModal = () => setOpenNicknameModal(false);
    const handleNicknameSave = (newNickname) => {
        setUser((prev) => ({ ...prev, nickname: newNickname }));
    };

    const handleAddPet = () => {
        navigate("/add-pet");
    };

    const handleProfilePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("이미지 크기는 5MB 이하여야 합니다.");
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 업로드 가능합니다.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setUser((prev) => ({
                ...prev,
                photo: event.target.result,
            }));
        };

        reader.readAsDataURL(file);
    };

    const handleProfileClick = () => {
        fileInputRef.current.click();
    };

    const handleSitterAction = () => {
        if (sitterStatus.registered) {
            // 이미 등록된 경우, 재등록 페이지로 이동
            navigate("/petsitter-register");
        } else {
            // 미등록된 경우, 등록 페이지로 이동
            navigate("/petsitter-register");
        }
    };

    return (
        <Box sx={{ width: "100%", p: 2, pb: 8 }}>
            {/* 상단 헤더 */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    justifyContent: "space-between",
                }}
            >
                <Typography variant="h6" fontWeight="bold">
                    회원정보
                </Typography>
            </Box>

            {/* 숨겨진 파일 입력 필드 */}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleProfilePhotoUpload}
            />

            {/* 프로필 섹션 */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                    pb: 2,
                    borderBottom: "1px solid #F0F0F0",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    {/* 프로필 사진 */}
                    <Box sx={{ position: "relative", mr: 2 }}>
                        <Avatar
                            src="/src/assets/images/User/profile-pic.jpg"
                            alt="프로필"
                            sx={{
                                width: 60,
                                height: 60,
                                bgcolor: "#FF5C5C",
                            }}
                        />
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                width: 12,
                                height: 12,
                                bgcolor: "#1877F2",
                                borderRadius: "50%",
                                border: "1px solid white",
                            }}
                        />

                        {/* 펜 아이콘 (편집 버튼) */}
                        <Box
                            onClick={handleProfileClick}
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                right: -8,
                                width: 24,
                                height: 24,
                                bgcolor: "#1877F2",
                                borderRadius: "50%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                zIndex: 2,
                            }}
                        >
                            <img src={penIcon1} alt="Edit" width="15" height="13" />
                        </Box>
                    </Box>

                    {/* 사용자 이름과 편집 버튼 */}
                    <Box display="flex" alignItems="center">
                        <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>USER1823</Typography>
                        <IconButton size="small" onClick={handleOpenNicknameModal} sx={{ ml: 0.5, p: 0 }}>
                            <img src={penIcon2} alt="Edit" width="16" height="16" />
                        </IconButton>
                    </Box>
                </Box>

                <Button
                    variant="contained"
                    size="small"
                    onClick={handleAddPet}
                    sx={{
                        bgcolor: "#E9A260",
                        color: "white",
                        "&:hover": { bgcolor: "#d0905a" },
                        fontSize: "12px",
                        py: 0.5,
                        px: 1.5,
                        borderRadius: "4px",
                        boxShadow: "none",
                    }}
                >
                    동물 추가
                </Button>
            </Box>

            {/* 반려동물 목록 */}
            <Box sx={{ mb: 3 }}>
                {pets.map((pet) => (
                    <Card
                        key={pet.id}
                        sx={{
                            mb: 2,
                            borderRadius: "12px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                            position: "relative",
                            transition: "transform 0.2s ease",
                            transform: hover[pet.id] ? "scale(1.02)" : "scale(1)",
                        }}
                        onMouseEnter={() => handleHoverEnter(pet.id)}
                        onMouseLeave={() => handleHoverLeave(pet.id)}
                    >
                        <CardContent sx={{ display: "flex", p: 2.5, "&:last-child": { paddingBottom: 2.5 } }}>
                            <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
                                <Box
                                    component="img"
                                    src={petEx}
                                    alt={pet.name}
                                    sx={{ width: 50, height: 50, borderRadius: "50%", mr: 2, flexShrink: 0 }}
                                />
                                <Tooltip title="수정하기">
                                    <IconButton
                                        size="small"
                                        onClick={() => handleEditPet(pet.id)}
                                        sx={{
                                            position: "absolute",
                                            right: 2,
                                            bottom: 2,
                                            background: "#f0f0f0",
                                            width: 20,
                                            height: 20,
                                            p: 0.3,
                                            opacity: hover[pet.id] ? 1 : 0.7,
                                        }}
                                    >
                                        <img src={penIcon2} alt="Edit" width="12" height="12" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                                <Box>
                                    <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>{pet.name}</Typography>
                                    <Typography sx={{ fontSize: "12px", color: "#999" }}>
                                        {pet.pet_type_name} · {pet.gender} · {pet.weight}kg
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton size="small" sx={{ color: "#ccc", p: 0.3 }}>
                                <CloseIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* 펫시터 섹션 */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    펫시터
                </Typography>
                <Card sx={{ bgcolor: "#FDF1E5", borderRadius: "12px", boxShadow: "none", maxWidth: "90%", mx: "auto" }}>
                    <CardContent sx={{ p: 2 }}>
                        {sitterStatus.registered ? (
                            // 등록된 펫시터의 경우 - PetSitterRegister.jsx와 유사한 형식으로 변경
                            <>
                                {/* 프로필 이미지 */}
                                <Box
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        mb: 3,
                                        mx: "auto",
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={sitterStatus.image || "/mock/Global/images/haribo.jpg"}
                                        alt="프로필"
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                </Box>

                                {/* 등록 정보 테이블 */}
                                <Box
                                    sx={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        mb: 3,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mb: 1,
                                        }}
                                    >
                                        <Typography fontWeight="bold">연령대</Typography>
                                        <Typography>{sitterStatus.age || "40대"}</Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mb: 1,
                                        }}
                                    >
                                        <Typography fontWeight="bold">반려동물</Typography>
                                        <Typography>
                                            {sitterStatus.petType || "강아지"} {sitterStatus.petCount || "1마리"}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mb: 1,
                                        }}
                                    >
                                        <Typography fontWeight="bold">펫시터 경험</Typography>
                                        <Typography>{sitterStatus.experience ? "있음" : "없음"}</Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mb: 1,
                                        }}
                                    >
                                        <Typography fontWeight="bold">주거 형태</Typography>
                                        <Typography>{sitterStatus.houseType || "오피스텔"}</Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mb: 1,
                                        }}
                                    >
                                        <Typography fontWeight="bold">한마디</Typography>
                                        <Typography noWrap sx={{ maxWidth: "70%", textOverflow: "ellipsis" }}>
                                            {sitterStatus.comment || "제 아이라는 마음으로 돌봐드려요 😊"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </>
                        ) : (
                            // 미등록 펫시터의 경우
                            <>
                                <Box
                                    component="img"
                                    src={sitter}
                                    alt="펫시터 이미지"
                                    sx={{
                                        width: "100%",
                                        height: "auto",
                                        mb: 2,
                                        maxWidth: "200px",
                                        mx: "auto",
                                        display: "block",
                                    }}
                                />
                                <Typography variant="body2" align="center" sx={{ mb: 1.5 }}>
                                    소중한 반려동물들에게
                                    <br />
                                    펫시터가 찾아갑니다!
                                </Typography>
                            </>
                        )}

                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleSitterAction}
                            sx={{
                                bgcolor: "#E9A260",
                                "&:hover": { bgcolor: "#d0905a" },
                                borderRadius: "4px",
                                py: 0.7,
                                fontSize: "0.9rem",
                                boxShadow: "none",
                            }}
                        >
                            {sitterStatus.registered ? "펫시터 정보 수정" : "펫시터 신청"}
                        </Button>
                    </CardContent>
                </Card>
            </Box>

            {/* 회원 탈퇴 링크 */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                <Link
                    component="button"
                    underline="always"
                    onClick={handleOpenWithdrawalModal}
                    sx={{ color: "#888888", fontSize: "0.8rem", textAlign: "right" }}
                >
                    회원 탈퇴
                </Link>
            </Box>

            {/* 모달 */}
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
                currentNickname={user.nickname}
                onSave={handleNicknameSave}
            />
        </Box>
    );
};

export default MyPage;
