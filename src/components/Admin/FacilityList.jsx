import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Box,
    CircularProgress,
    Alert,
} from "@mui/material";
import AdminHeader from "./AdminHeader.jsx";
import { useAdmin } from "./AdminContext.jsx";
import { fetchFacility } from "./adminFacilityApi.js";

function FacilityList() {
    const adminContext = useAdmin();
    const { currentCategory, searchField, searchTerm, currentPage, setCurrentPage } = adminContext;
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState(rows);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPage, setTotalPage] = useState(0);

    // 각 열에 대한 스타일 객체를 미리 정의
    const cellStyles = {
        id: { width: 80, minWidth: 80, maxWidth: 80 },
        facilityType: { width: 100, minWidth: 100, maxWidth: 100 },
        starPoint: { width: 80, minWidth: 80, maxWidth: 80 },
        image: { width: 100, minWidth: 100, maxWidth: 100 },
        name: { width: 200, minWidth: 200, maxWidth: 200 },
        address: { width: 350, minWidth: 350, maxWidth: 350 },
        detailAddress: { width: 350, minWidth: 350, maxWidth: 350 },
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
        navigate(`/admin/facility/list/${id}`);
    };

    const facilityTypeMapping = {
        전체: null,
        호텔: 1,
        미용실: 2,
        카페: 3,
    };

    const loadFacilityData = async () => {
        try {
            setLoading(true);
            setError(null);

            const facilityTypeId = facilityTypeMapping[currentCategory];
            const apiPage = Math.max(0, currentPage - 1);
            const response = await fetchFacility(apiPage, 10, facilityTypeId, searchTerm, searchField);

            if (!response || !response.content) {
                console.warn("API 응답에 데이터가 없습니다: ", response);
                setRows([]);
                setFilteredRows([]);
                setTotalPage(0);
                return;
            }

            // API 응답 가공
            const transformedData = response.content.map((item) => ({
                id: item.id,
                image: item.imagePath,
                facilityType: item.facilityType,
                starPoint: item.starPoint,
                name: item.name,
                address: item.address,
                detailAddress: item.detailAddress,
                date: new Date(item.createdAt).toLocaleString(),
            }));

            setRows(transformedData);
            setFilteredRows(transformedData);
            setTotalPage(response.totalPages || 0);
        } catch (error) {
            console.log("시설 목록 불러오는 중 오류 발생: ", error);
            setError("시설 목록을 불러오는중 오류가 발생했습니다");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFacilityData();
    }, [currentPage, currentCategory, searchTerm, searchField]);

    // 검색 핸들러
    const handleSearch = (term, field) => {
        // 컨텍스트의 executeSearch
        // console.log(`'${field}'에서 '${term}' 검색 요청됨`);
    };

    // 필터 핸들러
    const handleFilterChange = (category) => {
        // 컨텍스트의 setCurrentCategory
        // console.log(`카테고리 필터 변경: ${category}`);
    };

    // 페이지 변경 핸들러
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

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
        <Layout>
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

            {/* 테이블 부분 */}
            <Box>
                {!loading && !error && (
                    <TableContainer>
                        <Table sx={{ minWidth: 700 }} aria-label="게시글 테이블">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ ...cellStyles.id, ...commonCellStyle }}>시설 번호</TableCell>
                                    <TableCell sx={{ ...cellStyles.facilityType, ...commonCellStyle }}>업종</TableCell>
                                    <TableCell sx={{ ...cellStyles.starPoint, ...commonCellStyle }}>별점</TableCell>
                                    <TableCell sx={{ ...cellStyles.image, ...commonCellStyle }}>사진</TableCell>
                                    <TableCell sx={{ ...cellStyles.name, ...commonCellStyle }}>이름</TableCell>
                                    <TableCell sx={{ ...cellStyles.address, ...commonCellStyle }}>주소</TableCell>
                                    <TableCell sx={{ ...cellStyles.detailAddress, ...commonCellStyle }}>
                                        상세주소
                                    </TableCell>
                                    <TableCell sx={{ ...cellStyles.date, ...commonCellStyle }}>등록일자</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRows.length > 0 ? (
                                    filteredRows.map((row) => (
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
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                sx={{ ...cellStyles.id, ...commonCellStyle }}
                                            >
                                                {row.id}
                                            </TableCell>
                                            <TableCell sx={{ ...cellStyles.facilityType, ...commonCellStyle }}>
                                                {getFacilityType(row.facilityType)}
                                            </TableCell>
                                            <TableCell sx={{ ...cellStyles.starPoint, ...commonCellStyle }}>
                                                {row.starPoint}
                                            </TableCell>
                                            <TableCell sx={{ ...cellStyles.image }}>
                                                {row.image ? (
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
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            height: 50,
                                                            width: 60,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            backgroundColor: "#f0f0f0",
                                                            borderRadius: "4px",
                                                            fontSize: "0.7rem",
                                                            color: "#999",
                                                        }}
                                                    >
                                                        No Image
                                                    </Box>
                                                )}
                                            </TableCell>
                                            <TableCell sx={{ ...cellStyles.name, ...commonCellStyle }}>
                                                {row.name}
                                            </TableCell>
                                            <TableCell sx={{ ...cellStyles.address, ...commonCellStyle }}>
                                                {row.address}
                                            </TableCell>
                                            <TableCell sx={{ ...cellStyles.detailAddress, ...commonCellStyle }}>
                                                {row.detailAddress}
                                            </TableCell>
                                            <TableCell sx={{ ...cellStyles.date, ...commonCellStyle }}>
                                                {row.date}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center">
                                            시설이 없습니다.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                {/* 페이지네이션 */}
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                    <Button
                        sx={{ mx: 1 }}
                        disabled={currentPage <= 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        &lt;
                    </Button>

                    {totalPage > 0 &&
                        [...Array(totalPage)].map((_, index) => (
                            <Button
                                key={index}
                                sx={{
                                    mx: 1,
                                    backgroundColor: currentPage === index + 1 ? "#E9A260" : "transparent",
                                    color: currentPage === index + 1 ? "white" : "inherit",
                                    "&:hover": {
                                        backgroundColor: currentPage === index + 1 ? "#E9A260" : "#f0f0f0",
                                    },
                                }}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </Button>
                        ))}

                    <Button
                        sx={{ mx: 1 }}
                        disabled={currentPage >= totalPage}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        &gt;
                    </Button>
                </Box>
            </Box>
        </Layout>
    );
}

export default FacilityList;
