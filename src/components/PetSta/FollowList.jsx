import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import FollowBox from "./FollowBox.jsx";
import { getFollowdUsers, getFollowingUsers } from "../../services/petstaService.js";
import { useInView } from "react-intersection-observer";

const FollowList = ({ type, userId }) => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { ref, inView } = useInView();

    const loadMoreUsers = async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const pageSize = 10;
            const data =
                type === "followers"
                    ? await getFollowdUsers(userId, page, pageSize)
                    : await getFollowingUsers(userId, page, pageSize);

            if (data.length < pageSize) {
                setHasMore(false);
            }

            setUsers((prev) => [...prev, ...data]);
            setPage((prev) => prev + 1);
        } catch (e) {
            console.error("팔로우 목록 추가 로딩 실패", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const initLoad = async () => {
            setIsLoading(true);
            try {
                const pageSize = 10;
                const data =
                    type === "followers"
                        ? await getFollowdUsers(userId, 0, pageSize)
                        : await getFollowingUsers(userId, 0, pageSize);

                setUsers(data);
                setPage(1); // 초기 다음 페이지를 1로
                setHasMore(data.length === pageSize);
            } catch (e) {
                console.error("팔로우 목록 초기 로딩 실패", e);
            } finally {
                setIsLoading(false);
            }
        };

        initLoad();
    }, [type, userId]);

    useEffect(() => {
        if (inView && hasMore) {
            loadMoreUsers();
        }
    }, [inView, hasMore]);

    return (
        <Box p={1}>
            {users.length > 0 ? (
                users.map((user, index) => <FollowBox key={index} info={user} />)
            ) : !isLoading ? (
                <Typography textAlign="center" mt={2}>
                    아무도 없습니다.
                </Typography>
            ) : null}

            {isLoading && (
                <Box display="flex" justifyContent="center" mt={3}>
                    <CircularProgress size={30} />
                </Box>
            )}

            {!isLoading && hasMore && <div ref={ref} style={{ height: "1px" }} />}
        </Box>
    );
};

export default FollowList;
