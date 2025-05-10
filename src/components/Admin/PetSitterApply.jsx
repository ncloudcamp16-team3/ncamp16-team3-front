import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // React Router 사용 가정
import {
    Box,
    Card,
    Button,
    Grid,
    CardContent,
    CircularProgress,
    Alert,
    Typography,
    DialogContent,
    DialogContentText,
    Modal,
    DialogActions,
} from "@mui/material";
import AdminHeader from "./AdminHeader.jsx";
import { useAdmin } from "./AdminContext.jsx";
import { fetchPendingPetSitterDetail } from "./adminPetSitterApi.js";
import Dog from "../../../src/assets/images/Admin/dog.svg";

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
    const navigate = useNavigate();
    const adminContext = useAdmin();
    const { setSearchField, executeSearch, setCurrentCategory } = adminContext;
    const [petSitter, setPetSitter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [approveLoading, setApproveLoading] = useState(false);

    // 모달 상태
    const [openApproveDialog, setOpenApproveDialog] = useState(false);
    const [openRejectDialog, setOpenRejectDialog] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    // 검색 핸들러
    const handleSearch = (term, field) => {
        if (field) setSearchField(field);
        setSearchField(term);

        executeSearch(term, field);

        navigate("/admin/petsitter/pending");
    };

    // 필터 핸들러
    const handleFilterChange = (filter) => {
        setCurrentCategory(filter);
    };

    // 컴포넌트 마운트 시 데이터 가져오기
    useEffect(() => {
        const loadPendingPetSitterDetail = async () => {
            try {
                setLoading(true);
                const data = await fetchPendingPetSitterDetail(id);
                setPetSitter(data);
            } catch (error) {
                setError("펫시터 풀러오기 오류");
            } finally {
                setLoading(false);
            }
        };
        loadPendingPetSitterDetail();
    }, [id]);

    // 승인 모달 열기
    const handleOpenApproveDialog = () => {
        setModalMessage("이 펫시터를 승인하시겠습니까?");
        setOpenApproveDialog(true);
    };

    // 반려 모달 열기
    const handleOpenRejectDialog = () => {
        setModalMessage("이 펫시터를 반려하시겠습니까?");
        setOpenRejectDialog(true);
    };

    // 모달 닫기
    const handleCloseDialog = () => {
        setOpenApproveDialog(false);
        setOpenRejectDialog(false);

        // 성공 후 모달을 닫을 때 리스트 페이지로 이동
        if (isSuccess) {
            navigate("/admin/petsitter/pending");
        }
    };

    const handlePending = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("adminToken");
            const response = await fetch(`/api/admin/petsitter/pending/${id}/pending`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "펫시터 반려에 실패했습니다");
            }

            setModalMessage("펫시터가 성공적으로 반려되었습니다");
            setIsSuccess(true);
        } catch (error) {
            console.error("펫시터 반려 API 호출 중 오류 발생: ", error);
            setModalMessage(`펫시터 반려 실패: ${error.message}`);
            setIsSuccess(false);
        }
    };

    const handleApprove = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("adminToken");
            const response = await fetch(`/api/admin/petsitter/pending/${id}/approve`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "펫시터 승인에 실패했습니다");
            }

            setModalMessage("펫시터가 성공적으로 승인되었습니다");
            setIsSuccess(true);
        } catch (error) {
            console.error("펫시터 승인 API 호출 중 오류 발생: ", error);
            setModalMessage(`펫시터 승인 실패: ${error.message}`);
            setIsSuccess(false);
        }
    };

    // 확인 버튼 클릭 시 승인 처리
    const clickApprove = async () => {
        try {
            setApproveLoading(true);
            await handleApprove();
        } finally {
            setApproveLoading(false);
        }
    };

    const clickPending = async () => {
        try {
            setApproveLoading(true);
            await handlePending();
        } finally {
            setApproveLoading(false);
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
                                    backgroundColor: "#ff9393",
                                    "&:hover": { backgroundColor: "#ff8686" },
                                    color: "#000",
                                    borderRadius: 2,
                                    px: 4,
                                }}
                                onClick={handleOpenRejectDialog}
                            >
                                반려
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
                                onClick={handleOpenApproveDialog}
                            >
                                승인
                            </Button>
                        </Box>
                    </Card>
                </Box>
            )}
            {/* 승인 확인 모달 */}
            <Modal
                open={openApproveDialog}
                onClose={handleCloseDialog}
                aria-labelledby="approve-dialog-title"
                aria-describedby="approve-dialog-description"
            >
                <Box
                    sx={{
                        backgroundColor: "#F2DFCE",
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        borderRadius: "30px",
                        padding: "10px",
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <img
                            src={Dog}
                            alt="Dog"
                            style={{
                                width: "100px",
                                height: "auto",
                            }}
                        />
                    </Box>
                    <DialogContent>
                        <DialogContentText
                            id="approve-dialog-description"
                            sx={{ fontSize: "1.5em", textAlign: "center" }}
                        >
                            {modalMessage.split("\n").map((line, index) => (
                                <span key={index}>
                                    {line}
                                    <br />
                                </span>
                            ))}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: "center" }}>
                        {!isSuccess ? (
                            <>
                                <Button
                                    onClick={handleCloseDialog}
                                    disabled={approveLoading}
                                    sx={{
                                        width: "7em",
                                        backgroundColor: "#cccccc",
                                        color: "black",
                                        borderRadius: "30px",
                                        "&:hover": { backgroundColor: "#bbbbbb" },
                                    }}
                                >
                                    취소
                                </Button>
                                <Button
                                    onClick={clickApprove}
                                    disabled={approveLoading}
                                    autoFocus
                                    sx={{
                                        width: "7em",
                                        backgroundColor: "#E9A260",
                                        color: "black",
                                        borderRadius: "30px",
                                        "&:hover": { backgroundColor: "#d9a064" },
                                    }}
                                >
                                    {approveLoading ? (
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                            처리 중...
                                        </Box>
                                    ) : (
                                        "확인"
                                    )}
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={handleCloseDialog}
                                autoFocus
                                sx={{
                                    width: "7em",
                                    backgroundColor: "#E9A260",
                                    color: "black",
                                    borderRadius: "30px",
                                    "&:hover": { backgroundColor: "#d9a064" },
                                }}
                            >
                                확인
                            </Button>
                        )}
                    </DialogActions>
                </Box>
            </Modal>

            {/* 반려 확인 모달 */}
            <Modal
                open={openRejectDialog}
                onClose={handleCloseDialog}
                aria-labelledby="reject-dialog-title"
                aria-describedby="reject-dialog-description"
            >
                <Box
                    sx={{
                        backgroundColor: "#F2DFCE",
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        borderRadius: "30px",
                        padding: "10px",
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <img
                            src={Dog}
                            alt="Dog"
                            style={{
                                width: "100px",
                                height: "auto",
                            }}
                        />
                    </Box>
                    <DialogContent>
                        <DialogContentText
                            id="reject-dialog-description"
                            sx={{ fontSize: "1.5em", textAlign: "center" }}
                        >
                            {modalMessage.split("\n").map((line, index) => (
                                <span key={index}>
                                    {line}
                                    <br />
                                </span>
                            ))}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: "center" }}>
                        {!isSuccess ? (
                            <>
                                <Button
                                    onClick={handleCloseDialog}
                                    disabled={approveLoading}
                                    sx={{
                                        width: "7em",
                                        backgroundColor: "#cccccc",
                                        color: "black",
                                        borderRadius: "30px",
                                        "&:hover": { backgroundColor: "#bbbbbb" },
                                    }}
                                >
                                    취소
                                </Button>
                                <Button
                                    onClick={clickPending}
                                    disabled={approveLoading}
                                    autoFocus
                                    sx={{
                                        width: "7em",
                                        backgroundColor: "#E9A260",
                                        color: "black",
                                        borderRadius: "30px",
                                        "&:hover": { backgroundColor: "#d9a064" },
                                    }}
                                >
                                    {approveLoading ? (
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                            처리 중...
                                        </Box>
                                    ) : (
                                        "확인"
                                    )}
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={handleCloseDialog}
                                autoFocus
                                sx={{
                                    width: "7em",
                                    backgroundColor: "#E9A260",
                                    color: "black",
                                    borderRadius: "30px",
                                    "&:hover": { backgroundColor: "#d9a064" },
                                }}
                            >
                                확인
                            </Button>
                        )}
                    </DialogActions>
                </Box>
            </Modal>
        </Box>
    );
};

export default PetSitterApply;
