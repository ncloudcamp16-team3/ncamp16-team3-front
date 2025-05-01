import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import BookMarkBtn from "./BookMarkBtn.jsx";
import { useNavigate } from "react-router-dom";

const UsedMarketBar = ({ postData, bookMarked, bookMarkBtnClick, onClickChat }) => {
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: "85px",
                left: "10px",
                right: "10px",
                height: "50px",
                maxWidth: "480px",
                backgroundColor: theme.brand2,
                borderRadius: "10px",
                color: "white",
                zIndex: 1000,
                margin: "0 auto",
                alignItems: "center",
                display: "flex",
                p: "2px",
            }}
        >
            <BookMarkBtn
                bookMarked={bookMarked}
                fontSize="35px"
                bookMarkBtnClick={bookMarkBtnClick}
                className="bookmark-icon"
                sx={{ transition: "transform 0.2s ease-in-out" }}
            />
            <Typography
                sx={{
                    ml: "10px",
                    color: "black",
                    fontSize: "22px",
                    fontWeight: "600",
                }}
            >
                {postData.price}원
            </Typography>

            <Button
                onClick={onClickChat}
                variant="contained"
                sx={{
                    position: "absolute",
                    right: "15px",
                    borderRadius: "25px",
                    height: "38px",
                    width: "100px",
                    backgroundColor: theme.brand3,
                    boxShadow: "none",
                    "&:hover": {
                        backgroundColor: "#d88e4f",
                        boxShadow: "none",
                    },
                }}
            >
                채팅하기
            </Button>
        </Box>
    );
};

export default UsedMarketBar;
