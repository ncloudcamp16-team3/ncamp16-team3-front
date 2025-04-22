import React, { useState, useEffect } from "react";
import { Box, Typography, Card, Button, CardMedia, Paper, Stack, Grid, CircularProgress, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";
import AdminHeader from "./AdminHeader.jsx";
import { fetchBoardDetail } from "./AdminBoardApi.js";
import { useParams } from "react-router-dom";
import { useAdmin } from "./AdminContext.jsx";

// 커스텀 스타일 컴포넌트 생성
const PostHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

const PostInfo = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

const PostContent = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
}));

const CommentItem = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: theme.palette.grey[50],
}));

const DeleteButton = styled(Button)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.75rem",
}));

const PostDetail = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const adminContext = useAdmin();
    const currentFilter = adminContext.currentFilter;
    const setCurrentFilter = adminContext.setCurrentFilter;
    const [filteredRows, setFilteredRows] = useState([]);
    const [rows, setRows] = useState([]);
    const [board, setBoard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

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

    // 컴포넌트 마운트 시 데이터 불러오기
    useEffect(() => {
        const loadBoardDetail = async () => {
            try {
                setLoading(true);
                const data = await fetchBoardDetail(id);
                setBoard(data);
            } catch (error) {
                console.log("게시글 로딩 중 오류: " + error);
                setError("게시글 불러오기 실패");
            } finally {
                setLoading(false);
            }
        };
        loadBoardDetail();
    }, [id]);

    // 게시글 삭제 핸들러
    const handleDelete = () => {
        if (window.confirm("이 게시글을 삭제하시겠습니까?")) {
            // 삭제 API 호출 코드가 들어갈 자리
            console.log("게시글 삭제됨");
        }
    };

    return (
        <Box>
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

            {/* board가 있을 때만 내용을 렌더링 */}
            {!loading && !error && board && (
                <Box sx={{ p: 3, maxWidth: "90%", mx: "auto", ml: 50, mr: 5 }}>
                    <Card sx={{ borderRadius: 2, border: "1px solid #cccccc", boxShadow: 0, mt: 5 }}>
                        {/* 게시글 제목 & 조회정보 */}
                        <PostHeader>
                            <Grid container justifyContent="space-between" alignItems="center">
                                <Grid item>
                                    <Typography variant="h6" component="div">
                                        제목 : {board.title}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2" color="text.secondary">
                                        등록일자 : {new Date(board.createdAt).toLocaleString()}
                                        {board.views && ` 조회수 : ${board.views}`}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </PostHeader>

                        {/* 작성자 & 댓글 수 정보 */}
                        <PostInfo>
                            <Typography variant="body2">작성자 : {board.authorNickname || board.author}</Typography>
                            <Typography variant="body2">댓글 갯수 : {board.commentCount || 0}개</Typography>
                        </PostInfo>

                        {/* 게시글 내용 */}
                        <PostContent>
                            {/* 게시글 이미지 - 이미지가 있는 경우에만 표시 */}
                            {board.imageUrls && board.imageUrls.length > 0 && (
                                <CardMedia
                                    component="img"
                                    sx={{ width: 300, height: 200, mb: 2, objectFit: "cover" }}
                                    image={board.imageUrls[0].url}
                                    alt="게시글 이미지"
                                />
                            )}

                            <Typography variant="body1" color="text.primary" paragraph>
                                {board.content}
                            </Typography>
                        </PostContent>

                        {/* 작업 버튼 영역 */}
                        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2, gap: 2 }}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#e6b17e",
                                    "&:hover": { backgroundColor: "#d9a064" },
                                    borderRadius: 2,
                                    px: 4,
                                }}
                                onClick={() => window.history.back()}
                            >
                                뒤로
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#e2ccb5",
                                    "&:hover": { backgroundColor: "#d4bea7" },
                                    color: "#000",
                                    borderRadius: 2,
                                    px: 4,
                                }}
                                onClick={handleDelete}
                            >
                                삭제
                            </Button>
                        </Box>

                        {/* 댓글 섹션 - 댓글이 있는 경우에만 표시 */}
                        {board.comments && board.comments.length > 0 && (
                            <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                                {board.comments.map((comment) => (
                                    <CommentItem key={comment.id} elevation={0}>
                                        <Stack direction="row" justifyContent="space-between" width="100%">
                                            <Box>
                                                <Typography variant="body2" fontWeight="bold">
                                                    댓글 작성자 : {comment.author || comment.authorNickname}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        whiteSpace: "pre-wrap",
                                                        wordBreak: "break-word",
                                                        maxWidth: "100%",
                                                    }}
                                                >
                                                    내용 : {comment.content}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CommentItem>
                                ))}
                            </Box>
                        )}
                    </Card>
                </Box>
            )}
        </Box>
    );
};

export default PostDetail;
