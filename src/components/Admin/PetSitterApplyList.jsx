import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader.jsx";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import Layout from "./Layout.jsx";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "./AdminContext.jsx";
import { fetchPendingPetSitter } from "./adminPetSitterApi.js";

const PetSitterApplyList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const adminContext = useAdmin();
    const currentFilter = adminContext.currentFilter;
    const setCurrentFilter = adminContext.setCurrentFilter;
    const page = adminContext.currentPage;
    const setPage = adminContext.setCurrentPage;
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState(rows);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPage, setTotalPage] = useState(0);

    // 각 열에 대한 스타일 객체를 미리 정의
    const cellStyles = {
        id: { width: 50, minWidth: 50, maxWidth: 50 },
        image: { width: 90, minWidth: 90, maxWidth: 90 },
        sitterExp: { width: 100, minWidth: 100, maxWidth: 100 },
        nickname: { width: 150, minWidth: 150, maxWidth: 150 },
        age: { width: 100, minWidth: 100, maxWidth: 100 },
        grown: { width: 180, minWidth: 180, maxWidth: 180 },
        houseType: { width: 120, minWidth: 120, maxWidth: 120 },
        content: { width: 350, minWidth: 350, maxWidth: 350 },
        date: { width: 200, minWidth: 200, maxWidth: 200 },
    };

    // 공통 스타일 (텍스트 오버플로우 처리)
    const commonCellStyle = {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    };

    const navigate = useNavigate();

    const rowHref = (id) => {
        navigate(`/admin/petsitter/pending/${id}`);
    };

    const loadPendingPetSitterData = async () => {
        try {
            setLoading(true);
            setError(null);

            const apiPage = Math.max(0, page - 1);
            const response = await fetchPendingPetSitter(apiPage, 10);

            if (!response || !response.content) {
                console.warn("API 응답에 데이터가 없습니다: " + response);
                setRows([]);
                setFilteredRows([]);
                setTotalPage(0);
                return;
            }

            // API 응답 가공
            const transformedData = response.content.map((item) => ({
                id: item.id,
                image: item.imagePath,
                sitterExp: item.sitterExp,
                grown: item.grown,
                nickname: item.nickname,
                age: item.age,
                petCount: item.petCount,
                houseType: item.houseType,
                comment: item.comment,
                date: new Date(item.createdAt).toLocaleString(),
            }));

            setRows(transformedData);
            setFilteredRows(transformedData);
            setTotalPage(response.totalPages || 0);
        } catch (error) {
            // console.log("펫시터 신청 목록 불러오는중 오류 발생: " + error);
            setError("펫시터 신청 목록을 불러오는중 오류가 발생했습니다");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPendingPetSitterData();
    }, [page]);

    // 필터에 따라 다른 필드를 검색하는 핸들러
    const handleSearch = (term) => {
        setSearchTerm(term);

        if (!term) {
            setFilteredRows(rows);
            return;
        }

        let filtered;

        // 현재 선택된 필터에 따라 다른 필드를 검색
        switch (currentFilter) {
            case "ID":
                // ID는 숫자이므로 정확히 일치하는지 확인
                filtered = rows.filter((row) => row.id.toString() === term);
                break;

            case "사용자 아이디":
                // 사용자 아이디(nickname)에 검색어가 포함되어 있는지 확인
                filtered = rows.filter((row) => row.nickname.toLowerCase().includes(term.toLowerCase()));
                break;

            case "코멘트":
                // 코멘트에 검색어가 포함되어 있는지 확인
                filtered = rows.filter((row) => row.comment && row.comment.toLowerCase().includes(term.toLowerCase()));
                break;

            default:
                // 기본적으로 모든 텍스트 필드에서 검색
                filtered = rows.filter(
                    (row) =>
                        row.id.toString() === term ||
                        (row.nickname && row.nickname.toLowerCase().includes(term.toLowerCase())) ||
                        (row.comment && row.comment.toLowerCase().includes(term.toLowerCase()))
                );
        }
        setFilteredRows(filtered);
    };

    // 필터 핸들러
    const handleFilterChange = (filter) => {
        setCurrentFilter(filter);
        // 실제 필터링 로직 구현
        // console.log(`필터 변경: ${filter}`);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <Layout>
            <AdminHeader onSearch={handleSearch} onFilterChange={handleFilterChange} />

            {/* 로딩 상태 표시 */}
            {loading && (
                <Box sx={{ display: "flex", alignItems: "center", my: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* 에러 메시지 표시 */}
            {error && (
                <Alert severity="error" sx={{ my: 2 }}>
                    {error}
                </Alert>
            )}

            {/* 테이블 부분 */}
            <Box>
                {!loading && !error && (
                    <TableContainer>
                        <Table sx={{ minWidth: 700 }} aria-label="펫시터 리스트">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ ...cellStyles.id, ...commonCellStyle }}>ID</TableCell>
                                    <TableCell sx={{ ...cellStyles.image, ...commonCellStyle }}>사진</TableCell>
                                    <TableCell sx={{ ...cellStyles.sitterExp, ...commonCellStyle }}>
                                        펫시터 경험
                                    </TableCell>
                                    <TableCell sx={{ ...cellStyles.nickname, ...commonCellStyle }}>
                                        사용자 아이디
                                    </TableCell>
                                    <TableCell sx={{ ...cellStyles.age, ...commonCellStyle }}>연령대</TableCell>
                                    <TableCell sx={{ ...cellStyles.grown, ...commonCellStyle }}>
                                        반려 동물 여부(마리)
                                    </TableCell>
                                    <TableCell sx={{ ...cellStyles.houseType, ...commonCellStyle }}>주거형태</TableCell>
                                    <TableCell sx={{ ...cellStyles.comment, ...commonCellStyle }}>코멘트</TableCell>
                                    <TableCell sx={{ ...cellStyles.date, ...commonCellStyle }}>등록일자</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRows.length > 0 ? (
                                    filteredRows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            onClick={() => rowHref(row.id)}
                                            sx={{
                                                "&:last-child td, &:last-child th": {
                                                    border: 0,
                                                },
                                                ":hover": {
                                                    backgroundColor: "#eeeeee",
                                                },
                                                cursor: "pointer",
                                            }}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                sx={{ ...cellStyles.id, ...commonCellStyle }}
                                            >
                                                {row.id}
                                            </TableCell>
                                            <TableCell sx={{ ...cellStyles.image }}>
                                                {row.image ? (
                                                    <Box
                                                        component="img"
                                                        sx={{
                                                            height: 80,
                                                            width: 80,
                                                            objectFit: "cover",
                                                            borderRadius: "4px",
                                                        }}
                                                        src={row.image}
                                                        alt="썸네일"
                                                    />
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            height: 80,
                                                            width: 80,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            backgroundColor: "#f0f0f0",
                                                            borderRadius: "4px",
                                                            fontSize: "0.7rem",
                                                            color: "#999",
                                                        }}
                                                    >
                                                        No Image
                                                    </Box>
                                                )}
                                            </TableCell>
                                            <TableCell sx={{ ...cellStyles.sitterExp, ...commonCellStyle }}>
                                                {row.sitterExp ? "있음" : "없음"}
                                            </TableCell>
                                            <TableCell sx={{ ...cellStyles.nickname, ...commonCellStyle }}>
                                                {row.nickname}
                                            </TableCell>
                                            <TableCell sx={{ ...cellStyles.age, ...commonCellStyle }}>
                                                {row.age}
                                            </TableCell>
                                            <TableCell sx={{ ...cellStyles.grown, ...commonCellStyle }}>
                                                {typeof row.grown === "boolean"
                                                    ? row.grown
                                                        ? "예"
                                                        : "아니오"
                                                    : row.grown}{" "}
                                                ({row.petCount || "없음"})
                                            </TableCell>
                                            <TableCell sx={{ ...cellStyles.houseType, ...commonCellStyle }}>
                                                {row.houseType}
                                            </TableCell>
                                            <TableCell sx={{ ...cellStyles.comment, ...commonCellStyle }}>
                                                {row.comment}
                                            </TableCell>
                                            <TableCell sx={{ ...cellStyles.date, ...commonCellStyle }}>
                                                {row.date}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center">
                                            신청한 펫시터가 없습니다.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* 페이지네이션 */}
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                    <Button sx={{ mx: 1 }} disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>
                        &lt;
                    </Button>

                    {totalPage > 0 &&
                        [...Array(totalPage)].map((_, index) => (
                            <Button
                                key={index}
                                sx={{
                                    mx: 1,
                                    backgroundColor: page === index + 1 ? "#E9A260" : "transparent",
                                    color: page === index + 1 ? "white" : "inherit",
                                    "&:hover": {
                                        backgroundColor: page === index + 1 ? "#E9A260" : "#f0f0f0",
                                    },
                                }}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </Button>
                        ))}

                    <Button sx={{ mx: 1 }} disabled={page >= totalPage} onClick={() => handlePageChange(page + 1)}>
                        &gt;
                    </Button>
                </Box>
            </Box>
        </Layout>
    );
};

export default PetSitterApplyList;
