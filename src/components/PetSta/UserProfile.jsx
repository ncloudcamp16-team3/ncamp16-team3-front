import React, { useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditIcon from "../../assets/images/PetSta/edit-icon.svg";
import { useNavigate } from "react-router-dom";

const UserProfile = ({ userInfo }) => {
    const [isFollow, setIsFollow] = useState(false);
    const theme = useTheme();
    const navigate = useNavigate();
    return (
        <Box display="flex" flexDirection="column" p={2} gap={1}>
            {/* 상단 프로필 정보 */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box width="25%">
                    <Box position="relative">
                        <Avatar
                            src={`/mock/Global/images/${userInfo.photo}`}
                            alt="Profile"
                            sx={{ position: "relative", width: 100, height: 100 }}
                        />
                        <Box position="absolute" bottom={-5} right={0} onClick={() => navigate("/mypage")}>
                            <img src={EditIcon} alt="Edit" />
                        </Box>
                    </Box>
                </Box>
                <Box width="70%" display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" justifyContent="space-between" gap={4}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h7" fontWeight="bold">
                                {userInfo.postCount}
                            </Typography>
                            <Typography fontSize={15}>포스팅</Typography>
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h7" fontWeight="bold">
                                {userInfo.followerCount}
                            </Typography>
                            <Typography fontSize={15}>팔로워</Typography>
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h7" fontWeight="bold">
                                {userInfo.followCount}
                            </Typography>
                            <Typography fontSize={15}>팔로우</Typography>
                        </Box>
                    </Box>
                    <Typography
                        width="100%"
                        variant="body2"
                        bgcolor={isFollow ? theme.secondary : theme.brand3}
                        color="white"
                        p={0.8}
                        borderRadius={2}
                        textAlign="center"
                        onClick={() => setIsFollow((prev) => !prev)}
                    >
                        {isFollow ? "팔로우 취소" : "팔로우 하기"}
                    </Typography>
                </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" fontWeight="bold" width="25%">
                    @{userInfo.name}
                </Typography>
                <Typography
                    width="70%"
                    variant="body2"
                    bgcolor={theme.brand3}
                    color="white"
                    p={0.8}
                    borderRadius={2}
                    textAlign="center"
                >
                    메시지 보내기
                </Typography>
            </Box>
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

export default UserProfile;
