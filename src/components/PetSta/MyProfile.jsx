import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

const MyProfile = ({ userInfo }) => {
    return (
        <Box display="flex" flexDirection="column" p={2} gap={4}>
            {/* 상단 프로필 정보 */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Avatar
                    src="/images/profile.jpg" // 나중에 유저 프로필 사진 URL로 대체
                    alt="Profile"
                    sx={{ width: 100, height: 100 }}
                />
                <Box display="flex" flexDirection="column" gap={2}>
                    <Box display="flex" justifyContent="space-between" gap={4}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h6">10</Typography>
                            <Typography variant="body2">포스팅</Typography>
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h6">152</Typography>
                            <Typography variant="body2">팔로워</Typography>
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h6">130</Typography>
                            <Typography variant="body2">팔로우</Typography>
                        </Box>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                        내 북마크 목록
                    </Typography>
                </Box>
            </Box>

            {/* 유저 이름 */}
            <Typography variant="subtitle1" fontWeight="bold">
                @{userInfo.name}
            </Typography>
            <Box width="90%" borderBottom="1px solid #ccc" m="0 auto" />
            {/* 포스팅 썸네일 목록 */}
            <Box display="flex" flexWrap="wrap" gap={1}>
                {Array.from({ length: 8 }).map((_, idx) => (
                    <Box
                        key={idx}
                        width="48%"
                        height="150px"
                        bgcolor="#ccc"
                        borderRadius={2}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Typography>포스팅 {idx + 1}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default MyProfile;
