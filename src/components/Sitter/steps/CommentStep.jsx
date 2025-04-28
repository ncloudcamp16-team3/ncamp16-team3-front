import React from "react";
import { Box, Typography, TextField } from "@mui/material";

/**
 * 한마디 작성 단계 컴포넌트
 * @param {Object} props
 * @param {string} props.commentText 한마디 텍스트
 * @param {Function} props.onChange 텍스트 변경 핸들러
 */
const CommentStep = ({ commentText, onChange }) => {
    return (
        <Box
            sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                pt: 2,
                alignItems: "center",
            }}
        >
            <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                    mb: 4,
                    textAlign: "center",
                }}
            >
                펫시터를 맡기실 보호자들에게
                <br />
                한마디 해주세요!
            </Typography>

            <TextField
                fullWidth
                multiline
                rows={8}
                placeholder="보호자들에게 한마디"
                value={commentText}
                onChange={(e) => onChange(e.target.value)}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                    },
                }}
            />
        </Box>
    );
};

export default CommentStep;
