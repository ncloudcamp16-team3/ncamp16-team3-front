import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditIcon from "../../assets/images/PetSta/edit-icon.svg";
import { useNavigate } from "react-router-dom";

const MyProfile = ({ userInfo }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    return (
        <Box display="flex" flexDirection="column" p={2} gap={1}>
            {/* 상단 프로필 정보 */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box position="relative">
                    <Avatar
                        src={`/mock/Global/images/${userInfo.photo}`}
                        alt="Profile"
                        sx={{ width: 100, height: 100 }}
                    />
                    <Box position="absolute" bottom={-5} right={-5} onClick={() => navigate("/mypage")}>
                        <img src={EditIcon} alt="Edit" />
                    </Box>
                </Box>
                <Box width="60%" display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" justifyContent="space-between" gap={4}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h7" fontWeight="bold">
                                {userInfo.post_count}
                            </Typography>
                            <Typography fontSize={15}>포스팅</Typography>
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h7" fontWeight="bold">
                                {userInfo.follower_count}
                            </Typography>
                            <Typography fontSize={15}>팔로워</Typography>
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h7" fontWeight="bold">
                                {userInfo.follow_count}
                            </Typography>
                            <Typography fontSize={15}>팔로우</Typography>
                        </Box>
                    </Box>
                    <Typography
                        variant="body2"
                        bgcolor={theme.brand3}
                        color="white"
                        p={0.8}
                        borderRadius={2}
                        textAlign="center"
                    >
                        내 북마크 목록
                    </Typography>
                </Box>
            </Box>

            <Typography variant="subtitle1" fontWeight="bold">
                @{userInfo.name}
            </Typography>
            {/* 유저 이름 */}
            <Box width="90%" borderBottom="1px solid #ccc" m="0 auto" />
            {/* 포스팅 썸네일 목록 */}
            <Box display="flex" flexWrap="wrap" gap={1}>
                {Array.from({ length: 8 }).map((_, idx) => (
                    <Box
                        key={idx}
                        width="48%"
                        height="100px"
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
