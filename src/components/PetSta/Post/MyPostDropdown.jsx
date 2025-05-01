import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Collapse, Typography } from "@mui/material";

const MyPostDropdown = ({ open, setOpen, onDelete }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                position: "absolute",
                bgcolor: theme.brand4,
                borderRadius: 2,
                top: "30px",
                right: "0px",
                pointerEvents: open ? "auto" : "none",
                zIndex: 100000,
                width: "150px",
            }}
        >
            <Collapse in={open} unmountOnExit>
                <Box
                    onClick={() => {
                        setOpen(false);
                        onDelete();
                    }}
                    sx={{
                        cursor: "pointer",
                        color: "white",
                        p: "10px",
                    }}
                >
                    <Typography sx={{ m: "0px 10px 5px 10px" }}>게시물 삭제하기</Typography>
                </Box>
            </Collapse>
        </Box>
    );
};

export default MyPostDropdown;
