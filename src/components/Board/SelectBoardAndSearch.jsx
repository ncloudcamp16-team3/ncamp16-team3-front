import React, { useContext, useState } from "react";
import { Box, Typography } from "@mui/material";
import Upbtn from "../../assets/images/Board/upBoardList.svg";
import Downbtn from "../../assets/images/Board/downBoardList.svg";
import DropdownBoard from "./DropdownBoard.jsx";
import SearchBar from "./SearchBar.jsx";
import { Context } from "../../context/Context.jsx";

const SelectBoardAndSearch = ({ requestBoardList }) => {
    const { boardType } = useContext(Context);
    const [openSearch, setOpenSearch] = useState(false);
    const [dropList, setDroplist] = useState(false);

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                <Box onClick={() => setDroplist((prev) => !prev)}>
                    <Typography
                        sx={{
                            display: "inline",
                            fontSize: "23px",
                        }}
                    >
                        {boardType.name}
                    </Typography>
                    <Box
                        component="img"
                        src={dropList ? Upbtn : Downbtn}
                        sx={{
                            m: "0 5px",
                        }}
                    />
                </Box>
                <DropdownBoard dropList={dropList} setDroplist={setDroplist} />
                <SearchBar openSearch={openSearch} setOpenSearch={setOpenSearch} requestBoardList={requestBoardList} />
            </Box>
        </Box>
    );
};

export default SelectBoardAndSearch;
