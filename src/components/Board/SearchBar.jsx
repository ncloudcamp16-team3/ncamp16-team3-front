import React, { useRef, useState } from "react";
import { Box, Button, InputBase, Collapse } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function SearchBar({ openSearch, setOpenSearch, keywordSearch }) {
    const theme = useTheme();
    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState("");

    const searchBtnClick = () => {
        setOpenSearch(!openSearch);
        if (openSearch) {
            searchRequest(inputValue);
        } else {
            setInputValue("");
        }
    };

    const handleFocus = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const searchRequest = (keyword) => {
        setOpenSearch(false);
        keywordSearch(keyword);
    };

    return (
        <Box
            sx={{
                position: "relative",
                flex: 1,
                height: "35px",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    left: "0",
                    top: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    width: "100%",
                }}
            >
                <Collapse
                    in={openSearch}
                    orientation="horizontal"
                    collapsedSize={0}
                    sx={{
                        display: "flex",
                        mr: "85px",
                    }}
                    onEntered={handleFocus}
                >
                    <InputBase
                        value={inputValue}
                        inputRef={inputRef}
                        placeholder="검색어 입력"
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                searchRequest(inputValue);
                            }
                        }}
                        sx={{
                            px: "15px",
                            borderRadius: "999px",
                            backgroundColor: theme.brand2,
                            height: "35px",
                        }}
                    />
                </Collapse>
            </Box>
            <Button
                onClick={searchBtnClick}
                sx={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    backgroundColor: theme.brand3,
                    borderRadius: "999px",
                    color: "white",
                    p: "5px 20px",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    width: "80px",
                    height: "35px",
                }}
            >
                검색
            </Button>
        </Box>
    );
}
