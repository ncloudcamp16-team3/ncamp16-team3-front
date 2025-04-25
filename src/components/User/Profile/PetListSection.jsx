import React, { useState } from "react";
import { Box, Typography, Card, CardContent, IconButton, Button, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import petEx from "/src/assets/images/User/pet_ex.svg";
import penIcon2 from "/src/assets/images/User/pen_2.svg";

/**
 * 반려동물 목록 섹션 컴포넌트
 * @param {Object} props
 * @param {Array} props.pets 반려동물 목록
 * @param {Object} props.hover 호버 상태 객체
 * @param {Function} props.onEditPet 반려동물 수정 핸들러
 * @param {Function} props.onDeletePet 반려동물 삭제 핸들러
 * @param {Function} props.onAddPet 반려동물 추가 핸들러
 * @param {Function} props.onHoverEnter 호버 시작 핸들러
 * @param {Function} props.onHoverLeave 호버 종료 핸들러
 */
const PetListSection = ({ pets, hover, onEditPet, onDeletePet, onAddPet, onHoverEnter, onHoverLeave }) => {
    return (
        <Box sx={{ mb: 3 }}>
            {pets.length > 0 ? (
                pets.map((pet) => (
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
                        onMouseEnter={() => onHoverEnter(pet.id)}
                        onMouseLeave={() => onHoverLeave(pet.id)}
                    >
                        <CardContent sx={{ display: "flex", p: 2.5, "&:last-child": { paddingBottom: 2.5 } }}>
                            <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
                                <Box
                                    component="img"
                                    src={pet.profileImageUrl || petEx}
                                    alt={pet.name}
                                    sx={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: "50%",
                                        mr: 2,
                                        flexShrink: 0,
                                        objectFit: "cover",
                                    }}
                                />
                                <Tooltip title="수정하기">
                                    <IconButton
                                        size="small"
                                        onClick={() => onEditPet(pet.id)}
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
                                        {pet.type} · {pet.gender} · {pet.weight}kg
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton size="small" sx={{ color: "#ccc", p: 0.3 }} onClick={() => onDeletePet(pet.id)}>
                                <CloseIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                        등록된 반려동물이 없습니다
                    </Typography>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={onAddPet}
                        sx={{
                            mt: 2,
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
                        반려동물 등록하기
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default PetListSection;
