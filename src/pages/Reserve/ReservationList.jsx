// src/pages/ReservationListPage.jsx
import React, { useEffect, useState } from "react";
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
    Button,
} from "@mui/material";
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

            <Paper elevation={3} sx={{ mt: 2 }}>
                <List>
                    {reservations.map((r) => (
                        <React.Fragment key={r.id}>
                            <ListItem
                                button
                                alignItems="flex-start"
                                onClick={() => navigate(`/reserve/detail/${r.id}`)}
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
                                        </>
                                    }
                                />

                                <Card sx={{ width: 100, height: 100, flexShrink: 0 }}>
                                    <CardMedia
                                        component="img"
                                        height="100"
                                        image={r.image}
                                        alt="시설 이미지"
                                        sx={{ objectFit: "cover" }}
                                    />
                                </Card>
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                    )
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
