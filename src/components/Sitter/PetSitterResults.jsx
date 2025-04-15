import React, { useState } from "react";
import { Box, Typography, Card, CardContent, CardMedia } from "@mui/material";
import PetSitterDetail from "./PetSitterDetail";

const PetSitterResults = ({ filteredPetsitters }) => {
    const [selectedSitter, setSelectedSitter] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);

    // 펫시터 클릭 핸들러
    const handleSitterClick = (sitter) => {
        setSelectedSitter(sitter);
        setDetailOpen(true);
    };

    // 모달 닫기 핸들러
    const handleCloseDetail = () => {
        setDetailOpen(false);
    };

    // 펫시터 카드 렌더링
    const renderPetsitterCard = (sitter) => {
        return (
            <Card
                key={sitter.id}
                sx={{
                    mb: 2,
                    borderRadius: "16px",
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                    },
                }}
                onClick={() => handleSitterClick(sitter)}
            >
                <Box sx={{ display: "flex", p: 2 }}>
                    <CardMedia
                        component="img"
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: "12px",
                            objectFit: "cover",
                        }}
                        image={sitter.image}
                        alt={sitter.name}
                    />
                    <CardContent
                        sx={{
                            flex: "1 0 auto",
                            p: 1,
                            pl: 2,
                            "&:last-child": { paddingBottom: "8px" },
                        }}
                    >
                        <Typography component="div" variant="h6" sx={{ fontSize: "16px", fontWeight: "bold" }}>
                            {sitter.name}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                fontSize: "12px",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {sitter.description}
                        </Typography>
                    </CardContent>
                </Box>
            </Card>
        );
    };

    return (
        <>
            <Box sx={{ mt: 2, mb: 8 }}>
                {filteredPetsitters.length > 0 ? (
                    filteredPetsitters.map(renderPetsitterCard)
                ) : (
                    <Box sx={{ textAlign: "center", p: 4 }}>
                        <Typography>조건에 맞는 펫시터가 없습니다.</Typography>
                    </Box>
                )}
            </Box>

            {/* 상세 정보 모달 */}
            <PetSitterDetail sitter={selectedSitter} open={detailOpen} onClose={handleCloseDetail} />
        </>
    );
};

export default PetSitterResults;
