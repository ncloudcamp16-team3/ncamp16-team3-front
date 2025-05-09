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

    const handleButtonClick = () => {
        if (openSearch) {
            // 이미 열려있는 경우: 입력값이 있으면 검색 실행, 없으면 닫기
            if (inputValue.trim()) {
                searchRequest(inputValue);
            } else {
                setOpenSearch(false); // 검색창 닫기
            }
        } else {
            // 닫혀있는 경우: 검색창 열기
            setOpenSearch(true);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const handleFocus = () => {
        inputRef.current?.focus();
    };

    const searchRequest = (keyword) => {
        keywordSearch(keyword);
        setInputValue(""); // 검색 후 초기화
        // 검색 실행 후에는 검색창을 닫지 않음 (필요하면 여기에 setOpenSearch(false) 추가)
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
                onClick={handleButtonClick}
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
                {openSearch ? "닫기" : "검색"}
            </Button>
        </Box>
    );
}
