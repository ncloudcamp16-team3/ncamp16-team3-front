import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    InputBase,
    Button,
    Menu,
    MenuItem,
    Box,
    Select,
    FormControl,
} from "@mui/material";
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

const StyledSelect = styled(Select)(({ theme }) => ({
    marginRight: theme.spacing(2),
    backgroundColor: "#FFFFFF",
    color: "#333333",
    width: "150px",
    height: "41px",
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#E0E0E0",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#E0E0E0",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#F0A355",
    },
}));

const AdminHeader = ({ onSearch, onFilterChange }) => {
    const {
        selectedMenu,
        searchField,
        setSearchField,
        searchTerm: contextSearchTerm,
        setSearchTerm: setContextSearchTerm,
        executeSearch,
        availableSearchFields,
        currentCategory,
        setCurrentCategory,
        availableCategoryFilters,
    } = useAdmin();

    const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const categoryMenuOpen = Boolean(categoryAnchorEl);

    // 카테고리 필터 버튼 클릭 핸들러
    const handleCategoryFilterClick = (event) => {
        setCategoryAnchorEl(event.currentTarget);
    };

    const handleCategoryFilterClose = () => {
        setCategoryAnchorEl(null);
    };

    // 카테고리 필터 선택 핸들러
    const handleCategorySelect = (category) => {
        setCurrentCategory(category);
        if (onFilterChange) {
            onFilterChange(category);
        }
        handleCategoryFilterClose();
    };

    // 검색 필드 변경 핸들러
    const handleSearchFieldChange = (event) => {
        setSearchField(event.target.value);
    };

    // 검색어 변경 핸들러
    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // 검색 실행 핸들러
    const handleSearchSubmit = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            executeSearch(searchTerm, searchField);
            if (onSearch) {
                onSearch(searchTerm, searchField);
            }
        }
    };

    // 검색 초기화 핸들러
    const handleReset = () => {
        setSearchTerm("");
        executeSearch("", searchField);
        if (onSearch) {
            onSearch("", searchField);
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
                        {/* 카테고리 필터 버튼 */}
                        {availableCategoryFilters.length > 1 && (
                            <>
                                <FilterButton
                                    variant="contained"
                                    startIcon={<FilterListIcon />}
                                    endIcon={<KeyboardArrowDownIcon />}
                                    onClick={handleCategoryFilterClick}
                                    disableElevation
                                    sx={{ height: "41px", width: "180px" }}
                                >
                                    {currentCategory}
                                </FilterButton>

                                <Menu
                                    anchorEl={categoryAnchorEl}
                                    open={categoryMenuOpen}
                                    onClose={handleCategoryFilterClose}
                                    elevation={2}
                                    sx={{
                                        width: 180,
                                        "& .MuiPaper-root": {
                                            width: 180,
                                        },
                                    }}
                                >
                                    {availableCategoryFilters.map((category) => (
                                        <MenuItem
                                            key={category}
                                            onClick={() => handleCategorySelect(category)}
                                            selected={category === currentCategory}
                                            sx={{ width: "100%" }}
                                        >
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                        )}

                        {/* 검색 필드 선택 드롭다운 */}
                        {availableSearchFields.length > 0 && (
                            <FormControl variant="outlined" size="small">
                                <StyledSelect value={searchField} onChange={handleSearchFieldChange} displayEmpty>
                                    {availableSearchFields.map((field) => (
                                        <MenuItem key={field} value={field}>
                                            {field}
                                        </MenuItem>
                                    ))}
                                </StyledSelect>
                            </FormControl>
                        )}

                        {/* 검색창 */}
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder={`${searchField || "전체"} 검색...`}
                                inputProps={{ "aria-label": "search" }}
                                value={searchTerm}
                                onChange={handleSearchTermChange}
                                onKeyPress={handleSearchSubmit}
                                sx={{ width: "100%", minWidth: "300px" }}
                            />
                        </Search>

                        {/* 검색 초기화 버튼 */}
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
