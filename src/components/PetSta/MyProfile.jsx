import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import PostThumbnail from "./Post/PostThumbnail.jsx";

const MyProfile = ({ userInfo }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    console.log(userInfo.posts);
    return (
        <Box display="flex" flexDirection="column" p={2} gap={1}>
            {/* 상단 프로필 정보 */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box position="relative">
                    <Avatar src={userInfo.userPhoto} alt="Profile" sx={{ width: 100, height: 100 }} />
                </Box>
                <Box width="60%" display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" justifyContent="space-between" gap={4}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h7" fontWeight="bold">
                                {userInfo.postCount}
                            </Typography>
                            <Typography fontSize={15}>포스팅</Typography>
                        </Box>
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            onClick={() => navigate(`/petsta/user/${userInfo.id}/follower`)}
                            sx={{
                                cursor: "pointer",
                            }}
                        >
                            <Typography variant="h7" fontWeight="bold">
                                {userInfo.followerCount}
                            </Typography>
                            <Typography fontSize={15}>팔로워</Typography>
                        </Box>
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            onClick={() => navigate(`/petsta/user/${userInfo.id}/following`)}
                            sx={{
                                cursor: "pointer",
                            }}
                        >
                            <Typography variant="h7" fontWeight="bold">
                                {userInfo.followCount}
                            </Typography>
                            <Typography fontSize={15}>팔로우</Typography>
                        </Box>
                    </Box>
                    <Typography
                        onClick={() => navigate("/bookmark")}
                        variant="body2"
                        bgcolor={theme.brand3}
                        color="white"
                        p={0.8}
                        borderRadius={2}
                        textAlign="center"
                        sx={{
                            cursor: "pointer",
                        }}
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
                {userInfo.posts.map((post) => (
                    <PostThumbnail key={post.id} id={post.id} fileName={post.fileName} />
                ))}
            </Box>
        </Box>
    );
};

export default MyProfile;
