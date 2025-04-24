import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Box } from "@mui/material";
import FollowList from "../../components/PetSta/FollowList.jsx";
const FollowersTab = () => {
    const { userId } = useParams();
    const location = useLocation();
    const initialTab = location.pathname.includes("following") ? "following" : "followers";
    const [selectedTab, setSelectedTab] = useState(initialTab);

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

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

            <FollowList userId={userId} type={selectedTab} />
        </div>
    );
};

export default FollowersTab;
