import React from "react";
import { Box } from "@mui/material";

const PostTime = ({ createTime, theme }) => {
    return <Box sx={{ paddingLeft: 1, marginBottom: 2, color: theme.secondary }}>{createTime}</Box>;
};

export default PostTime;
