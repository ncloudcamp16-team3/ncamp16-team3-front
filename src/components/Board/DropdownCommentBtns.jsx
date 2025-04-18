import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Collapse, Typography } from "@mui/material";

const DropdownCommentBtns = ({ dropCommentBtn, setDropCommentBtn, setUpdateAble, requestCommentDelete }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                position: "absolute",
                bgcolor: theme.brand4,
                borderRadius: 2,
                top: "45px",
                right: "10px",
                pointerEvents: dropCommentBtn ? "auto" : "none",
                zIndex: 1000,
            }}
        >
            <Collapse in={dropCommentBtn} unmountOnExit>
                <Box
                    onClick={() => {
                        setDropCommentBtn(false);
                        setUpdateAble(true);
                    }}
                    sx={{
                        cursor: "pointer",
                        color: "white",
                        p: "5px 10px",
                    }}
                >
                    <Typography sx={{ m: "5px 10px" }}>댓글 수정하기</Typography>
                </Box>
                <Box
                    onClick={requestCommentDelete}
                    sx={{
                        cursor: "pointer",
                        color: "white",
                        p: "5px 10px",
                    }}
                >
                    <Typography sx={{ m: "0px 10px 5px 10px" }}>댓글 삭제하기</Typography>
                </Box>
            </Collapse>
        </Box>
    );
};

export default DropdownCommentBtns;
