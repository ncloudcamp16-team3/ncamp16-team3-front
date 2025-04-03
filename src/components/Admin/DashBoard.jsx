import React from "react";
import Layout from "./Layout";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    Box,
} from "@mui/material";

// 샘플 데이터
const rows = [
    {
        id: 1,
        title: "강아지 사료 뭐가 좋은가요..?",
        views: 876,
        date: "2025-03-21",
    },
    {
        id: 2,
        title: "고양이 사료 뭐 사세요..?",
        views: 1132,
        date: "2025-03-21",
    },
    {
        id: 3,
        title: "앵무새 어디로 데려가요..?",
        views: 450,
        date: "2025-03-21",
    },
    { id: 4, title: "강아지 사료", views: 372, date: "2025-03-21" },
];

function DashBoard() {
    return (
        <Layout>
            <Box
                sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="h4">게시글 관리</Typography>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#F0A355",
                        "&:hover": { backgroundColor: "#e08c3a" },
                        borderRadius: "20px",
                    }}
                >
                    검색 초기화
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="게시글 테이블">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>제목</TableCell>
                            <TableCell>사진</TableCell>
                            <TableCell>내용</TableCell>
                            <TableCell>조회수</TableCell>
                            <TableCell>등록일자</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.id}
                                </TableCell>
                                <TableCell>{row.title}</TableCell>
                                <TableCell>
                                    <Box
                                        component="img"
                                        sx={{
                                            height: 50,
                                            width: 60,
                                            objectFit: "cover",
                                            borderRadius: "4px",
                                        }}
                                        src="/api/placeholder/60/50"
                                        alt="썸네일"
                                    />
                                </TableCell>
                                <TableCell>...</TableCell>
                                <TableCell>{row.views}</TableCell>
                                <TableCell>{row.date}</TableCell>
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
        </Layout>
    );
}

export default DashBoard;
