import React from "react";
import { Box, Collapse, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const DropdownPostBtns = ({ dropPostBtn, setDropPostBtn, setOpenDeleteModal, setOpenUpdateModal }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                position: "absolute",
                bgcolor: theme.brand4,
                borderRadius: 2,
                top: "45px",
                right: "30px",
                pointerEvents: dropPostBtn ? "auto" : "none",
                zIndex: 1000,
            }}
        >
            <Collapse in={dropPostBtn} unmountOnExit>
                <Box
                    onClick={() => {
                        setDropPostBtn(false);
                        setOpenUpdateModal(true);
                    }}
                    sx={{
                        cursor: "pointer",
                        color: "white",
                        p: "5px 10px",
                    }}
                >
                    <Typography sx={{ m: "5px 10px" }}>게시글 수정하기</Typography>
                </Box>
                <Box
                    onClick={() => {
                        setDropPostBtn(false);
                        setOpenDeleteModal(true);
                    }}
                    sx={{
                        cursor: "pointer",
                        color: "white",
                        p: "5px 10px",
                    }}
                >
                    <Typography sx={{ m: "0px 10px 5px 10px" }}>게시글 삭제하기</Typography>
                </Box>
            </Collapse>
        </Box>
    );
};

export default DropdownPostBtns;
