import React from "react";
import { Box } from "@mui/material";

const PostThumbnail = ({ id, fileName }) => {
    return (
        <Box
            key={id}
            width="48%"
            height="100px"
            sx={{
                backgroundImage: `url(${fileName})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                borderRadius: 2,
                cursor: "pointer",
            }}
            onClick={() => {
                window.location.href = `/petsta/post/${id}`;
            }}
        />
    );
};

export default PostThumbnail;
