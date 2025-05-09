import React from "react";
import { Card, CardMedia, Container, ListItem, Typography, Box, List, Button } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import success from "../../assets/images/Reserve/payment-success.svg";
import CustomizedDot from "../../components/Reserve/utils/CustomizedDot.jsx";

const Reservation = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const name = searchParams.get("name");
    const amount = searchParams.get("amount");
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    return (
        <Container sx={{ mt: 4 }}>
            <Card sx={{ width: 350, mx: "auto", border: "none", boxShadow: "none", pr: 5 }}>
                <CardMedia component="img" image={success} alt="결제 완료 이미지" />
            </Card>
            <Typography variant="h5" align="center" fontWeight="bold" sx={{ my: 3, pt: 5 }}>
                결제가 완료되었습니다!
            </Typography>
            <Box>
                <Typography variant="h6" sx={{ pt: 3, fontSize: 32 }}>
                    {name}
                </Typography>
                <List sx={{ pt: 2 }}>
                    <ListItem>
                        <CustomizedDot />
                        체크인: {start ? new Date(start).toLocaleString("ko-KR") : "없음"}
                    </ListItem>
                    {end && (
                        <ListItem>
                            <CustomizedDot />
                            체크아웃: {new Date(end).toLocaleString("ko-KR")}
                        </ListItem>
                    )}
                    <ListItem>
                        <CustomizedDot />
                        결제금액: {Number(amount).toLocaleString()} 원
                    </ListItem>
                </List>
            </Box>
            <Box>
                <Button
                    variant="contained"
                    sx={{ bgcolor: "#E9A260", borderRadius: 3, mb: 2, mt: 8 }}
                    size="large"
                    onClick={() => navigate(`/reserve/list`)}
                    fullWidth
                >
                    예약 목록 가기
                </Button>
                <Button
                    variant="contained"
                    sx={{ bgcolor: "#E9A260", borderRadius: 3, mt: 1, mb: 3.5 }}
                    size="large"
                    onClick={() => navigate(`/reserve/detail/${searchParams.get("id")}`)} // 또는 상세 페이지 id가 있으면 detail 페이지 이동
                    fullWidth
                >
                    예약 상세 보기
                </Button>
            </Box>
        </Container>
    );
};

export default Reservation;
