import React from "react";
import { IconButton } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

const BookMarkBtn = ({ bookMarked, fontSize, bookMarkBtnClick }) => {
    return (
        <IconButton
            onClick={() => bookMarkBtnClick()}
            sx={{
                transition: "transform 0.2s ease-in-out",
                "&:active": {
                    transform: "scale(1.2)",
                },
            }}
        >
            {bookMarked ? (
                <BookmarkIcon sx={{ color: "#FFC107", fontSize: fontSize }} />
            ) : (
                <BookmarkBorderIcon sx={{ color: "gray", fontSize: fontSize }} />
            )}
        </IconButton>
    );
};

export default BookMarkBtn;
