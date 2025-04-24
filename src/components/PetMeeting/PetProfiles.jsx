import React, { useEffect, useState, useRef, useCallback, useContext } from "react";
import { Box, CircularProgress } from "@mui/material";
import PetCard from "./PetCard";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";
import EmptyFriendCard from "./EmptyFriendCard.jsx";
import { getFriends } from "../../services/petmeetingService.js";
import { Context } from "../../context/Context.jsx";

const PAGE_SIZE = 3;

const PetProfiles = () => {
    const { user } = useContext(Context);
    const { friendType } = useContext(PetMeetingContext);
    const [petList, setPetList] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observer = useRef();
    const isInitialMount = useRef(true);

    const loadPets = async (currentPage) => {
        setLoading(true);

        getFriends({
            page: currentPage,
            size: PAGE_SIZE,
            activityStatus: friendType === "산책친구들" ? "WALK" : "PLAY",
            dongName: user.dongName,
            distance: user.distance,
            latitude: user.latitude,
            longitude: user.longitude,
        })
            .then((res) => {
                const data = res.data;
                console.log("응답 성공: " + res.message);
                setPetList((prev) => [...prev, ...data.content]);
                setHasMore(!data.last);
            })
            .catch((err) => {
                console.log("에러 발생: " + err.message);
            });
        setLoading(false);
    };

    useEffect(() => {
        if (page === 0) return;

        loadPets(page);
    }, [page]);

    useEffect(() => {
        const init = async () => {
            await loadPets(0);
            isInitialMount.current = false;
        };
        init();
    }, []);

    useEffect(() => {
        if (isInitialMount.current) return;

        setLoading(true);
        setPetList([]);
        setPage(0);
        loadPets(0);
    }, [friendType]);

    useEffect(() => {
        if (isInitialMount.current) return;

        setPetList([]);
        setPage(0);
        loadPets(0);
    }, [user.dongName]);

    const lastItemRef = useCallback(
        (node) => {
            if (loading || !hasMore) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setPage((prev) => prev + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    return (
        <Box>
            {petList.map((friend, index) => {
                const isLast = index === petList.length - 1;
                return (
                    <Box
                        key={friend.id}
                        ref={isLast ? lastItemRef : null}
                        sx={{
                            borderRadius: "10px",
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 2,
                        }}
                    >
                        <PetCard friend={friend} />
                    </Box>
                );
            })}

            {loading && (
                <Box display="flex" justifyContent="center" mt={2}>
                    <CircularProgress />
                </Box>
            )}
            {!loading && petList.length === 0 && <EmptyFriendCard />}
        </Box>
    );
};

export default PetProfiles;
