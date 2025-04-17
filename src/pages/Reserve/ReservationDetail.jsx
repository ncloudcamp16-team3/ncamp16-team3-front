import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Box, List, ListItem, Typography } from "@mui/material";
import TitleBar from "../../components/Global/TitleBar.jsx";
import ReserveMap from "../../components/Reserve/map/ReserveMap.jsx";
import reserveList from "../../mock/Reserve/reserveList.json";
import CustomizedDot from "../../components/Reserve/utils/CustomizedDot.jsx";

const ReservationDetail = () => {
    const { id } = useParams();
    const [reservation, setReservation] = useState(null);
    const [address, setAddress] = useState(null);

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
                <Box my={2}>
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
            </Box>
        </Container>
    );
};

export default ReservationDetail;
