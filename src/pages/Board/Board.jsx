import React, { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import SelectBoardAndSearch from "../../components/Board/SelectBoardAndSearch.jsx";
import AnnounceContainer from "../../components/Board/AnnounceContainer.jsx";
import { Context } from "../../context/Context.jsx";
import PostCard from "../../components/Board/PostCard.jsx";
import BoardItems from "../../mock/Board/boardItemList.json";
import BoardItems2 from "../../mock/Board/boardItemList2.json";
import AddBtn from "../../components/Board/AddBtn.jsx";

const Board = () => {
    const { boardType } = useContext(Context);
    const [postList, setPostList] = useState([]);

    useEffect(() => {
        setPostList(BoardItems);
    }, []);

    useEffect(() => {
        requestBoardList(boardType);
    }, [boardType]);

    const requestBoardList = (boardType, keyword) => {
        if (keyword) {
            setPostList(BoardItems);
            alert("보드타입: " + boardType.name + "\n타입ID:" + boardType.id + "\n검색어:" + keyword + "\n요청");
        } else {
            setPostList(BoardItems2);
            alert("보드타입: " + boardType.name + "\n타입ID:" + boardType.id + "\n요청");
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
            <SelectBoardAndSearch requestBoardList={requestBoardList} />
            <AnnounceContainer />

            {postList.map((item) => {
                return <PostCard postItem={item} />;
            })}

            <AddBtn />
        </Box>
    );
};

export default Board;
