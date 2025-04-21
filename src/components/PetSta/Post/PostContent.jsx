import React from "react";
import { Typography, Box } from "@mui/material";

const PostContent = ({ userName, content, shortContent, isExpended, isLongContent, handleExpandClick, theme }) => {
    const renderContent = (text) => {
        return text.split("\n").map((line, idx) => (
            <span key={idx}>
                {line}
                <br />
            </span>
        ));
    };

    return (
        <Box sx={{ padding: 1, flexWrap: "wrap" }}>
            <Typography
                display="inline"
                sx={{
                    fontSize: "1.1rem",
                    marginRight: 2,
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                }}
            >
                {userName}
            </Typography>
            <Typography
                component="span"
                display="inline"
                sx={{
                    wordBreak: "break-word",
                    flex: "1",
                }}
            >
                {isExpended ? renderContent(content) : shortContent}
                {isLongContent && (
                    <Typography
                        component="span"
                        display="inline"
                        sx={{ color: theme.secondary, marginLeft: 1, cursor: "pointer" }}
                        onClick={handleExpandClick}
                    >
                        {isExpended ? "" : "더 보기"}
                    </Typography>
                )}
            </Typography>
        </Box>
    );
};

export default PostContent;
