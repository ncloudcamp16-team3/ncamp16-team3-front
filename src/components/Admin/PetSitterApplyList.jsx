import React, { useState } from "react";
import AdminHeader from "./AdminHeader.jsx";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Layout from "./Layout.jsx";
import rows from "../../mock/Admin/petsitter.json";
import { useNavigate } from "react-router-dom";

const PetSitterApplyList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentFilter, setCurrentFilter] = useState("자유 게시판");
    const [filteredRows, setFilteredRows] = useState(rows);

    // 각 열에 대한 스타일 객체를 미리 정의
    const cellStyles = {
        id: { width: 80, minWidth: 80, maxWidth: 80 },
        sitterExp: { width: 100, minWidth: 100, maxWidth: 100 },
        image: { width: 100, minWidth: 100, maxWidth: 100 },
        sitterId: { width: 150, minWidth: 150, maxWidth: 150 },
        age: { width: 100, minWidth: 100, maxWidth: 100 },
        grown: { width: 150, minWidth: 150, maxWidth: 150 },
        houseType: { width: 100, minWidth: 100, maxWidth: 100 },
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
        navigate(`/admin/petsitter/apply/${id}`);
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
                filters={["자유 게시판", "중고 장터", "정보 게시판"]}
            />

            {/* 테이블 부분 */}
            <Box>
                <TableContainer>
                    <Table sx={{ minWidth: 700 }} aria-label="펫시터 리스트">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ ...cellStyles.id, ...commonCellStyle }}>ID</TableCell>
                                <TableCell sx={{ ...cellStyles.sitterExp, ...commonCellStyle }}>펫시터 경험</TableCell>
                                <TableCell sx={{ ...cellStyles.image, ...commonCellStyle }}>사진</TableCell>
                                <TableCell sx={{ ...cellStyles.sitterId, ...commonCellStyle }}>사용자 아이디</TableCell>
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
                                    <TableCell sx={{ ...cellStyles.sitterExp, ...commonCellStyle }}>
                                        {row.sitterExp}
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
                                    <TableCell sx={{ ...cellStyles.sitterId, ...commonCellStyle }}>
                                        {row.sitterId}
                                    </TableCell>
                                    <TableCell sx={{ ...cellStyles.age, ...commonCellStyle }}>{row.age}</TableCell>
                                    <TableCell sx={{ ...cellStyles.grown, ...commonCellStyle }}>
                                        {typeof row.grown === "boolean" ? (row.grown ? "예" : "아니오") : row.grown} (
                                        {row.petCount || "없음"})
                                    </TableCell>
                                    <TableCell sx={{ ...cellStyles.houseType, ...commonCellStyle }}>
                                        {row.houseType}
                                    </TableCell>
                                    <TableCell sx={{ ...cellStyles.content, ...commonCellStyle }}>
                                        {row.content}
                                    </TableCell>
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
};

export default PetSitterApplyList;
