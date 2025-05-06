// src/pages/ReservationListPage.jsx
import React, { useEffect, useState } from "react";
import reserveList from "../../mock/Reserve/reserveList.json";
import { Container, List, ListItem, ListItemText, Divider, Paper, CardMedia, Card, Typography } from "@mui/material";
import TitleBar from "../../components/Global/TitleBar.jsx";
import { useNavigate } from "react-router-dom";

const ReservationListPage = () => {
    const [reservations, setReservations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = reserveList || [];
        setReservations(stored);
    }, []);

    return (
        <Container maxWidth="sm">
            <TitleBar name="예약 목록" />

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
                                                    {r.entry_time.end ? "체크인: " : "예약시간: "}
                                                    {r.entry_time.start}
                                                </Typography>
                                                {r.entry_time.end && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        체크아웃: {r.entry_time.end}
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
                        ))
                    )}
                </List>
            </Paper>
        </Container>
    );
};

export default ReservationListPage;
