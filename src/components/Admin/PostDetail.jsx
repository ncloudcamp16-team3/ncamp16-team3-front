import React from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import rows from "../../mock/Admin/board.json";

const PostDetail = () => {
    const cellStyles = {
        id: { width: 60, minWidth: 60, maxWidth: 60 },
        title: { width: 200, minWidth: 200, maxWidth: 200 },
        image: { width: 100, minWidth: 100, maxWidth: 100 },
        content: { width: 350, minWidth: 350, maxWidth: 350 },
        views: { width: 100, minWidth: 100, maxWidth: 100 },
        date: { width: 200, minWidth: 200, maxWidth: 200 },
    };

    const commonCellStyle = {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    };

    return (
        <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="게시글 테이블">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ ...cellStyles.id, ...commonCellStyle }}>글 번호</TableCell>
                        <TableCell sx={{ ...cellStyles.image, ...commonCellStyle }}>사진</TableCell>
                        <TableCell sx={{ ...cellStyles.title, ...commonCellStyle }}>제목</TableCell>
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
                            <TableCell sx={{ ...cellStyles.content, ...commonCellStyle }}>{row.content}</TableCell>
                            <TableCell sx={{ ...cellStyles.views, ...commonCellStyle }}>{row.views}</TableCell>
                            <TableCell sx={{ ...cellStyles.date, ...commonCellStyle }}>{row.date}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PostDetail;
