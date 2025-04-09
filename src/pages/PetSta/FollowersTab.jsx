import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import UserFollows from "../../mock/PetSta/userFollows.json";
import UserInfo from "../../mock/PetSta/userInfo.json";
import FollowBox from "../../components/PetSta/FollowBox.jsx";
// context가 있다면

const FollowersTab = () => {
    const { userId } = useParams();
    const location = useLocation();

    const initialTab = location.pathname.includes("following") ? "following" : "followers";
    const [selectedTab, setSelectedTab] = useState(initialTab);

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    // 문자열이면 숫자로 변환
    const targetUserId = parseInt(userId, 10);

    // 필터링된 사용자 배열
    const filteredUsers =
        selectedTab === "followers"
            ? UserFollows.filter((f) => f.followedId === targetUserId).map((f) =>
                  UserInfo.find((u) => u.id === f.followerId)
              )
            : UserFollows.filter((f) => f.followerId === targetUserId).map((f) =>
                  UserInfo.find((u) => u.id === f.followedId)
              );
    const targetUser = UserInfo.find((u) => u.id === targetUserId);

    return (
        <div>
            <Box display="flex" borderBottom="1px solid #ccc">
                <Box
                    width="50%"
                    onClick={() => handleTabClick("followers")}
                    textAlign="center"
                    style={{ fontWeight: selectedTab === "followers" ? "bold" : "normal" }}
                    borderBottom={selectedTab === "followers" ? "1px solid black" : ""}
                    color={selectedTab === "followers" ? "black" : "#ccc"}
                    p={0.5}
                    sx={{ cursor: "pointer" }}
                >
                    팔로워
                </Box>
                <Box
                    width="50%"
                    onClick={() => handleTabClick("following")}
                    textAlign="center"
                    style={{ fontWeight: selectedTab === "followers" ? "normal" : "bold" }}
                    borderBottom={selectedTab === "followers" ? "" : "1px solid black"}
                    color={selectedTab === "followers" ? "#ccc" : "black"}
                    p={0.5}
                    sx={{ cursor: "pointer" }}
                >
                    팔로잉
                </Box>
            </Box>

            <Box p={1}>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (user ? <FollowBox key={index} userInfo={user} /> : null))
                ) : (
                    <Typography textAlign="center" mt={2}>
                        아무도 없습니다.
                    </Typography>
                )}
            </Box>
        </div>
    );
};

export default FollowersTab;
