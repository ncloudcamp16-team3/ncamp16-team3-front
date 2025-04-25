import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import SelectBoardAndSearch from "../../components/Board/SelectBoardAndSearch.jsx";
import AnnounceContainer from "../../components/Board/AnnounceContainer.jsx";
import { Context } from "../../context/Context.jsx";
import PostCard from "../../components/Board/PostCard.jsx";
import AddBtn from "../../components/Board/AddBtn.jsx";
import { getBoardType, searchPost } from "../../services/boardService.js";
import Loading from "../../components/Global/Loading.jsx";
import { getAnnounces } from "../../services/announceService.js";

const Board = () => {
    const { setBoardTypeList, setBoardType, boardType } = useContext(Context);
    const [postList, setPostList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [hasMore, setHasMore] = useState(true);
    const [announceData, setAnnounceData] = useState([]);
    const observer = useRef();
    const isInitialMount = useRef(true);

    useEffect(() => {
        const getBoardTypes = async () => {
            try {
                const res = await getBoardType();
                const data = res.data;
                console.log(data);
                console.log("응답 성공: " + res.message);

                setBoardTypeList(data);

                if (data.length > 0) {
                    const firstBoardType = data[0];
                    setBoardType(firstBoardType);
                    requestAnnounce(firstBoardType);
                    await getPostList({ boardType: firstBoardType, page: 0 });
                    isInitialMount.current = false;
                }
            } catch (err) {
                console.log("에러 발생: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        getBoardTypes();
    }, []);

    const getPostList = async ({ boardType, keyword, page }) => {
        setLoading(true);
        try {
            const res = await searchPost({
                boardTypeId: boardType.id,
                keyword,
                page,
            });
            const data = res.data;
            console.log(data);
            console.log("응답 성공: " + res.message);
            setPostList((prev) => [...prev, ...data.content]);
            setHasMore(!data.last);
        } catch (err) {
            console.log("에러 발생: " + err.message);
        } finally {
            console.log(page);
            setLoading(false); // 성공이든 실패든 무조건 false
        }
    };

    const keywordSearch = (keyword) => {
        setKeyword(keyword);
        setPostList([]);
        setPage(0);

        getPostList({ page: 0, boardType: boardType, keyword: keyword });
    };

    useEffect(() => {
        if (isInitialMount.current) return;

        setKeyword("");
        setPostList([]);
        setPage(0);
        requestAnnounce(boardType);
        getPostList({ page: 0, boardType: boardType });
    }, [boardType]);

    useEffect(() => {
        if (isInitialMount.current) return;

        getPostList({
            page: 0,
            boardType: boardType,
            keyword: keyword === "" ? null : keyword,
        });
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

    const requestAnnounce = async (boardType) => {
        try {
            const announcesRes = await getAnnounces(boardType);
            console.log(announcesRes.message);
            setAnnounceData(announcesRes.data);
        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                p: "10px",
            }}
        >
            {loading ? (
                <Loading />
            ) : (
                <Box>
                    <SelectBoardAndSearch keywordSearch={keywordSearch} />
                    <AnnounceContainer announceData={announceData} />

                    {postList.map((item, index) => {
                        const isLast = index === postList.length - 1;
                        return (
                            <Box key={item.id} ref={isLast ? lastItemRef : null}>
                                <PostCard postItem={item} />
                            </Box>
                        );
                    })}
                    <AddBtn />
                </Box>
            )}
        </Box>
    );
};

export default Board;
