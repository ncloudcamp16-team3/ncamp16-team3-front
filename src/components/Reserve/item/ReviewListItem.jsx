import React from "react";
import { Avatar, Card, CardContent, CardMedia, Stack, Typography } from "@mui/material";

const ReviewListItem = ({ key, item }) => {
    return (
        <>
            <Card key={key} sx={{ height: "100%" }}>
                <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                        <Avatar src={item.avatar} />
                        <Typography variant="subtitle1">{item.user}</Typography>
                    </Stack>
                    <CardMedia
                        component="img"
                        height="180"
                        image={item.image}
                        alt="review"
                        sx={{ borderRadius: 1, mb: 2 }}
                    />
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        {item.comment}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {item.date}
                    </Typography>
                </CardContent>
            </Card>
        </>
    );
};

export default ReviewListItem;
