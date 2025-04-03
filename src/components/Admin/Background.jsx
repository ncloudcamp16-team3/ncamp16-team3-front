import * as React from "react";
import { Box } from "@mui/material";
import { useEffect } from "react";

const Background = () => {
    useEffect(() => {
        document.body.style.overflow = "hidden"; // 스크롤 제거
        return () => {
            document.body.style.overflow = "auto"; // 컴포넌트가 언마운트되면 원래대로 복구
        };
    }, []);

    return (
        <Box
            sx={{
                maxWidth: "none",
                width: "100vw",
                height: "100vh",
                backgroundImage: "url('/src/assets/images/admin.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        ></Box>
    );
};

export default Background;
