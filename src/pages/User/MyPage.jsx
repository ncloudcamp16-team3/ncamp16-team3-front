import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Button, Card, CardContent, IconButton, Link, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import petEx from "/src/assets/images/User/pet_ex.svg";
import sitter from "/src/assets/images/User/petsit_req.svg";
import petsData from "../../mock/User/pet.json";
import sitterStatusData from "../../mock/User/petsitter.json";
import { WithdrawalModal, NicknameEditModal } from "./MyModal";
import { Context } from "../../context/Context.jsx";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [sitterStatus, setSitterStatus] = useState({});
    const { user, setUser } = useContext(Context);
    const [hover, setHover] = useState({});
    const [openWithdrawalModal, setOpenWithdrawalModal] = useState(false);
    const [openNicknameModal, setOpenNicknameModal] = useState(false);
    const [withdrawalInput, setWithdrawalInput] = useState("");

    useEffect(() => {
        setPets(petsData);
        setSitterStatus(sitterStatusData);
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

    return (
        <Box sx={{ width: "100%", p: 2, pb: 8 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                    회원정보
                </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="subtitle1" sx={{ mr: 1 }}>
                        {user.name}
                    </Typography>
                    <IconButton size="small" sx={{ color: "#666", p: 0 }} onClick={handleOpenNicknameModal}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleAddPet}
                    sx={{
                        bgcolor: "#E9A260",
                        color: "white",
                        "&:hover": { bgcolor: "#d0905a" },
                        fontSize: "0.75rem",
                        py: 0.5,
                        px: 2,
                    }}
                >
                    동물 추가
                </Button>
            </Box>

            <Box sx={{ mb: 3 }}>
                {pets.map((pet) => (
                    <Card
                        key={pet.id}
                        sx={{
                            mb: 2,
                            borderRadius: "12px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
                                    sx={{ width: 85, height: 85, borderRadius: "50%", mr: 2, flexShrink: 0 }}
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
                                            width: 28,
                                            height: 28,
                                            p: 0.5,
                                            opacity: hover[pet.id] ? 1 : 0.7,
                                        }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                                <Box>
                                    <Typography variant="subtitle1">{pet.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {pet.pet_type_name} · {pet.gender} · {pet.weight}kg
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton
                                size="small"
                                sx={{ position: "absolute", right: 8, top: 8, color: "#999", bgcolor: "white", p: 0.5 }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    펫시터
                </Typography>
                <Card sx={{ bgcolor: "#FDF1E5", borderRadius: "12px", boxShadow: "none", maxWidth: "90%", mx: "auto" }}>
                    <CardContent sx={{ p: 2 }}>
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
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                bgcolor: "#E9A260",
                                "&:hover": { bgcolor: "#d0905a" },
                                borderRadius: "25px",
                                py: 0.7,
                                fontSize: "0.9rem",
                            }}
                        >
                            {sitterStatus.registered ? "펫시터 정보 수정" : "펫시터 신청"}
                        </Button>
                    </CardContent>
                </Card>
            </Box>

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
