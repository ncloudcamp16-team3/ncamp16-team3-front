import React, { useState } from "react";
import { Box } from "@mui/material";
import PetStaBookmark from "../../../assets/images/PetSta/petsta-bookmark.svg";
import PetStaBookMarKFilled from "../../../assets/images/PetSta/petsta-bookmark-filled.svg";
import { toggleBookmark } from "../../../services/petstaService.js";

const BookmarkButton = ({ postId, initialBookmarked }) => {
    const [bookmarked, setBookmarked] = useState(initialBookmarked);
    const handleBookmarkClick = async () => {
        console.log("누른거맞냐?");
        try {
            await toggleBookmark(postId);
            setBookmarked((prev) => !prev);
        } catch (error) {
            console.error("북마크 실패", error);
        }
    };

    return (
        <Box
            sx={{ padding: 1, display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={handleBookmarkClick}
        >
            <img src={bookmarked ? PetStaBookMarKFilled : PetStaBookmark} alt="Bookmark Icon" />
        </Box>
    );
};

export default BookmarkButton;
