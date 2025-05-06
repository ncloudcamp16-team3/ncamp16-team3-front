// src/pages/ReservationListPage.jsx
import React, { useEffect, useState } from "react";
import reserveList from "../../mock/Reserve/reserveList.json";
import {
    Container,
    List,
    ListItem,
    ListItemText,
    Divider,
    Paper,
    CardMedia,
    Card,
    Typography,
    CircularProgress,
    Alert,
} from "@mui/material";
import TitleBar from "../../components/Global/TitleBar.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ReservationListPage = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false); // 로딩 상태 추가
    const [error, setError] = useState(null); // 에러 상태 추가
    const navigate = useNavigate();

    // 예약 목록 가져오기
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/api/reserve/facility/lists");
                setReservations(response.data.data || []);
                setError(null);
            } catch (err) {
                console.error("예약 목록을 불러오는데 실패했습니다:", err);
                setError("예약 목록을 불러오는데 실패했습니다.");
                // 백업으로 목업 데이터 사용
                setReservations(reserveList || []);
            } finally {
                setLoading(false);
            }
        };
        fetchReservations();
    }, []);

    // 시설 상세 정보 가져오기 및 페이지 이동
    const handleFacilityClick = async (facilityId) => {
        try {
            setLoading(true);
            // 시설 상세 정보 API 호출
            await axios.get(`/api/facility/${facilityId}/detail`);
            // API 호출이 성공하면 페이지 이동
            navigate(`/reserve/detail/${facilityId}`);
        } catch (err) {
            console.error("시설 정보를 불러오는데 실패했습니다:", err);
            setError("시설 정보를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="sm">
                <TitleBar name="예약 목록" />
                <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm">
            <TitleBar name="예약 목록" />

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper elevation={3} sx={{ mt: 2 }}>
                <List>
                    {reservations.length === 0 ? (
                        <ListItem>
                            <ListItemText primary="예약 내역이 없습니다." />
                        </ListItem>
                    ) : (
                        reservations.map((r) => (
                            <React.Fragment key={r.id}>
                                <ListItem
                                    button
                                    alignItems="flex-start"
                                    onClick={() => handleFacilityClick(r.id)}
                                    sx={{ display: "flex", gap: 2 }}
                                >
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {r.name}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="body2" color="text.secondary">
                                                    업종: {r.type || r.facilityType}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    주소: {r.address}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {r.entry_time?.end || r.exitTime ? "체크인: " : "예약시간: "}
                                                    {r.entry_time?.start || r.entryTime}
                                                </Typography>
                                                {(r.entry_time?.end || r.exitTime) && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        체크아웃: {r.entry_time?.end || r.exitTime}
                                                    </Typography>
                                                )}
                                                <Typography variant="body2" color="primary">
                                                    예약금액: {(r.amount || r.price || 0).toLocaleString()}원
                                                </Typography>
                                            </>
                                        }
                                    />

                                    <Card sx={{ width: 100, height: 100, flexShrink: 0 }}>
                                        <CardMedia
                                            component="img"
                                            height="100"
                                            image={r.image || r.imagePath || "https://via.placeholder.com/100"}
                                            alt="시설 이미지"
                                            sx={{ objectFit: "cover" }}
                                        />
                                    </Card>
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))
                    )}
                </List>
            </Paper>
        </Container>
    );
};

// 날짜/시간 포맷 (ex. 2025-05-06T10:00:00 → "2025.05.06 (화) 10:00")
const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default ReservationListPage;
