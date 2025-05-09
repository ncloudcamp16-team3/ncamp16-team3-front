// src/pages/ReservationListPage.jsx
import React, { useEffect, useState } from "react";
import { Container, ListItemText, Divider, CardMedia, Card, Typography, Button, Box } from "@mui/material";
import TitleBar from "../../components/Global/TitleBar.jsx";
import { useNavigate } from "react-router-dom";
import { fetchMyReserveList } from "../../services/reserveService.js";
import CenteredContainer from "../../components/Reserve/utils/CenteredContainer.jsx";

const ReservationListPage = () => {
    const [reservations, setReservations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyReserveList()
            .then((res) => {
                setReservations(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.error("예약 목록 조회 실패:", err);
                setReservations([]);
            });
    }, []);

    if (reservations.length === 0)
        return (
            <CenteredContainer>
                <ListItemText primary="예약 내역이 없습니다." />
                <Divider />
                <Button onClick={() => navigate(-1)}>이전 화면으로 돌아가기</Button>
            </CenteredContainer>
        );

    return (
        <Container maxWidth="sm">
            <TitleBar name="예약 목록" />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                {reservations.map((r) => (
                    <Card
                        key={r.id}
                        elevation={3}
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            p: 1.5,
                            mb: 0,
                            borderRadius: 2,
                            cursor: "pointer",
                            boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.15)",
                            border: "1px solid #eee",
                            transition: "transform 0.2s ease-in-out",
                            "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: "4px 8px 15px rgba(0, 0, 0, 0.2)",
                            },
                        }}
                        onClick={() => navigate(`/reserve/detail/${r.id}`)}
                    >
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {r.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                업종: {r.type}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                주소: {r.address}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {r.exitTime ? "체크인: " : "예약시간: "}
                                {formatDateTime(r.entryTime)}
                            </Typography>
                            {r.exitTime && (
                                <Typography variant="body2" color="text.secondary">
                                    체크아웃: {formatDateTime(r.exitTime)}
                                </Typography>
                            )}
                            <Typography variant="body2" color="primary">
                                예약금액: {r.amount.toLocaleString()}원
                            </Typography>
                        </Box>
                        <CardMedia
                            component="img"
                            image={r.image}
                            alt="시설 이미지"
                            sx={{ width: 100, height: 100, objectFit: "cover", borderRadius: 1 }}
                        />
                    </Card>
                ))}
            </Box>
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
