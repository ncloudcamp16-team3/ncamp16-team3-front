import React, { useState, useEffect } from "react";
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
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(1),
    backgroundColor: "#FFFFFF",
}));

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

// 일반 메뉴 아이템 스타일링 - 여기서 선택된 배경색을 #E9A260으로 변경
const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
    borderRadius: "8px",
    margin: "0px 8px",
    "&.Mui-selected": {
        backgroundColor: "#E9A260",
        color: "white",
        "& .MuiListItemIcon-root": {
            color: "white",
        },
    },
    "&.Mui-selected:hover": {
        backgroundColor: "#E9A260",
    },
    "&:hover": {
        backgroundColor: "#efa969",
    },
}));

// 하위 메뉴 아이템을 위한 스타일 컴포넌트
const SubMenuListItemButton = styled(ListItemButton)(({ theme }) => ({
    borderRadius: "8px",
    margin: "0px 8px",
    // 하위 메뉴가 선택되었을 때 #F2DFCE 배경색 사용
    "&.Mui-selected": {
        backgroundColor: "#F2DFCE",
        // 색상이 밝아서 텍스트는 기본 색상 유지
        "& .MuiListItemIcon-root": {
            color: "inherit",
        },
    },
    "&.Mui-selected:hover": {
        backgroundColor: "#F2DFCE",
    },
    "&:hover": {
        backgroundColor: "#fff7ec",
    },
}));

// 아코디언 헤더를 위한 새로운 스타일 컴포넌트
const AccordionHeaderButton = styled(ListItemButton)(({ open }) => ({
    borderRadius: "8px",
    margin: "0px 8px",
    backgroundColor: open ? "#E9A260" : "transparent",
    borderBottomLeftRadius: open ? 0 : "8px",
    borderBottomRightRadius: open ? 0 : "8px",
    color: open ? "white" : "inherit",
    "& .MuiListItemIcon-root": {
        color: open ? "white" : "inherit",
    },
    "&:hover": {
        backgroundColor: open ? "#E9A260" : "#efa969",
    },
    // 선택 상태에 대한 스타일 추가
    "&.Mui-selected": {
        backgroundColor: "#E9A260",
        color: "white",
        "& .MuiListItemIcon-root": {
            color: "white",
        },
    },
    "&.Mui-selected:hover": {
        backgroundColor: "#E9A260",
    },
}));

