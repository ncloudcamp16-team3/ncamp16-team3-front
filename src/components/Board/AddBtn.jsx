import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const AddBtn = () => {
    const [rightPosition, setRightPosition] = useState();
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        const updatePosition = () => {
            const windowWidth = window.innerWidth;
            const layoutWidth = 500;

            if (windowWidth <= layoutWidth) {
                setRightPosition("20px");
            } else {
                const sideGap = (windowWidth - layoutWidth) / 2 + 20; // 20은 내부 여백
                setRightPosition(`${sideGap}px`);
            }
        };

        updatePosition();
        window.addEventListener("resize", updatePosition);

        return () => window.removeEventListener("resize", updatePosition);
    }, []);
    return (
        <Box
            onClick={() => navigate("/board/add")}
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "fixed",
                bottom: "80px",
                right: rightPosition,
                zIndex: 10,
                bgcolor: theme.brand3,
                borderRadius: "100%",
                width: "50px",
                height: "50px",
                cursor: "pointer",
            }}
        >
            <AddIcon sx={{ fontSize: "35px", color: "white" }} />
        </Box>
    );
};

export default AddBtn;
