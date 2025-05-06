import React, { useEffect, useRef, useState } from "react";
import { Box, Button, InputBase, Collapse } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function SearchBar({ openSearch, setOpenSearch, keywordSearch }) {
    const theme = useTheme();
    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState("");
    const [width, setWidth] = useState("250px");
    useEffect(() => {
        const updateWidth = () => {
            const width = window.innerWidth;
            const layoutWidth = 500;
            if (width <= layoutWidth) {
                setWidth("130px");
            } else {
                setWidth("250px");
            }
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    const searchBtnClick = () => {
        if (openSearch && inputValue.trim()) {
            searchRequest(inputValue);
        } else {
            setOpenSearch(true);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const handleFocus = () => {
        inputRef.current?.focus();
    };

    const searchRequest = (keyword) => {
        setOpenSearch(false);
        keywordSearch(keyword);
        setInputValue(""); // 검색 후 초기화
    };

    return (
        <Box
            sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                width: "100%",
                height: "35px",
            }}
        >
            <Collapse
                in={openSearch}
                orientation="horizontal"
                collapsedSize={0}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    transition: "width 0.3s ease",
                    mr: 1,
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
                        px: 2,
                        borderRadius: "999px",
                        backgroundColor: theme.brand2,
                        height: "35px",
                        width: { width },
                        boxShadow: 1,
                    }}
                />
            </Collapse>
            <Button
                onClick={searchBtnClick}
                sx={{
                    backgroundColor: theme.brand3,
                    borderRadius: "999px",
                    color: "white",
                    fontWeight: "bold",
                    width: "75px",
                    height: "35px",
                    minWidth: "75px",
                    whiteSpace: "nowrap",
                }}
            >
                검색
            </Button>
        </Box>
    );
}
