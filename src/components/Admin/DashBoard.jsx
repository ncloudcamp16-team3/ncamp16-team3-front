import React from "react";
import Layout from "./Layout";
import rows from "../../mock/Admin/board.json";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button, Box } from "@mui/material";
function DashBoard() {
    // 각 열에 대한 스타일 객체를 미리 정의
    const cellStyles = {
        id: { width: 50, minWidth: 50, maxWidth: 50 },
        title: { width: 200, minWidth: 200, maxWidth: 200 },
        image: { width: 100, minWidth: 100, maxWidth: 100 },
        content: { width: 350, minWidth: 350, maxWidth: 350 },
        views: { width: 100, minWidth: 100, maxWidth: 100 },
        date: { width: 200, minWidth: 200, maxWidth: 200 },
    };

    // 공통 스타일 (텍스트 오버플로우 처리)
    const commonCellStyle = {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    };

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
                            <TableCell sx={{ ...cellStyles.id, ...commonCellStyle }}>ID</TableCell>
                            <TableCell sx={{ ...cellStyles.title, ...commonCellStyle }}>제목</TableCell>
                            <TableCell sx={{ ...cellStyles.image, ...commonCellStyle }}>사진</TableCell>
                            <TableCell sx={{ ...cellStyles.content, ...commonCellStyle }}>내용</TableCell>
                            <TableCell sx={{ ...cellStyles.views, ...commonCellStyle }}>조회수</TableCell>
                            <TableCell sx={{ ...cellStyles.date, ...commonCellStyle }}>등록일자</TableCell>
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
                                <TableCell component="th" scope="row" sx={{ ...cellStyles.id, ...commonCellStyle }}>
                                    {row.id}
                                </TableCell>
                                <TableCell sx={{ ...cellStyles.title, ...commonCellStyle }}>{row.title}</TableCell>
                                <TableCell sx={{ ...cellStyles.image }}>
                                    <Box
                                        component="img"
                                        sx={{
                                            height: 50,
                                            width: 60,
                                            objectFit: "cover",
                                            borderRadius: "4px",
                                        }}
                                        src="../../public/mock/Admin/images/cat.png"
                                        alt="썸네일"
                                    />
                                </TableCell>
                                <TableCell sx={{ ...cellStyles.content, ...commonCellStyle }}>{row.content}</TableCell>
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
        </Layout>
    );
}

export default DashBoard;
