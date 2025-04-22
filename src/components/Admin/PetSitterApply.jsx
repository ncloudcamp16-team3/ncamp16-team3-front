import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // React Router 사용 가정
import { Box, Typography, Card, Button, Grid, CardContent } from "@mui/material";
import AdminHeader from "./AdminHeader.jsx";
import petSitterData from "../../mock/Admin/petsitterApply.json";

// 테이블 행 컴포넌트
const TableRow = ({ label, value }) => (
    <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
        <td style={{ padding: "16px 8px", fontWeight: "bold", width: "20%" }}>{label}</td>
        <td style={{ padding: "16px 8px" }}>{value}</td>
    </tr>
);

const PetSitterApply = () => {
    // 라우터에서 ID 파라미터 가져오기
    const { id } = useParams();
    const petSitterId = parseInt(id);

    // 상태 관리를 위한 useState 선언
    const [petSitter, setPetSitter] = useState(null);
    const [loading, setLoading] = useState(true);
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

    // 컴포넌트 마운트 시 데이터 가져오기
    useEffect(() => {
        // petSitterData가 배열인 경우
        if (Array.isArray(petSitterData)) {
            const selectedPetSitter = petSitterData.find((sitter) => sitter.id === petSitterId);
            setPetSitter(selectedPetSitter);
        } else {
            // petSitterData가 단일 객체인 경우
            if (petSitterData.id === petSitterId) {
                setPetSitter(petSitterData);
            } else {
                setPetSitter(null);
            }
        }
        setLoading(false);
    }, [petSitterId]);

    if (loading) {
        return <Typography>로딩 중...</Typography>;
    }

    if (!petSitter) {
        return <Typography>펫시터 정보를 찾을 수 없습니다.</Typography>;
    }

    return (
        <Box>
            <AdminHeader
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                selectedFilter={currentFilter}
                filters={["자유 게시판", "중고 장터", "정보 게시판"]}
            />
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
                                        backgroundColor: "#c97b7b",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <img
                                        src={petSitter.image}
                                        alt="프로필 이미지"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </Box>
                            </Grid>

                            {/* 오른쪽 - 펫시터 정보 영역 */}
                            <Grid
                                sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
                            >
                                <Box sx={{ height: "100%", width: "100%" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                        <tbody style={{ width: "100%" }}>
                                            <TableRow label="사용자 닉네임" value={petSitter.sitterId} />
                                            <TableRow label="연령대" value={petSitter.age} />
                                            <TableRow
                                                label="반려동물"
                                                value={`${petSitter.grown}(${petSitter.petCount})`}
                                            />
                                            <TableRow label="주거형태" value={petSitter.houseType} />
                                            <TableRow label="코멘트" value={petSitter.content} />
                                            <TableRow label="신청일자" value={petSitter.date} />
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
                        >
                            반려
                        </Button>
                    </Box>
                </Card>
            </Box>
        </Box>
    );
};

export default PetSitterApply;
