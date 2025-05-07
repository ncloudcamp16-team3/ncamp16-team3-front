import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import Upbtn from "../../assets/images/Board/upBoardList.svg";
import Downbtn from "../../assets/images/Board/downBoardList.svg";
import DropdownBoard from "./DropdownBoard.jsx";
import SearchBar from "./SearchBar.jsx";
import { Context } from "../../context/Context.jsx";

const SelectBoardAndSearch = ({ keywordSearch }) => {
    const { boardType } = useContext(Context);
    const [openSearch, setOpenSearch] = useState(false);
    const [dropList, setDroplist] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropList && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDroplist(false); // 🔹 외부 클릭 시 닫기
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropList]);

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                <Box ref={dropdownRef}>
                    <Box
                        onClick={() => setDroplist((prev) => !prev)}
                        sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                    >
                        <Typography
                            sx={{
                                fontSize: "23px",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {boardType.name}
                        </Typography>
                        <Box component="img" src={dropList ? Upbtn : Downbtn} sx={{ m: "0 5px" }} />
                    </Box>
                    <DropdownBoard dropList={dropList} setDroplist={setDroplist} />
                </Box>

                <SearchBar openSearch={openSearch} setOpenSearch={setOpenSearch} keywordSearch={keywordSearch} />
            </Box>
        </Box>
    );
};

export default SelectBoardAndSearch;
