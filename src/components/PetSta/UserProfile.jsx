import React, { useContext, useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { toggleFollow } from "../../services/memberService.js";
import PostThumbnail from "./Post/PostThumbnail.jsx";
import { Context } from "../../context/Context.jsx";
import { createChatRoom } from "../../services/chatService.js";

const UserProfile = ({ userInfo }) => {
    const [isFollow, setIsFollow] = useState(userInfo.isFollow); // 백에서 받은 값으로 초기화
    const theme = useTheme();
    const navigate = useNavigate();
    const { nc, user } = useContext(Context);

    const handleFollowClick = async () => {
        try {
            await toggleFollow(userInfo.id);
            setIsFollow((prev) => !prev);
        } catch (error) {
            console.error("팔로우 요청 실패", error);
        }
    };

    const handleMessageClick = async () => {
        if (!nc) return;

        try {
            // 1️⃣ 서버에 방 생성 or 조회 요청 → 유니크 ID 반환
            const uniqueId = await createChatRoom(userInfo.id);

            // 2️⃣ customField를 기준으로 채널 조회
            const filter = { name: uniqueId };
            const channelList = await nc.getChannels(filter, {}, { per_page: 1 });
            console.log("엥" + JSON.stringify(channelList));

            const { edges } = channelList;

            let realChannelId = null;

            if (edges.length > 0) {
                console.log("이거떠야하는거아닌가?");
                realChannelId = edges[0].node.id;
            } else {
                const newChannel = await nc.createChannel({
                    type: "PRIVATE",
                    name: uniqueId,
                });

                realChannelId = newChannel.id;

                await nc.addUsers(realChannelId, [`ncid${userInfo.id}`]);
            }

            // 6️⃣ 현재 사용자 구독 여부 확인
            const subFilter = {
                channel_id: realChannelId,
                user_id: `ncid${user.id}`,
            };
            const subs = await nc.getSubscriptions(subFilter, {}, { per_page: 1 });
            const isSubscribed = subs.length > 0;

            if (!isSubscribed) {
                await nc.subscribe(realChannelId);
                console.log("✅ 사용자 구독 완료");
            }

            await nc.sendMessage(realChannelId, {
                type: "text",
                customType: "USER_SUBSCRIBED",
                content: {
                    userId: userInfo.id,
                    channelId: realChannelId,
                },
            });

            // 7️⃣ 채팅방 이동
            navigate(`/chat/room/${realChannelId}`);
        } catch (e) {
            console.error("❌ 채널 처리 실패:", e);
        }
    };

    return (
        <Box display="flex" flexDirection="column" p={2} gap={1}>
            {/* 상단 프로필 정보 */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box width="25%">
                    <Box position="relative">
                        <Avatar
                            src={userInfo.userPhoto}
                            alt="Profile"
                            sx={{ position: "relative", width: 100, height: 100 }}
                        />
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
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            onClick={() => navigate(`/petsta/user/${userInfo.id}/follower`)}
                            sx={{ cursor: "pointer" }}
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
                            sx={{ cursor: "pointer" }}
                        >
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
                        onClick={handleFollowClick}
                        sx={{ cursor: "pointer" }}
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
                    sx={{
                        cursor: "pointer",
                    }}
                    onClick={() => handleMessageClick()}
                >
                    메시지 보내기
                </Typography>
            </Box>

            <Box width="90%" borderBottom="1px solid #ccc" m="0 auto" />

            {/* 포스팅 썸네일 목록 */}
            <Box display="flex" flexWrap="wrap" gap={1} justifyContent="space-between">
                {userInfo.posts.map((post) => (
                    <PostThumbnail key={post.id} id={post.id} fileName={post.fileName} />
                ))}
            </Box>
        </Box>
    );
};

export default UserProfile;
