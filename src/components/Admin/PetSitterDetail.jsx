import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // React Router 사용 가정
import { Box, Card, Button, Grid, CardContent, CircularProgress, Alert, Typography } from "@mui/material";
import AdminHeader from "./AdminHeader.jsx";
import { useAdmin } from "./AdminContext.jsx";
import { fetchPetSitterDetail } from "./AdminPetSitterApi.js";

// 테이블 행 컴포넌트
const TableRow = ({ label, value }) => (
    <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
        <td style={{ padding: "16px 8px", fontWeight: "bold", width: "20%" }}>{label}</td>
        <td style={{ padding: "16px 8px" }}>{value}</td>
    </tr>
);

const PetSitterDetail = () => {
    // 라우터에서 ID 파라미터 가져오기
    const { id } = useParams();
    const adminContext = useAdmin();
    const currentFilter = adminContext.currentFilter;
    const setCurrentFilter = adminContext.setCurrentFilter;
    const [petSitter, setPetSitter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredRows, setFilteredRows] = useState([]);
    const [rows, setRows] = useState([]);
    const [error, setError] = useState(null);

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

    // 컴포넌트 마운트 시 데이터 가져오기
    useEffect(() => {
        const loadPetSitterDetail = async () => {
            try {
                setLoading(true);
                const data = await fetchPetSitterDetail(id);
                setPetSitter(data);
            } catch (error) {
                console.log("펫시터 로딩 중 오류: " + error);
                setError("펫시터 불러오기 오류");
            } finally {
                setLoading(false);
            }
        };
        loadPetSitterDetail();
    }, [id]);

    const handleDelete = () => {
        if (window.confirm("이 펫시터를 삭제하시겠습니까?")) {
            console.log("펫시터 삭제");
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

            {!loading && !error && petSitter && (
                <Box sx={{ p: 3, maxWidth: "90%", mx: "auto", ml: 50, mr: 5 }}>
                    <Card sx={{ borderRadius: 2, border: "1px solid #cccccc", boxShadow: 0, mt: 5 }}>
                        <CardContent>
                            <Grid container spacing={2}>
                                {/* 왼쪽 - 프로필 이미지 영역 */}
                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                    sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                                >
                                    <Box
                                        sx={{
                                            width: 200,
                                            height: 200,
                                            borderRadius: "20px",
                                            overflow: "hidden",
                                            backgroundColor: "#f0f0f0",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        {petSitter.imagePath ? (
                                            <img
                                                src={petSitter.imagePath}
                                                alt="프로필 이미지"
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        ) : (
                                            <Typography>이미지 없음</Typography>
                                        )}
                                    </Box>
                                </Grid>
                                {/* 오른쪽 - 펫시터 정보 영역 */}
                                <Grid
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        width: "100%",
                                    }}
                                >
                                    <Box sx={{ height: "100%", width: "100%" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                            <tbody style={{ width: "100%" }}>
                                                <TableRow label="사용자 닉네임" value={petSitter.nickname} />
                                                <TableRow
                                                    label="펫시터 경험"
                                                    value={petSitter.sitterExp ? "있음" : "없음"}
                                                />
                                                <TableRow label="연령대" value={petSitter.age} />
                                                <TableRow
                                                    label="반려동물"
                                                    value={
                                                        petSitter.grown
                                                            ? `있음 (${petSitter.petCount || "0"}마리)`
                                                            : "없음"
                                                    }
                                                />
                                                <TableRow label="주거형태" value={petSitter.houseType} />
                                                <TableRow label="코멘트" value={petSitter.comment || "코멘트 없음"} />
                                                <TableRow
                                                    label="등록일자"
                                                    value={new Date(petSitter.createdAt).toLocaleString()}
                                                />
                                                <TableRow
                                                    label="승인일자"
                                                    value={new Date(petSitter.applyAt).toLocaleString()}
                                                />
                                            </tbody>
                                        </table>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                        {/* 버튼 영역 */}
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
                    </Card>
                </Box>
            )}
        </Box>
    );
};

export default PetSitterDetail;
