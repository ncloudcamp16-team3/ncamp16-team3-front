import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Box, List, ListItem, Typography, Button, Divider } from "@mui/material";
import TitleBar from "../../components/Global/TitleBar.jsx";
import ReserveMap from "../../components/Reserve/map/ReserveMap.jsx";
import reserveList from "../../mock/Reserve/reserveList.json";
import CustomizedDot from "../../components/Reserve/utils/CustomizedDot.jsx";

const ReservationDetail = () => {
    const { id } = useParams();
    const [reservation, setReservation] = useState(null);
    const [address, setAddress] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const found = reserveList.find((r) => r.id === parseInt(id));
        setReservation(found);
        if (found) {
            setAddress(found.address);
        }
    }, [id]);

    if (!reservation) {
        return (
            <Container>
                <TitleBar name="예약 상세" />
                <Typography component="div">예약 정보를 불러오는 중입니다...</Typography>
            </Container>
        );
    }

    return (
        <Container>
            <TitleBar name="예약 상세" />
            <Box sx={{ m: 2 }}>
                <Box my={2} sx={{ cursor: "pointer" }} onClick={() => navigate(`/reserve/${reservation.id}`)}>
                    <Typography variant="h5" fontWeight="bold">
                        {reservation.name}
                    </Typography>
                </Box>

                <ReserveMap address={address} setAddress={setAddress} />

                <List>
                    <ListItem>
                        <Box display="flex" flexDirection="column" gap={1} width="100%">
                            <Typography variant="body2" component="div">
                                <CustomizedDot />
                                서비스 업종: {reservation.type}
                            </Typography>
                            <Typography variant="body2" component="div">
                                <CustomizedDot />
                                위치: {reservation.address}
                            </Typography>
                            <Typography variant="body2" component="div">
                                <CustomizedDot />
                                {reservation.entry_time.end ? "체크인" : "예약시간"}: {reservation.entry_time.start}
                            </Typography>
                            {reservation.entry_time.end && (
                                <Typography variant="body2" component="div">
                                    <CustomizedDot />
                                    체크아웃: {reservation.entry_time.end}
                                </Typography>
                            )}
                            <Typography variant="body2" color="primary" component="div">
                                <CustomizedDot />
                                결제금액: {reservation.amount.toLocaleString()} 원
                            </Typography>
                        </Box>
                    </ListItem>
                </List>
                <Divider />
                <Button
                    variant="contained"
                    sx={{ bgcolor: "#E9A260", borderRadius: 3, mt: 2, mb: 2 }}
                    size="large"
                    onClick={() => navigate(`/reserve/review/${reservation.id}`)}
                    fullWidth
                >
                    리뷰작성
                </Button>
                <Button variant="contained" sx={{ bgcolor: "#E9A260", borderRadius: 3, mb: 1 }} size="large" fullWidth>
                    예약취소
                </Button>
            </Box>
        </Container>
    );
};

export default ReservationDetail;
