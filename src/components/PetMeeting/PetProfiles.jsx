import React, { useEffect, useState, useRef, useCallback } from "react";
import { Box, CircularProgress } from "@mui/material";
import PetCard from "./PetCard";
import PetFriends from "../../mock/PetMeeting/petFriends.json";

const PAGE_SIZE = 3;

const PetProfiles = () => {
    const [petList, setPetList] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observer = useRef();

    const fetchMockPets = (page) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const start = page * PAGE_SIZE;
                const end = start + PAGE_SIZE;
                const newPets = PetFriends.slice(start, end);
                resolve(newPets);
            }, 400);
        });
    };

    const loadPets = async (currentPage) => {
        setLoading(true);
        const newPets = await fetchMockPets(currentPage);
        setPetList((prev) => [...prev, ...newPets]);
        if (newPets.length < PAGE_SIZE) {
            setHasMore(false);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadPets(0);
    }, []);

    useEffect(() => {
        if (page === 0) return;
        loadPets(page);
    }, [page]);

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
        </Box>
    );
};

export default PetProfiles;
