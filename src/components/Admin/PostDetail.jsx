import React, { useState, useEffect } from "react";
import { Box, Typography, Card, Button, CardMedia, Paper, Stack, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import AdminHeader from "./AdminHeader.jsx";
import post from "../../mock/Admin/post.json";

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
    const [currentFilter, setCurrentFilter] = useState("자유 게시판");
    const [filteredRows, setFilteredRows] = useState([]);
    const [rows, setRows] = useState([]);

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

    // 컴포넌트 마운트 시 데이터 불러오기 (실제는 API 호출)
    useEffect(() => {
        // API 호출 코드가 들어갈 자리
        // 예: fetchPostDetails(postId)
    }, []);

    // 게시글 삭제 핸들러
    const handleDelete = () => {
        if (window.confirm("이 게시글을 삭제하시겠습니까?")) {
            // 삭제 API 호출 코드가 들어갈 자리
            console.log("게시글 삭제됨");
        }
    };

    return (
        <Box>
            <AdminHeader
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                selectedFilter={currentFilter}
                filters={["자유 게시판", "질문 게시판", "정보 게시판", "중고장터"]}
            />

            <Box sx={{ p: 3, maxWidth: "90%", mx: "auto", ml: 50, mr: 5 }}>
                <Card sx={{ borderRadius: 2, border: "1px solid #cccccc", boxShadow: 0, mt: 5 }}>
                    {/* 게시글 제목 & 조회정보 */}
                    <PostHeader>
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Typography variant="h6" component="div">
                                    제목 : {post.title}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" color="text.secondary">
                                    등록일자 : {post.createdAt} 조회수 : {post.views}
                                </Typography>
                            </Grid>
                        </Grid>
                    </PostHeader>

                    {/* 작성자 & 댓글 수 정보 */}
                    <PostInfo>
                        <Typography variant="body2">작성자 : {post.author}</Typography>
                        <Typography variant="body2">댓글 갯수 : {post.commentCount}개</Typography>
                    </PostInfo>

                    {/* 게시글 내용 */}
                    <PostContent>
                        {/* 게시글 이미지 */}
                        <CardMedia
                            component="img"
                            sx={{ width: 300, height: 200, mb: 2, objectFit: "cover" }}
                            image={post.imagePath}
                            alt="게시글 이미지"
                        />

                        <Typography variant="body1" color="text.primary" paragraph>
                            {post.content}
                        </Typography>
                    </PostContent>

                    {/* 댓글 섹션 */}
                    <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                        {post.comments.map((comment) => (
                            <CommentItem key={comment.id} elevation={0}>
                                <Stack direction="row" justifyContent="space-between" width="100%">
                                    <Box>
                                        <Typography variant="body2" fontWeight="bold">
                                            댓글 작성자 : {comment.author}
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
                                    <DeleteButton size="small">삭제</DeleteButton>
                                </Stack>
                            </CommentItem>
                        ))}
                    </Box>

                    {/* 작업 버튼 영역 */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
                        <Button variant="outlined" color="inherit" size="medium" onClick={handleDelete}>
                            삭제
                        </Button>
                    </Box>
                </Card>
            </Box>
        </Box>
    );
};

export default PostDetail;
