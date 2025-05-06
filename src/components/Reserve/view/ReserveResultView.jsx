import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import reserveList from "../../../mock/Reserve/reserveList.json";
import { Box, Button, Card, CardMedia, Container, List, ListItem, Typography } from "@mui/material";
import success from "../../../assets/images/Reserve/payment-success.svg";
import CustomizedDot from "../utils/CustomizedDot.jsx";

const ReserveResultView = () => {
    const { id } = useParams();
    const [facility, setFacility] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const found = reserveList.find((r) => r.id === parseInt(id));
        if (found) {
            setFacility(found);
        }
    }, [id]);

    if (!facility) {
        return (
            <Container>
                <Typography>예약 정보를 불러오는 중입니다...</Typography>
            </Container>
        );
    }

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
                    {facility.name}
                </Typography>
                <List sx={{ pt: 2 }}>
                    <ListItem>
                        <CustomizedDot />
                        체크인: {facility.entry_time.start}
                    </ListItem>
                    {facility.entry_time.end && (
                        <ListItem>
                            <CustomizedDot /> 체크아웃: {facility.entry_time.end}
                        </ListItem>
                    )}
                    <ListItem>
                        <CustomizedDot />
                        결제금액: {facility.amount.toLocaleString()} 원
                    </ListItem>
                </List>
            </Box>
            <Box>
                <Button
                    variant="contained"
                    sx={{ bgcolor: "#E9A260", borderRadius: 3, mb: 2, mt: 12 }}
                    size="large"
                    onClick={() => navigate(`/reserve/list`)}
                    fullWidth
                >
                    예약 목록 가기
                </Button>
                <Button
                    variant="contained"
                    sx={{ bgcolor: "#E9A260", borderRadius: 3, mt: 1, mb: 2 }}
                    size="large"
                    onClick={() => navigate(`/reserve/detail/${id}`)}
                    fullWidth
                >
                    예약 상세 보기
                </Button>
            </Box>
        </Container>
    );
};

export default ReserveResultView;
