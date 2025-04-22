import React, { useState } from "react";
import { Box } from "@mui/material";
import PetStaBookmark from "../../../assets/images/PetSta/petsta-bookmark.svg";
import PetStaBookMarKFilled from "../../../assets/images/PetSta/petsta-bookmark-filled.svg";
import PetStaBookmarkWhite from "../../../assets/images/PetSta/petsta-bookmark-white.svg";
import PetStaBookMarKWhiteFilled from "../../../assets/images/PetSta/petsta-bookmark-white-filled.svg";
import { toggleBookmark } from "../../../services/petstaService.js";

const BookmarkButton = ({ postId, initialBookmarked, isWhite = false, width = 24 }) => {
    const [bookmarked, setBookmarked] = useState(initialBookmarked);

    const handleBookmarkClick = async () => {
        try {
            await toggleBookmark(postId);
            setBookmarked((prev) => !prev);
        } catch (error) {
            console.error("북마크 실패", error);
        }
    };

    // 아이콘 선택
    const bookmarkIcon = isWhite
        ? bookmarked
            ? PetStaBookMarKWhiteFilled
            : PetStaBookmarkWhite
        : bookmarked
          ? PetStaBookMarKFilled
          : PetStaBookmark;

    return (
        <Box
            sx={{ padding: 1, display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={handleBookmarkClick}
        >
            <img src={bookmarkIcon} alt="Bookmark Icon" width={width} />
        </Box>
    );
};

export default BookmarkButton;
