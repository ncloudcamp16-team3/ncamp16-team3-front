import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import LeftArrow from "../../assets/images/global/left-arrow-black.svg";

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
            <Box display="flex" alignItems="center">
                <Box>
                    <img src={LeftArrow} />
                </Box>
                <Typography variant="body2" color="textSecondary">
                    해피해피해피
                </Typography>
            </Box>
            <div style={{ display: "flex" }}>
                <button
                    onClick={() => handleTabClick("followers")}
                    style={{ fontWeight: selectedTab === "followers" ? "bold" : "normal" }}
                >
                    팔로워
                </button>
                <button
                    onClick={() => handleTabClick("following")}
                    style={{ fontWeight: selectedTab === "following" ? "bold" : "normal" }}
                >
                    팔로잉
                </button>
            </div>

            <div>{selectedTab === "followers" ? <div>팔로워 목록 보여주기</div> : <div>팔로잉 목록 보여주기</div>}</div>
        </div>
    );
};

export default FollowersTab;
