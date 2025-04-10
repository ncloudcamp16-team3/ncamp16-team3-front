import React, { useState } from "react";
import Layout from "./Layout";
import rows from "../../mock/Admin/board.json";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box } from "@mui/material";
import AdminHeader from "./AdminHeader.jsx";

function DashBoard() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentFilter, setCurrentFilter] = useState("자유 게시판");
    const [filteredRows, setFilteredRows] = useState(rows);

    // 각 열에 대한 스타일 객체를 미리 정의
    const cellStyles = {
        id: { width: 80, minWidth: 80, maxWidth: 80 },
        title: { width: 200, minWidth: 200, maxWidth: 200 },
        image: { width: 100, minWidth: 100, maxWidth: 100 },
        content: { width: 350, minWidth: 350, maxWidth: 350 },
        jellyCount: { width: 80, minWidth: 80, maxWidth: 80 },
        views: { width: 100, minWidth: 100, maxWidth: 100 },
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
    };

    return (
        <Layout>
            <AdminHeader
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                selectedFilter={currentFilter}
                filters={["자유 게시판", "질문 게시판", "정보 게시판", "중고장터"]}
            />

            {/* 테이블 부분 */}
            <Box>
                <TableContainer>
                    <Table sx={{ minWidth: 700 }} aria-label="게시글 테이블">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ ...cellStyles.id, ...commonCellStyle }}>글 번호</TableCell>
                                <TableCell sx={{ ...cellStyles.image, ...commonCellStyle }}>사진</TableCell>
                                <TableCell sx={{ ...cellStyles.title, ...commonCellStyle }}>제목</TableCell>
                                <TableCell sx={{ ...cellStyles.content, ...commonCellStyle }}>내용</TableCell>
                                <TableCell sx={{ ...cellStyles.jellyCount, ...commonCellStyle }}>젤리수</TableCell>
                                <TableCell sx={{ ...cellStyles.views, ...commonCellStyle }}>조회수</TableCell>
                                <TableCell sx={{ ...cellStyles.date, ...commonCellStyle }}>등록일자</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRows.map((row) => (
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
                                    }}
                                >
                                    <TableCell component="th" scope="row" sx={{ ...cellStyles.id, ...commonCellStyle }}>
                                        {row.id}
                                    </TableCell>
                                    <TableCell sx={{ ...cellStyles.image }}>
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
                                        />
                                    </TableCell>
                                    <TableCell sx={{ ...cellStyles.title, ...commonCellStyle }}>{row.title}</TableCell>
                                    <TableCell sx={{ ...cellStyles.content, ...commonCellStyle }}>
                                        {row.content}
                                    </TableCell>
                                    <TableCell sx={{ ...cellStyles.jellyCount, ...commonCellStyle }}>
                                        {row.jellyCount}
                                    </TableCell>
                                    <TableCell sx={{ ...cellStyles.views, ...commonCellStyle }}>{row.views}</TableCell>
                                    <TableCell sx={{ ...cellStyles.date, ...commonCellStyle }}>{row.date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                    <Button sx={{ mx: 1 }}>&lt;</Button>
                    <Button sx={{ mx: 1 }}>1</Button>
                    <Button sx={{ mx: 1 }}>2</Button>
                    <Button sx={{ mx: 1 }}>3</Button>
                    <Button sx={{ mx: 1 }}>&gt;</Button>
                </Box>
            </Box>
        </Layout>
    );
}

export default DashBoard;
