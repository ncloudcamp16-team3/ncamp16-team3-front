import React from "react";
import { formatPrice } from "./utils/formatters.jsx";
import { Box, Typography, Card, CardMedia, CardContent, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

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

export const PaymentHistoryItem = ({ payment, isLast }) => {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <Card
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
                onClick={() => navigate(`/reserve/detail/${payment.reserveId}`)}
            >
                <CardMedia
                    component="img"
                    sx={{
                        width: 120,
                        height: 96,
                        objectFit: "cover",
                        bgcolor: "grey.100",
                    }}
                    image={payment.imageUrl}
                    alt={payment.name}
                />{" "}
                <CardContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "5px 5px 5px 16px",
                        width: "100%", // ✅ 추가
                        "&:last-child": { paddingBottom: "5px" },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                        }}
                    >
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                fontWeight: "bold",
                                fontSize: "1.5rem",
                                lineHeight: 1.2,
                            }}
                        >
                            {payment.name}
                        </Typography>

                        {payment.createdAt && (
                            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap", ml: 2 }}>
                                {formatDateTime(payment.createdAt)}
                            </Typography>
                        )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        {payment.exitTime ? "체크인: " : "예약시간: "}
                        {formatDateTime(payment.entryTime)}
                    </Typography>
                    {payment.exitTime && (
                        <Typography variant="body2" color="text.secondary">
                            체크아웃: {formatDateTime(payment.exitTime)}
                        </Typography>
                    )}
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: "bold",
                            fontSize: "1.25rem",
                        }}
                    >
                        {formatPrice(payment.price)}원
                    </Typography>
                </CardContent>
            </Card>
            {!isLast && <Divider />}
        </Box>
    );
};
