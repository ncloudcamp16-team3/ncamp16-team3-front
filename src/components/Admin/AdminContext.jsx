import React, { createContext, useState, useContext, useEffect, useMemo } from "react";

// Context 생성
const AdminContext = createContext();

// 메뉴별 검색 필터 매핑 정의 (각 메뉴에서 검색할 수 있는 필드들)
const menuSearchFiltersMap = {
    "게시글 목록": ["제목", "내용", "작성자"],
    "펫시터 목록": ["닉네임", "연령대", "주거형태", "코멘트"],
    "펫시터 신청목록": ["닉네임", "연령대", "주거형태", "코멘트"],
    "업체 목록": ["업체명", "주소", "전화번호", "상세내용"],
};

// 메뉴별 카테고리 필터 매핑 정의 (카테고리별 필터링)
const menuCategoryFiltersMap = {
    "게시글 목록": ["전체", "자유게시판", "중고장터", "정보게시판"],
    "펫시터 목록": ["전체"],
    "펫시터 신청목록": ["전체"],
    "업체 목록": ["전체", "호텔", "미용실", "카페"],
};

// Context Provider 컴포넌트
export const AdminProvider = ({ children }) => {
    const [selectedMenu, setSelectedMenu] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [adminEmail, setAdminEmail] = useState("");

    // 검색 관련 상태
    const [searchField, setSearchField] = useState(""); // 검색할 필드
    const [searchTerm, setSearchTerm] = useState(""); // 검색어

    // 카테고리 필터링 관련 상태
    const [currentCategory, setCurrentCategory] = useState("전체");
    const [currentPage, setCurrentPage] = useState(1);

    // 현재 메뉴에서 사용 가능한 검색 필드들
    const availableSearchFields = useMemo(() => {
        return menuSearchFiltersMap[selectedMenu] || [];
    }, [selectedMenu]);

    // 현재 메뉴에서 사용 가능한 카테고리 필터들
    const availableCategoryFilters = useMemo(() => {
        return menuCategoryFiltersMap[selectedMenu] || ["전체"];
    }, [selectedMenu]);

    // 메뉴가 변경될 때 기본 검색 필드와 카테고리 설정
    useEffect(() => {
        if (selectedMenu) {
            if (availableSearchFields.length > 0) {
                setSearchField(availableSearchFields[0]);
            }
            if (availableCategoryFilters.length > 0) {
                setCurrentCategory("전체"); // 메뉴 변경 시 항상 '전체'로 초기화
            }
        }
    }, [selectedMenu, availableSearchFields, availableCategoryFilters]);

    // 로컬 스토리지에서 토큰 확인
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("adminToken");

            if (token) {
                try {
                    const response = await fetch("/api/admin/auth/validate", {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (!response.ok) {
                        throw new Error("토큰 검증 실패");
                    }

                    const data = await response.json();

                    if (data.valid) {
                        const adminEmail = localStorage.getItem("adminEmail") || data.email;
                        setAdminEmail(adminEmail);
                        setIsAuthenticated(true);
                    } else {
                        throw new Error("유효하지 않은 토큰");
                    }
                } catch (error) {
                    console.log("인증 확인 오류: " + error);
                    localStorage.removeItem("adminToken");
                    localStorage.removeItem("adminEmail");
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    // 로그인 함수
    const login = async (email, password) => {
        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "로그인에 실패했습니다");
            }

            const data = await response.json();

            localStorage.setItem("adminToken", data.token);
            localStorage.setItem("adminEmail", email);

            setAdminEmail(email);
            setIsAuthenticated(true);

            return data;
        } catch (error) {
            console.log("로그인 오류: " + error);
            throw error;
        }
    };

    // 로그아웃 함수
    const logout = async () => {
        const token = localStorage.getItem("adminToken");

        if (token) {
            try {
                await fetch("/api/admin/logout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (error) {
                console.log("로그아웃 API 오류: " + error);
            }
        }

        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
        setAdminEmail("");
        setIsAuthenticated(false);
        setSelectedMenu("");
        setSearchField("");
        setSearchTerm("");
        setCurrentCategory("전체");
    };

    // 검색 실행 함수
    const executeSearch = (term, field) => {
        setSearchTerm(term || "");
        if (field) {
            setSearchField(field);
        }
        // 검색 시 첫 페이지로 이동
        setCurrentPage(1);
    };

    const contextValue = {
        // 인증 관련
        isAuthenticated,
        loading,
        adminEmail,
        login,
        logout,

        // 메뉴 관련
        selectedMenu,
        setSelectedMenu,

        // 카테고리 필터 관련
        currentCategory,
        setCurrentCategory,
        availableCategoryFilters,

        // 검색 관련
        searchField,
        setSearchField,
        searchTerm,
        setSearchTerm,
        availableSearchFields,
        executeSearch,

        // 페이지네이션 관련
        currentPage,
        setCurrentPage,
    };

    return <AdminContext.Provider value={contextValue}>{children}</AdminContext.Provider>;
};

// 커스텀 Hook으로 Context 사용을 간편하게
export const useAdmin = () => useContext(AdminContext);
