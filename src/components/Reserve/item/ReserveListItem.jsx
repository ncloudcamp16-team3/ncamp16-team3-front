import React from "react";
import { Card, CardMedia, Divider, ListItem, ListItemText, Typography } from "@mui/material";
import { useReserveRouteContext } from "../../../context/ReserveContext.jsx";

const ReserveListItem = ({ item }) => {
    const { goTo } = useReserveRouteContext();
    return (
        <>
            <ListItem
                button
                alignItems="flex-start"
                onClick={() => goTo("/reserve/detail", item.id)}
                sx={{ display: "flex", gap: 2 }}
            >
                <ListItemText
                    primary={
                        <Typography variant="subtitle1" fontWeight="bold">
                            {item.facility.name}
                        </Typography>
                    }
                    secondary={
                        <>
                            <Typography variant="body2" color="text.secondary">
                                업종: {item.facility.type}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                주소: {item.facility.address}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {item.exitTime ? "체크인: " : "예약시간: "}
                                {item.entryTime}
                            </Typography>
                            {item.exitTime && (
                                <Typography variant="body2" color="text.secondary">
                                    체크아웃: {item.exitTime}
                                </Typography>
                            )}
                            <Typography variant="body2" color="primary">
                                예약금액: {item.amount.toLocaleString()}원
                            </Typography>
                        </>
                    }
                />

                <Card sx={{ width: 100, height: 100, flexShrink: 0 }}>
                    <CardMedia
                        component="img"
                        height="100"
                        image={item.image}
                        alt="시설 이미지"
                        sx={{ objectFit: "cover" }}
                    />
                </Card>
            </ListItem>
            <Divider />
        </>
    );
};

export default ReserveListItem;
