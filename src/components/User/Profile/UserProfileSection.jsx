import React from "react";
import { Box, Typography, Button, IconButton, Avatar } from "@mui/material";
import penIcon1 from "/src/assets/images/User/pen_1.svg";
import penIcon2 from "/src/assets/images/User/pen_2.svg";

/**
 * 사용자 프로필 섹션 컴포넌트
 * @param {Object} props
 * @param {Object} props.user 사용자 정보 객체
 * @param {Function} props.onNicknameEdit 닉네임 수정 핸들러
 * @param {Function} props.onProfileClick 프로필 사진 클릭 핸들러
 * @param {Function} props.onAddPet 반려동물 추가 핸들러
 * @param {React.RefObject} props.fileInputRef 파일 입력 참조
 */
const UserProfileSection = ({ user, onNicknameEdit, onProfileClick, onAddPet, fileInputRef }) => {
    // 프로필 이미지 경로 처리
    const getProfileImageUrl = () => {
        if (!user || !user.path) {
            return "/src/assets/images/User/profile-pic.jpg"; // 기본 이미지
        }

        // 이미 전체 URL인 경우 그대로 사용
        if (user.path.startsWith("http") || user.path.startsWith("data:")) {
            return user.path;
        }

        // 상대 경로인 경우 처리
        return user.path;
    };

    return (
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
                        src={getProfileImageUrl()}
                        alt="프로필"
                        sx={{
                            width: 60,
                            height: 60,
                            bgcolor: "#FF5C5C",
                            objectFit: "cover",
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
                        onClick={onProfileClick}
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
                    <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>{user?.nickname || "사용자"}</Typography>
                    <IconButton size="small" onClick={onNicknameEdit} sx={{ ml: 0.5, p: 0 }}>
                        <img src={penIcon2} alt="Edit" width="16" height="16" />
                    </IconButton>
                </Box>
            </Box>

            <Button
                variant="contained"
                size="small"
                onClick={onAddPet}
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

            {/* 숨겨진 파일 입력 필드 */}
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} />
        </Box>
    );
};

export default UserProfileSection;
