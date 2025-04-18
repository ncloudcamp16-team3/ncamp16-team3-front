import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // React Router 사용 가정
import { Box, Typography, Card, Button, Grid, CardContent, Rating } from "@mui/material";
import AdminHeader from "./AdminHeader.jsx";
import facilityData from "../../mock/Admin/facility.json";
import { useAdmin } from "./AdminContext.jsx";

// 테이블 행 컴포넌트
const TableRow = ({ label, value, isRating = false }) => (
    <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
        <td style={{ padding: "16px 8px", fontWeight: "bold", width: "20%" }}>{label}</td>
        <td style={{ padding: "16px 8px" }}>
            {isRating ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Rating value={parseFloat(value) || 0} precision={0.1} readOnly />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                        ({parseFloat(value).toFixed(1)})
                    </Typography>
                </Box>
            ) : (
                value
            )}
        </td>
    </tr>
);

const FacilityDetail = () => {
    // 라우터에서 ID 파라미터 가져오기
    const { id } = useParams();
    const facilityId = parseInt(id);

    // 상태 관리를 위한 useState 선언
    const [facility, setFacility] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentFilter, setCurrentFilter] = useAdmin();
    const [filteredRows, setFilteredRows] = useState([]);
    const [rows, setRows] = useState([]);

    // 편의시설 타입 매핑
    const facilityTypeMapping = {
        호텔: "HOTEL",
        미용실: "BEAUTY",
        카페: "CAFE",
    };

    useEffect(() => {
        if (currentFilter && currentFilter != "전체") {
            const filtered = rows.filter((row) => row.facilityType === facilityTypeMapping[currentFilter]);
            setFilteredRows(filtered);
        } else {
            setFilteredRows(rows);
        }
    }, [currentFilter]);

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
        // facilityData가 배열인 경우
        if (Array.isArray(facilityData)) {
            const selectedFacility = facilityData.find((facility) => facility.id === facilityId);
            setFacility(selectedFacility);
        } else {
            // facilityData가 단일 객체인 경우
            if (facilityData.id === facilityId) {
                setFacility(facilityData);
            } else {
                setFacility(null);
            }
        }
        setLoading(false);
    }, [facilityId]);

    if (loading) {
        return <Typography>로딩 중...</Typography>;
    }

    if (!facility) {
        return <Typography>시설 정보를 찾을 수 없습니다.</Typography>;
    }

    // 편의시설 타입 매핑
    const getFacilityType = (type) => {
        const typeMap = {
            BEAUTY: "미용실",
            HOTEL: "호텔",
            CAFE: "카페",
        };
        return typeMap[type];
    };

    return (
        <Box>
            <AdminHeader onSearch={handleSearch} onFilterChange={handleFilterChange} />
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
                                        src={facility.image}
                                        alt="시설 이미지"
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
                                            <TableRow label="별점" value={facility.starPoint} isRating={true} />
                                            <TableRow label="업종" value={getFacilityType(facility.facilityType)} />
                                            <TableRow label="시설이름" value={facility.name} />
                                            <TableRow label="주소" value={facility.address} />
                                            <TableRow label="상세주소" value={facility.detailAddress} />
                                            <TableRow label="등록일자" value={facility.createdAt} />
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
                            삭제
                        </Button>
                    </Box>
                </Card>
            </Box>
        </Box>
    );
};

export default FacilityDetail;
