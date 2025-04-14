import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

const MatchStart = ({ participants, text }) => {
    return (
        <Box textAlign="center" py={2}>
            <Box display="flex" justifyContent="center" gap={2} mb={1}>
                {participants.map((p, index) => (
                    <Box key={index} textAlign="center">
                        <Avatar
                            src={`/mock/Global/images/${p.photo}`}
                            alt={p.name}
                            sx={{ width: 60, height: 60, margin: "0 auto" }}
                        />
                        <Typography variant="body2">
                            {p.name} {p.age}
                        </Typography>
                    </Box>
                ))}
            </Box>
            <Typography fontWeight="bold">{text}</Typography>
        </Box>
    );
};

export default MatchStart;
