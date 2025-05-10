import React, { useContext } from "react";
import { Box, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { Context } from "../../context/Context.jsx";

const PetSitterStart = ({ sitter }) => {
    const { user } = useContext(Context);
    const renderPetInfo = () => {
        if (sitter.petInfo && sitter.petInfo !== "정보 없음") {
            return `반려동물: ${sitter.petInfo}`;
        }
        return "반려동물 없음";
    };

    return (
        <Box textAlign="center" py={2}>
            <Box display="flex" justifyContent="center" gap={2} mb={1}>
                <Box textAlign="center">
                    <Avatar
                        src={sitter.image}
                        alt={sitter.sitterName}
                        sx={{ width: 60, height: 60, margin: "0 auto" }}
                    />
                    <Typography variant="body2">
                        {sitter.sitterName} ({sitter.age})
                    </Typography>
                </Box>
            </Box>
            <Typography fontWeight="bold">펫시터 {sitter.sitterName}님과 채팅을 시작합니다.</Typography>
            <Typography variant="body2" color="text.secondary">
                {renderPetInfo()} / {sitter.experience ? "펫시터 경험 있음" : "펫시터 경험 없음"}
            </Typography>
        </Box>
    );
};

export default PetSitterStart;
