import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Box,
    CircularProgress,
    Alert,
} from "@mui/material";
import AdminHeader from "./AdminHeader.jsx";
import { fetchBoards } from "./AdminBoardApi.js";

function DashBoard() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentFilter, setCurrentFilter] = useState("자유 게시판");
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);

    // 각 열에 대한 스타일 객체를 미리 정의
    const cellStyles = {
        id: { width: 80, minWidth: 80, maxWidth: 80 },
        title: { width: 200, minWidth: 200, maxWidth: 200 },
        image: { width: 100, minWidth: 100, maxWidth: 100 },
        content: { width: 350, minWidth: 350, maxWidth: 350 },
        authorNickname: { width: 80, minWidth: 80, maxWidth: 80 },
        likeCount: { width: 80, minWidth: 80, maxWidth: 80 },
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
        navigate(`/admin/board/${id}`);
    };

    const boardTypeMapping = {
        "자유 게시판": 1,
        "중고 장터": 2,
        "정보 게시판": 3,
    };

    const loadBoardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const boardTypeId = boardTypeMapping[currentFilter];
            const response = await fetchBoards(page, 10, boardTypeId);

            // API 응답 가공
            const transformApiResponse = (apiData) => {
                return apiData.map((item) => ({
                    id: item.id,
                    title: item.title,
                    content: item.content,
                    author: item.authorNickname,
                    image: item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0].url : null,
                    likeCount: item.likeCount,
                    date: new Date(item.createdAt().toLocaleString()),
                }));
            };

            // API 호출 결과 반환 및 업데이트
            const transformData = transformApiResponse(response.content || []);
            setRows(transformData);
            setFilteredRows(transformData);
            setTotalPage(response.totalPage || 0);
        } catch (error) {
            console.error("Error loading board data: " + error);
            setError("게시판 데이터를 불러오는중 오류가 발생했습니다");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBoardData();
    }, [page, currentFilter]);

    // 검색 핸들러
    const handleSearch = (term) => {
        setSearchTerm(term);

        if (!term) {
            setFilteredRows(rows);
            return;
        }

        const filtered = rows.filter(
            (row) =>
                row.title.toLowerCase().includes(term.toLowerCase()) ||
                row.content.toLowerCase().includes(term.toLowerCase())
        );

        setFilteredRows(filtered);
    };

    // 필터 핸들러
    const handleFilterChange = (filter) => {
        setCurrentFilter(filter);
        // 실제 필터링 로직 구현
        console.log(`필터 변경: ${filter}`);
        setPage(0);
    };

    // 페이지 변경 핸들러
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <Layout>
            <AdminHeader
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                selectedFilter={currentFilter}
                filters={["자유 게시판", "중고장터", "질문 게시판"]}
            />

            {/* 로딩 상태 표시 */}
            {loading && (
                <Box sx={{ display: "flex", alignItems: "center", my: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* 예약 메시지 표시 */}
            {error && (
                <Alert severity="error" sx={{ my: 2 }}>
                    {error}
                </Alert>
            )}

            {/* 테이블 부분 */}
            <Box>
                {!loading && !error && (
                    <TableContainer>
                        <Table sx={{ minWidth: 700 }} aria-label="게시글 테이블">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ ...cellStyles.id, ...commonCellStyle }}>글 번호</TableCell>
                                    <TableCell sx={{ ...cellStyles.image, ...commonCellStyle }}>사진</TableCell>
                                    <TableCell sx={{ ...cellStyles.title, ...commonCellStyle }}>제목</TableCell>
                                    <TableCell sx={{ ...cellStyles.content, ...commonCellStyle }}>내용</TableCell>
                                    <TableCell sx={{ ...cellStyles.authorNickname, ...commonCellStyle }}>
                                        작성자
                                    </TableCell>
                                    <TableCell sx={{ ...cellStyles.likeCount, ...commonCellStyle }}>좋아요</TableCell>
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
                                                {row.image && row.image.length > 0 ? (
                                                    <Box
                                                        component="img"
                                                        sx={{
                                                            height: 50,
                                                            width: 60,
                                                            objectFit: "cover",
                                                            borderRadius: "4px",
                                                        }}
                                                        src={row.image}
                                                        alt="썸네일"
                                                        onError={(e) => {
                                                            e.target.src = "/src/assets/images/default-thumbnail.png"; // 기본 이미지 경로로 대체
                                                        }}
                                                    />
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            height: 50,
                                                            width: 60,
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
                                            <TableCell sx={{ ...cellStyles.title, ...commonCellStyle }}>
                                                {row.title}
                                            </TableCell>
                                            <TableCell sx={{ ...cellStyles.content, ...commonCellStyle }}>
                                                {row.content}
                                            </TableCell>
                                            <TableCell sx={{ ...cellStyles.authorNickname, ...commonCellStyle }}>
                                                {row.authorNickname}
                                            </TableCell>
                                            <TableCell sx={{ ...cellStyles.likeCount, ...commonCellStyle }}>
                                                {row.likeCount}
                                            </TableCell>
                                            <TableCell sx={{ ...cellStyles.date, ...commonCellStyle }}>
                                                {new Date(row.createdAt).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            게시글이 없습니다.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* 페이지네이션 */}
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                    <Button sx={{ mx: 1 }} disabled={page === 0} onClick={() => handlePageChange(page - 1)}>
                        &lt;
                    </Button>

                    {[...Array(totalPage).keys()].map((pageNum) => (
                        <Button
                            key={pageNum}
                            sx={{
                                mx: 1,
                                backgroundColor: page === pageNum ? "#E9A260" : "transparent",
                                color: page === pageNum ? "white" : "inherit",
                                "&:hover": {
                                    backgroundColor: page === pageNum ? "#E9A260" : "#f0f0f0",
                                },
                            }}
                            onClick={() => handlePageChange(pageNum)}
                        >
                            {pageNum + 1}
                        </Button>
                    ))}

                    <Button sx={{ mx: 1 }} disabled={page >= totalPage - 1} onClick={() => handlePageChange(page + 1)}>
                        &gt;
                    </Button>
                </Box>
            </Box>
        </Layout>
    );
}

export default DashBoard;
