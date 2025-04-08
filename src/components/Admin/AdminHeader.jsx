import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, InputBase, Button, Menu, MenuItem, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { styled, alpha } from "@mui/material/styles";
import { useAdmin } from "./AdminContext.jsx";

const drawerWidth = 350;

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        width: "auto",
    },
    border: "1px solid #E0E0E0",
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    backgroundColor: "#FFFFFF",
    boxShadow: "none",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#888888",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "#333333",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
}));

const FilterButton = styled(Button)(({ theme }) => ({
    marginRight: theme.spacing(2),
    backgroundColor: "#FFFFFF",
    color: "#333333",
    border: "1px solid #E0E0E0",
    boxShadow: "none",
    "&:hover": {
        backgroundColor: "#F5F5F5",
        boxShadow: "none",
    },
}));

const AdminHeader = ({
    onSearch,
    onFilterChange,
    filters = ["자유 게시판", "질문 게시판", "정보 게시판", "중고장터"],
    selectedFilter = "자유 게시판",
}) => {
    const { selectedMenu } = useAdmin();
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentFilter, setCurrentFilter] = useState(selectedFilter);
    const [searchTerm, setSearchTerm] = useState("");

    const open = Boolean(anchorEl);

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    const handleFilterSelect = (filter) => {
        setCurrentFilter(filter);
        if (onFilterChange) {
            onFilterChange(filter);
        }
        handleFilterClose();
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        if (event.key === "Enter" && onSearch) {
            onSearch(searchTerm);
        }
    };

    const handleReset = () => {
        setSearchTerm("");
        if (onSearch) {
            onSearch("");
        }
    };

    return (
        <StyledAppBar>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                    padding: 1,
                    position: "relative",
                    backgroundColor: "#f9f9fb",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        minWidth: "15%",
                    }}
                >
                    <Typography
                        variant="h6"
                        component="h1"
                        sx={{
                            ml: 5,
                            fontWeight: "bold",
                            color: "black",
                        }}
                    >
                        {selectedMenu ? selectedMenu : "게시글 목록"}
                    </Typography>
                </Box>

                {/* Toolbar 부분 - 위치 고정 */}
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                    }}
                >
                    <Toolbar
                        sx={{
                            p: 1,
                            borderRadius: 1,
                            display: "flex",
                            width: "100%",
                        }}
                    >
                        <FilterButton
                            variant="contained"
                            startIcon={<FilterListIcon />}
                            endIcon={<KeyboardArrowDownIcon />}
                            onClick={handleFilterClick}
                            disableElevation
                            sx={{ height: "41px", width: "200px" }}
                        >
                            {currentFilter}
                        </FilterButton>

                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleFilterClose}
                            elevation={2}
                            sx={{
                                width: 405, // 픽셀 단위로 지정 (더 정확한 크기 조절)
                                "& .MuiPaper-root": {
                                    width: 405, // 내부 Paper 컴포넌트의 너비도 같이 설정
                                    maxWidth: "49%", // 화면 크기에 따른 최대 너비 제한
                                },
                            }}
                        >
                            {filters.map((filter) => (
                                <MenuItem
                                    key={filter}
                                    onClick={() => handleFilterSelect(filter)}
                                    selected={filter === currentFilter}
                                    sx={{ width: "100%" }} // MenuItem의 너비를 부모 컨테이너에 맞춤
                                >
                                    {filter}
                                </MenuItem>
                            ))}
                        </Menu>

                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="검색"
                                inputProps={{ "aria-label": "search" }}
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onKeyPress={handleSearchSubmit}
                                sx={{ width: "1000px" }}
                            />
                        </Search>

                        <IconButton size="large" sx={{ color: "#F0A355" }} onClick={handleReset}>
                            <RefreshIcon />
                        </IconButton>
                    </Toolbar>
                </Box>
            </Box>
        </StyledAppBar>
    );
};

export default AdminHeader;
