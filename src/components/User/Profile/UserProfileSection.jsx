import React from "react";
import { Box, Typography,  IconButton, Avatar } from "@mui/material";
import penIcon1 from "/src/assets/images/User/pen_1.svg";
import penIcon2 from "/src/assets/images/User/pen_2.svg";

const UserProfileSection = ({ user, onNicknameEdit, onProfileClick, fileInputRef }) => {
    // 프로필 이미지 경로 처리
    const getProfileImageUrl = () => {
        if (!user || !user.path) {
            return "/src/assets/images/User/profile-pic.jpg";
        }

        if (user.path.startsWith("http") || user.path.startsWith("data:")) {
            return user.path;
        }

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

            {/* 숨겨진 파일 입력 필드 */}
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} />
        </Box>
    );
};

export default UserProfileSection;
