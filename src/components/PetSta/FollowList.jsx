import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import FollowBox from "./FollowBox.jsx";
import { getFollowdUsers, getFollowingUsers } from "../../services/petstaService.js";

const FollowList = ({ type, userId }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFollows = async () => {
            try {
                setLoading(true);
                const data = type === "followers" ? await getFollowdUsers(userId) : await getFollowingUsers(userId);
                setUsers(data);
            } catch (e) {
                console.error("팔로우 목록 로딩 실패", e);
            } finally {
                setLoading(false);
            }
        };

        fetchFollows();
    }, [type, userId]);

    if (loading) {
        return (
            <Typography textAlign="center" mt={2}>
                불러오는 중...
            </Typography>
        );
    }

    return (
        <Box p={1}>
            {users.length > 0 ? (
                users.map((user, index) => <FollowBox key={index} info={user} />)
            ) : (
                <Typography textAlign="center" mt={2}>
                    아무도 없습니다.
                </Typography>
            )}
        </Box>
    );
};

export default FollowList;
