import React, { useEffect, useState, useRef, useCallback, useContext } from "react";
import { Box, CircularProgress } from "@mui/material";
import PetCard from "./PetCard";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";
import EmptyFriendCard from "./EmptyFriendCard.jsx";

const PAGE_SIZE = 3;

const PetProfiles = () => {
    const { pet, friendType } = useContext(PetMeetingContext);
    const [petList, setPetList] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observer = useRef();
    const isInitialMount = useRef(true);

    const loadPets = async (currentPage) => {
        setLoading(true);

        const url = "/api/petmeeting/friends";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                page: currentPage,
                size: PAGE_SIZE,
                activityStatus: friendType === "산책친구들" ? "WALK" : "PLAY",
                dongName: pet.owner.dongName,
                distance: pet.owner.distance,
                latitude: pet.owner.latitude,
                longitude: pet.owner.longitude,
            }),
        };

        fetch(url, requestOptions)
            .then((response) => {
                return response.json().then((resObj) => {
                    if (!response.ok) {
                        throw new Error(JSON.stringify({ status: response.status, data: resObj }));
                    }
                    return resObj.data;
                });
            })
            .then((data) => {
                setPetList((prev) => [...prev, ...data.content]);
                setHasMore(!data.last);
                console.log("요청 결과" + data);
            })
            .catch((error) => {
                console.error("에러 발생:", error);
            });
        setLoading(false);
    };

    useEffect(() => {
        if (page === 0) return;

        loadPets(page);
    }, [page]);

    useEffect(() => {
        const init = async () => {
            await loadPets(0); // 비동기 호출
            isInitialMount.current = false; // 호출 완료 후 초기화
        };
        init();
    }, []);

    useEffect(() => {
        if (isInitialMount.current) return;

        setPetList([]);
        setPage(0);
        loadPets(0);
    }, [friendType]);

    useEffect(() => {
        if (isInitialMount.current) return;

        setPetList([]);
        setPage(0);
        loadPets(0);
    }, [pet]);

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
            {petList.length === 0 && <EmptyFriendCard />}
            {loading && (
                <Box display="flex" justifyContent="center" mt={2}>
                    <CircularProgress />
                </Box>
            )}
        </Box>
    );
};

export default PetProfiles;
