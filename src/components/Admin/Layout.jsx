import React, { useState, useEffect } from "react";
import {
    Box,
    Drawer,
    List,
    Typography,
    Divider,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Collapse,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAdmin } from "./AdminContext.jsx";

// 아이콘 import
import GridViewIcon from "@mui/icons-material/GridView";
import ArticleIcon from "@mui/icons-material/Article";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import icon from "../../assets/images/Global/icon1.svg";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

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
        borderRight: "1px solid #eeeeee",
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

const StyledListItemButton2 = styled(ListItemButton)(({ theme }) => ({
    borderRadius: "8px",
    margin: "0px 8px",
    "&.Mui-selected": {
        backgroundColor: "#E9A260",
        color: "white",
        "& .MuiListItemIcon-root": {
            color: "white",
        },
    },
    "&:hover": {
        backgroundColor: "#ff8484",
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
    const { setSelectedMenu } = useAdmin();
    const location = useLocation();
    const navigate = useNavigate();

    // URL에 따라 초기 아코디언 상태 결정
    const initialPath = location.pathname;

    const [selectedIndex, setSelectedIndex] = useState(0); // 초기값을 0으로 설정
    const [openPosts, setOpenPosts] = useState(initialPath.includes("/admin/board"));
    const [openPetsitter, setOpenPetsitter] = useState(initialPath.includes("/admin/petsitter"));
    const [openCompany, setOpenCompany] = useState(initialPath.includes("/admin/facility"));

    const handleListItemClick = (index, menuTitle) => {
        setSelectedIndex(index);
        setSelectedMenu(menuTitle);
        if (index === 1) {
            navigate(`/admin/board/list`);
        } else if (index === 2) {
            navigate(`/admin/board/post`);
        } else if (index === 3) {
            navigate("/admin/petsitter/list");
        } else if (index === 4) {
            navigate("/admin/petsitter/apply");
        } else if (index === 5) {
            navigate("/admin/facility/list");
        } else if (index === 6) {
            navigate("/admin/facility/apply");
        }
    };

    const logout = () => {
        navigate("/admin");
    };

    // 게시글 관리 아코디언 토글 - 단순히 열고 닫는 기능만 수행
    const handlePostsClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setOpenPosts(!openPosts);

        // 다른 아코디언 닫기
        if (!openPosts) {
            setOpenPetsitter(false);
            setOpenCompany(false);
        }
    };

    // 펫시터 관리 아코디언 토글 - 단순히 열고 닫는 기능만 수행
    const handlePetsitterClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setOpenPetsitter(!openPetsitter);

        // 다른 아코디언 닫기
        if (!openPetsitter) {
            setOpenPosts(false);
            setOpenCompany(false);
        }
    };

    // 업체 관리 아코디언 토글 - 단순히 열고 닫는 기능만 수행
    const handleCompanyClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setOpenCompany(!openCompany);

        // 다른 아코디언 닫기
        if (!openCompany) {
            setOpenPosts(false);
            setOpenPetsitter(false);
        }
    };

    // 2. URL 변경 시 선택된 메뉴 항목만 업데이트
    useEffect(() => {
        const path = location.pathname;

        // URL에 따라 선택된 메뉴 항목 설정 (아코디언 상태는 수정하지 않음)
        if (path.includes("/admin/board/list")) {
            setSelectedIndex(1);
            setSelectedMenu("게시글 목록");
        } else if (path.includes("/admin/board/post")) {
            setSelectedIndex(2);
            setSelectedMenu("공지글 작성");
        } else if (path.includes("/admin/petsitter/list")) {
            setSelectedIndex(3);
            setSelectedMenu("펫시터 목록");
        } else if (path.includes("/admin/petsitter/apply")) {
            setSelectedIndex(4);
            setSelectedMenu("펫시터 신청목록");
        } else if (path.includes("/admin/facility/list")) {
            setSelectedIndex(5);
            setSelectedMenu("업체 목록");
        } else if (path.includes("/admin/facility/apply")) {
            setSelectedIndex(6);
            setSelectedMenu("업체 등록");
        }
    }, [location]);

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
                                margin: "1px 8px",
                                paddingLeft: 0,
                                borderTopRightRadius: 0,
                                borderTopLeftRadius: 0,
                            }}
                        >
                            {/* 하위 메뉴에 SubMenuListItemButton 사용 - #F2DFCE 색상 적용 */}
                            <SubMenuListItemButton
                                selected={selectedIndex === 1}
                                onClick={() => handleListItemClick(1, "게시글 목록")}
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
                                onClick={() => handleListItemClick(2, "공지글 작성")}
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
                                onClick={() => handleListItemClick(3, "펫시터 목록")}
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
                                onClick={() => handleListItemClick(4, "펫시터 신청목록")}
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
                                onClick={() => handleListItemClick(5, "업체 목록")}
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
                                onClick={() => handleListItemClick(6, "업체 등록")}
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
                    <StyledListItemButton2 onClick={logout}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="로그아웃" />
                    </StyledListItemButton2>
                </Box>
            </StyledDrawer>

            {/* 메인 컨텐츠 영역 */}
            <Box sx={{ flexGrow: 1 }}>
                {/* 헤더 */}
                {/*<Box sx={{ p: 2, borderBottom: "1px solid #F0F0F0" }}></Box>*/}

                {/* 메인 컨텐츠 */}
                <Main
                    sx={{
                        marginTop: 5,
                        paddingLeft: 4,
                        paddingRight: 4,
                    }}
                >
                    {children}
                </Main>
            </Box>
        </Box>
    );
};

export default Layout;