const Layout = ({ children }) => {
    const [selectedIndex, setSelectedIndex] = useState(1); // 초기값을 1로 설정 (게시글 목록)
    const [openPosts, setOpenPosts] = useState(true); // 게시글 관리 아코디언 열림/닫힘 상태
    const [openPetsitter, setOpenPetsitter] = useState(false); // 펫시터 관리 아코디언 열림/닫힘 상태
    const [openCompany, setOpenCompany] = useState(false); // 업체 관리 아코디언 열림/닫힘 상태

    const handleListItemClick = (index) => {
        setSelectedIndex(index);
    };

    // 게시글 관리 아코디언 토글
    const handlePostsClick = (event) => {
        // 이벤트 전파 중지
        event.preventDefault();
        event.stopPropagation();

        // 현재 상태의 반대값
        const newOpenState = !openPosts;

        // 열리는 경우에만 다른 아코디언들을 닫음
        if (newOpenState) {
            setOpenPetsitter(false);
            setOpenCompany(false);
        }

        setOpenPosts(newOpenState);
    };

    // 펫시터 관리 아코디언 토글
    const handlePetsitterClick = (event) => {
        // 이벤트 전파 중지
        event.preventDefault();
        event.stopPropagation();

        // 현재 상태의 반대값
        const newOpenState = !openPetsitter;

        // 열리는 경우에만 다른 아코디언들을 닫음
        if (newOpenState) {
            setOpenPosts(false);
            setOpenCompany(false);
        }

        setOpenPetsitter(newOpenState);
    };

    // 업체 관리 아코디언 토글
    const handleCompanyClick = (event) => {
        // 이벤트 전파 중지
        event.preventDefault();
        event.stopPropagation();

        // 현재 상태의 반대값
        const newOpenState = !openCompany;

        // 열리는 경우에만 다른 아코디언들을 닫음
        if (newOpenState) {
            setOpenPosts(false);
            setOpenPetsitter(false);
        }

        setOpenCompany(newOpenState);
    };

    // 컴포넌트 초기 마운트 시 기본 선택 상태 설정
    useEffect(() => {
        // 게시글 관리 아코디언을 열고, 게시글 목록(인덱스 1)을 선택
        setOpenPosts(true);
        setOpenPetsitter(false);
        setOpenCompany(false);
        setSelectedIndex(1);
    }, []); // 빈 의존성 배열: 컴포넌트 최초 마운트 시에만 실행

    return (
        <Box sx={{ display: "flex" }}>
            {/* 사이드바 */}
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
                    <AccordionHeaderButton open={openPosts} onClick={handlePostsClick}>
                        <ListItemIcon>
                            <GridViewIcon />
                        </ListItemIcon>
                        <ListItemText primary="게시글 관리" />
                        {/* 확장/축소 아이콘 */}
                        {openPosts ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </AccordionHeaderButton>

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
                            {/* 하위 메뉴에 SubMenuListItemButton 사용 - #F2DFCE 색상 적용 */}
                            <SubMenuListItemButton
                                selected={selectedIndex === 1}
                                onClick={() => handleListItemClick(1)}
                                sx={{
                                    "&.Mui-selected": {
                                        backgroundColor: "#F2DFCE",
                                    },
                                    "&.Mui-selected:hover": {
                                        backgroundColor: "#F2DFCE",
                                    },
                                }}
                            >
                                <ListItemIcon>
                                    <ArticleIcon />
                                </ListItemIcon>
                                <ListItemText primary="게시글 목록" />
                            </SubMenuListItemButton>

                            <SubMenuListItemButton
                                selected={selectedIndex === 2}
                                onClick={() => handleListItemClick(2)}
                                sx={{
                                    "&.Mui-selected": {
                                        backgroundColor: "#F2DFCE",
                                    },
                                    "&.Mui-selected:hover": {
                                        backgroundColor: "#F2DFCE",
                                    },
                                }}
                            >
                                <ListItemIcon>
                                    <FormatListBulletedIcon />
                                </ListItemIcon>
                                <ListItemText primary="공지글 작성" />
                            </SubMenuListItemButton>
                        </List>
                    </Collapse>
                </MenuSection>

                <Divider sx={{ mx: 2 }} />

                <MenuSection>
                    {/* 펫시터 관리 - 아코디언 헤더 */}
                    <AccordionHeaderButton open={openPetsitter} onClick={handlePetsitterClick}>
                        <ListItemIcon>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary="펫시터 관리" />
                        {/* 확장/축소 아이콘 */}
                        {openPetsitter ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </AccordionHeaderButton>

                    {/* 펫시터 관리 하위 메뉴 */}
                    <Collapse in={openPetsitter} timeout="auto" unmountOnExit>
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
                            {/* 펫시터 목록 메뉴 */}
                            <SubMenuListItemButton
                                selected={selectedIndex === 3}
                                onClick={() => handleListItemClick(3)}
                                sx={{
                                    "&.Mui-selected": {
                                        backgroundColor: "#F2DFCE",
                                    },
                                    "&.Mui-selected:hover": {
                                        backgroundColor: "#F2DFCE",
                                    },
                                }}
                            >
                                <ListItemIcon>
                                    <PersonIcon />
                                </ListItemIcon>
                                <ListItemText primary="펫시터 목록" />
                            </SubMenuListItemButton>

                            {/* 펫시터 신청목록 메뉴 */}
                            <SubMenuListItemButton
                                selected={selectedIndex === 4}
                                onClick={() => handleListItemClick(4)}
                                sx={{
                                    "&.Mui-selected": {
                                        backgroundColor: "#F2DFCE",
                                    },
                                    "&.Mui-selected:hover": {
                                        backgroundColor: "#F2DFCE",
                                    },
                                }}
                            >
                                <ListItemIcon>
                                    <FormatListBulletedIcon />
                                </ListItemIcon>
                                <ListItemText primary="펫시터 신청목록" />
                            </SubMenuListItemButton>
                        </List>
                    </Collapse>

                    {/* 업체 관리 아코디언 헤더 */}
                    <AccordionHeaderButton open={openCompany} onClick={handleCompanyClick}>
                        <ListItemIcon>
                            <GroupsIcon />
                        </ListItemIcon>
                        <ListItemText primary="업체 관리" />
                        {/* 확장/축소 아이콘 */}
                        {openCompany ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </AccordionHeaderButton>

                    {/* 업체 관리 하위 메뉴 */}
                    <Collapse in={openCompany} timeout="auto" unmountOnExit>
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
                            {/* 업체 목록 메뉴 */}
                            <SubMenuListItemButton
                                selected={selectedIndex === 5}
                                onClick={() => handleListItemClick(5)}
                                sx={{
                                    "&.Mui-selected": {
                                        backgroundColor: "#F2DFCE",
                                    },
                                    "&.Mui-selected:hover": {
                                        backgroundColor: "#F2DFCE",
                                    },
                                }}
                            >
                                <ListItemIcon>
                                    <GroupsIcon />
                                </ListItemIcon>
                                <ListItemText primary="업체 목록" />
                            </SubMenuListItemButton>

                            {/* 업체 등록 메뉴 */}
                            <SubMenuListItemButton
                                selected={selectedIndex === 6}
                                onClick={() => handleListItemClick(6)}
                                sx={{
                                    "&.Mui-selected": {
                                        backgroundColor: "#F2DFCE",
                                    },
                                    "&.Mui-selected:hover": {
                                        backgroundColor: "#F2DFCE",
                                    },
                                }}
                            >
                                <ListItemIcon>
                                    <FormatListBulletedIcon />
                                </ListItemIcon>
                                <ListItemText primary="업체 등록" />
                            </SubMenuListItemButton>
                        </List>
                    </Collapse>
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
                            <StyledInputBase placeholder="검색" inputProps={{ "aria-label": "search" }} />
                        </Search>
                        <IconButton size="large" color="inherit" sx={{ color: "#F0A355" }}>
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
