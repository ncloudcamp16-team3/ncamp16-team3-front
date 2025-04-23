import React from "react";
import { formatDate, formatPrice } from "./utils/formatters.jsx";
import { Box, Typography, Card, CardMedia, CardContent, Divider } from "@mui/material";

export const PaymentHistoryItem = ({ payment, isLast }) => {
    return (
        <Box>
            <Card
                elevation={0}
                sx={{
                    display: "flex",
                    padding: 2,
                    bgcolor: "background.paper",
                    borderRadius: 0,
                }}
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
                />
                <CardContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "5px 5px 5px 16px",
                        "&:last-child": { paddingBottom: "5px" },
                    }}
                >
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                            mb: 1,
                            height: "40px",
                            lineHeight: 1.2,
                        }}
                    >
                        {payment.name}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            fontSize: "0.875rem",
                            mb: 1,
                        }}
                    >
                        {formatDate(payment.createdAt)}
                    </Typography>
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
