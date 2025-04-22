import React, { useEffect, useState, useRef, useCallback, useContext } from "react";
import { Box, CircularProgress } from "@mui/material";
import PetCard from "./PetCard";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";

const PAGE_SIZE = 3;

const PetProfiles = () => {
    const { pet } = useContext(PetMeetingContext);
    const [petList, setPetList] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observer = useRef();

    const loadPets = async (currentPage) => {
        setLoading(true);
        let newPets;

        const url = "/api/petmeeting/friends";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                page: currentPage,
                size: 5,
                activityStatus: "NONE",
                dongName: "역삼동",
                distance: "1",
            }),
        };

        fetch(url, requestOptions)
            .then((response) => {
                return response.json().then((resObj) => {
                    if (!response.ok) {
                        throw new Error(JSON.stringify({ status: response.status, resObj }));
                    }
                    return resObj.data;
                });
            })
            .then((data) => {
                setPetList((prev) => [...prev, ...data.content]);
                setHasMore(!data.last);
                console.log(data.content);
            })
            .catch((error) => {
                console.error("에러 발생:", error);
            });
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
