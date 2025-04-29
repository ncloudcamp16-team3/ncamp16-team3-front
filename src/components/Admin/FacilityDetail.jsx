import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // React Router 사용 가정
import { Box, Typography, Card, Button, CardContent, Rating, CircularProgress } from "@mui/material";
import AdminHeader from "./AdminHeader.jsx";
import { useAdmin } from "./AdminContext.jsx";
import { fetchFacilityDetail } from "./adminFacilityApi.js";
import ImageSlider from "./ImageSlider.jsx";
import adminAxios from "./adminAxios.js";

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
    const navigate = useNavigate();
    const adminContext = useAdmin();
    const { setSearchField, executeSearch, setCurrentCategory } = adminContext;

    // 상태 관리를 위한 useState 선언
    const [facility, setFacility] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 검색 핸들러
    const handleSearch = (term, field) => {
        if (field) setSearchField(field);
        setSearchField(term);

        executeSearch(term, field);

        navigate("/admin/facility/list");
    };

    // 필터 핸들러
    const handleFilterChange = (filter) => {
        setCurrentCategory(filter);
    };

    // 컴포넌트 마운트 시 데이터 가져오기
    useEffect(() => {
        const loadFacilityDetail = async () => {
            try {
                setLoading(true);
                const data = await fetchFacilityDetail(id);
                setFacility(data);
            } catch (error) {
                console.log("업체 로딩 중 오류: ", error);
                setError("업체 불러오기 오류");
            } finally {
                setLoading(false);
            }
        };
        loadFacilityDetail();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("이 업체를 삭제하시겠습니까?")) {
            try {
                const response = await adminAxios.delete(`/api/admin/facility/${id}/delete`);

                if (response.status != 200) {
                    throw new Error(response.data.message || "업체 삭제에 실패했습니다");
                }

                alert("업체가 삭제되었습니다");
                navigate("/admin/facility/list");
            } catch (error) {
                console.error("업체 삭제 중 오류 발생", error);
                alert(`업체 삭제 실패: ${error.message}`);
            }
        }
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
        <Box>
            <AdminHeader onSearch={handleSearch} onFilterChange={handleFilterChange} />

            {/* 로딩 상태 표시 */}
            {loading && (
                <Box sx={{ display: "flex", alignItems: "center", my: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {!loading && !error && facility && (
                <Box sx={{ p: 3, maxWidth: "90%", mx: "auto", ml: 50, mr: 5 }}>
                    <Card sx={{ borderRadius: 2, border: "1px solid #cccccc", boxShadow: 0, mt: 5 }}>
                        <CardContent>
                            {/* 왼쪽 - 이미지 슬라이더 영역 */}
                            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                                <ImageSlider images={facility.imagePaths || []} />
                            </Box>

                            <Box sx={{ height: "100%", width: "100%" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <tbody style={{ width: "100%" }}>
                                        <TableRow label="별점" value={facility.starPoint} isRating={true} />
                                        <TableRow label="업종" value={getFacilityType(facility.facilityType)} />
                                        <TableRow label="시설이름" value={facility.name} />
                                        <TableRow label="주소" value={facility.address} />
                                        <TableRow label="상세주소" value={facility.detailAddress} />
                                        <TableRow label="설명" value={facility.comment} />
                                        <TableRow label="등록일자" value={facility.createdAt} />
                                    </tbody>
                                </table>
                            </Box>
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

export default FacilityDetail;
