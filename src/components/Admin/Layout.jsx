import React, { useState } from "react";
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    InputBase,
    IconButton,
    Collapse,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";

// 아이콘 import
import GridViewIcon from "@mui/icons-material/GridView";
import ArticleIcon from "@mui/icons-material/Article";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import icon from "../../assets/images/Global/icon1.svg";

// 사이드바 너비 정의
const drawerWidth = 350;

// 사이드바 스타일링
const StyledDrawer = styled(Drawer)(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
        width: drawerWidth,
        boxSizing: "border-box",
        backgroundColor: "#FFFFFF",
        borderRight: "none",
    },
}));

// 헤더 스타일링
const StyledAppBar = styled(AppBar)(({ theme }) => ({
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    backgroundColor: "#FFFFFF",
    boxShadow: "none",
    borderBottom: "1px solid #F0F0F0",
}));

// 검색창 스타일링
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

// 메인 컨텐츠 스타일링
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme }) => ({
        flexGrow: 1,
        padding: theme.spacing(1),
        backgroundColor: "#FFFFFF",
    })
);

// 커스텀 스타일 컴포넌트
const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2),
    color: "#E9A260",
    fontWeight: "bold",
}));

const MenuSection = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const StyledListItemButton = styled(ListItemButton)(({ selected }) => ({
    borderRadius: "8px",
    margin: "0px 8px",
    backgroundColor: selected ? "#673e19" : "transparent",
    "&:hover": {
        backgroundColor: "#fff7ec",
    },
}));

const Layout = ({ children }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [openPosts, setOpenPosts] = useState(true); // 아코디언 열림/닫힘 상태

    const handleListItemClick = (index) => {
        setSelectedIndex(index);
    };

    // 게시글 관리 아코디언 토글 - 이벤트 전파 중지 추가
    const handlePostsClick = (event) => {
        // 이벤트 전파 중지 (중요!)
        event.preventDefault();
        event.stopPropagation();
        setOpenPosts(!openPosts);
    };

    return (
        <Box sx={{ display: "flex" }}>
            {/* 사이드바 - component="a" 속성 제거 */}
            <StyledDrawer variant="permanent" anchor="left">
                <DrawerHeader style={{ justifyContent: "center" }}>
                    <Box
                        component="img"
                        src={icon}
                        alt="아이콘"
                        sx={{
                            objectFit: "contain",
                            margin: "0 6px 3px 0",
                        }}
                    />
                    <Typography variant="h5">꼬리친구들</Typography>
                </DrawerHeader>

                <MenuSection>
                    {/* 게시글 관리 - 아코디언 헤더 */}
                    <StyledListItemButton
                        onClick={handlePostsClick}
                        sx={{
                            backgroundColor:
                                selectedIndex === 0 ||
                                selectedIndex === 1 ||
                                selectedIndex === 2
                                    ? "#F2DFCE"
                                    : "transparent",
                            marginBottom: 0,
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                        }}
                    >
                        <ListItemIcon>
                            <GridViewIcon />
                        </ListItemIcon>
                        <ListItemText primary="게시글 관리" />
                        {/* 확장/축소 아이콘 */}
                        {openPosts ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </StyledListItemButton>

                    {/* 게시글 관리 하위 메뉴 - Collapse로 감싸기 */}
                    <Collapse in={openPosts} timeout="auto" unmountOnExit>
                        <List
                            component="div"
                            disablePadding
                            sx={{
                                pl: 4,
                                backgroundColor: "#FDF1E5",
                                margin: "0 8px",
                                paddingLeft: 0,
                                borderTopRightRadius: 0,
                                borderTopLeftRadius: 0,
                            }}
                        >
                            <StyledListItemButton
                                selected={selectedIndex === 1}
                                onClick={() => handleListItemClick(1)}
                            >
                                <ListItemIcon>
                                    <ArticleIcon />
                                </ListItemIcon>
                                <ListItemText primary="게시글 목록" />
                            </StyledListItemButton>

                            <StyledListItemButton
                                selected={selectedIndex === 2}
                                onClick={() => handleListItemClick(2)}
                            >
                                <ListItemIcon>
                                    <FormatListBulletedIcon />
                                </ListItemIcon>
                                <ListItemText primary="공지글 작성" />
                            </StyledListItemButton>
                        </List>
                    </Collapse>
                </MenuSection>

                <Divider sx={{ mx: 2 }} />

                <MenuSection>
                    <StyledListItemButton
                        selected={selectedIndex === 3}
                        onClick={() => handleListItemClick(3)}
                    >
                        <ListItemIcon>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary="펫시터 관리" />
                    </StyledListItemButton>

                    <StyledListItemButton
                        selected={selectedIndex === 4}
                        onClick={() => handleListItemClick(4)}
                    >
                        <ListItemIcon>
                            <GroupsIcon />
                        </ListItemIcon>
                        <ListItemText primary="업체 관리" />
                    </StyledListItemButton>
                </MenuSection>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ p: 2 }}>
                    <StyledListItemButton onClick={() => alert("로그아웃")}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="로그아웃" />
                    </StyledListItemButton>
                </Box>
            </StyledDrawer>

            {/* 메인 컨텐츠 영역 */}
            <Box sx={{ flexGrow: 1 }}>
                {/* 헤더 */}
                <StyledAppBar position="fixed">
                    <Toolbar>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{
                                flexGrow: 0,
                                display: { xs: "none", sm: "block" },
                                color: "#333333",
                            }}
                        >
                            게시글 관리
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="검색"
                                inputProps={{ "aria-label": "search" }}
                            />
                        </Search>
                        <IconButton
                            size="large"
                            color="inherit"
                            sx={{ color: "#F0A355" }}
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Toolbar>
                </StyledAppBar>

                {/* 메인 컨텐츠 */}
                <Main
                    sx={{
                        marginTop: 5,
                        paddingLeft: 8,
                        paddingRight: 8,
                    }}
                >
                    {children}
                </Main>
            </Box>
        </Box>
    );
};

export default Layout;
