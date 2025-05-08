import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Box, List, ListItem, Typography, Button, Divider } from "@mui/material";
import TitleBar from "../../components/Global/TitleBar.jsx";
import ReserveMap from "../../components/Reserve/map/ReserveMap.jsx";
import CustomizedDot from "../../components/Reserve/utils/CustomizedDot.jsx";
import { getReserveDetail } from "../../services/reserveService.js";
import CenteredContainer from "../../components/Reserve/utils/CenteredContainer.jsx"; // ✅ API 호출 함수
import { cancelReserve } from "../../services/reserveService.js";
import { Context } from "../../context/Context.jsx";
import GlobalConfirmModal from "../../components/Global/GlobalConfirmModal.jsx"; // ✅ API 호출 함수

const ReservationDetail = () => {
    const { id } = useParams();
    const [reservation, setReservation] = useState(null);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const { handleSnackbarOpen } = useContext(Context);

    const requestCancelReserve = () => {
        cancelReserve(id)
            .then(() => {
                navigate("/reserve/list");
            })
            .catch((err) => {
                handleSnackbarOpen(err.message, "error");
            });
    };

    useEffect(() => {
        getReserveDetail(id)
            .then((res) => {
                setReservation(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.error("예약 상세 조회 실패:", err);
            });
    }, [id]);

    if (!reservation) {
        return (
            <CenteredContainer>
                <TitleBar name="예약 상세" onBack={() => navigate("/reserve/list")} />
                <Typography component="div">예약 정보를 불러오는 중입니다...</Typography>
            </CenteredContainer>
        );
    }

    const formatDate = (datetimeStr) => {
        if (!datetimeStr) return "";
        const date = new Date(datetimeStr);
        return date.toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    const now = new Date();
    const canCancel = reservation.entryTime && new Date(reservation.entryTime) > now;
    const canReview = reservation.exitTime && new Date(reservation.exitTime) < now;

    return (
        <Container>
            <TitleBar name="예약 상세" onBack={() => navigate("/reserve/list")} />
            <Box sx={{ m: 2 }}>
                <Box my={2} sx={{ cursor: "pointer" }} onClick={() => navigate(`/reserve/${reservation.id}`)}>
                    <Typography variant="h5" fontWeight="bold">
                        {reservation.name}
                    </Typography>
                </Box>
                <ReserveMap lat={reservation.latitude} lng={reservation.longitude} />
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
                                {reservation.exitTime ? "체크인" : "예약시간"}: {formatDate(reservation.entryTime)}
                            </Typography>
                            {reservation.exitTime && (
                                <Typography variant="body2" component="div">
                                    <CustomizedDot />
                                    체크아웃: {formatDate(reservation.exitTime)}
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
                <Divider />
                {canReview && (
                    <Button
                        variant="contained"
                        sx={{ bgcolor: "#E9A260", borderRadius: 3, mt: 2, mb: 2 }}
                        size="large"
                        onClick={() => navigate(`/reserve/review/${reservation.id}`)}
                        fullWidth
                    >
                        리뷰작성
                    </Button>
                )}
                {canCancel && (
                    <Button
                        variant="contained"
                        sx={{ bgcolor: "#E9A260", borderRadius: 3, mb: 1 }}
                        size="large"
                        fullWidth
                        onClick={() => setOpen(true)}
                    >
                        예약취소
                    </Button>
                )}
            </Box>
            <GlobalConfirmModal
                open={open}
                title={"예약취소"}
                description={"정말 취소하시겠습니까?"}
                confirmText={"예"}
                cancelText={"아니오"}
                onConfirm={requestCancelReserve}
                onClose={() => setOpen(false)}
            />
        </Container>
    );
};

export default ReservationDetail;
