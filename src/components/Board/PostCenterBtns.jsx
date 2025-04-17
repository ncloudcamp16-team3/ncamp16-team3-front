import React from "react";
import { Box, Typography } from "@mui/material";
import LikeBtn from "./LikeBtn.jsx";
import BookMarkBtn from "./BookMarkBtn.jsx";

const PostCenterBtns = ({ liked, likeBtnClick, bookMarked, bookMarkBtnClick }) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                my: "30px",
            }}
        >
            <Box
                sx={{
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    borderRadius: "16px",
                    px: "48px",
                    py: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "56px",
                    backgroundColor: "#fff",
                    transition: "box-shadow 0.3s ease-in-out",
                }}
            >
                {/* 좋아요 */}
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    sx={{
                        cursor: "pointer",
                        "&:hover .like-icon": {
                            transform: "scale(1.15)",
                        },
                    }}
                >
                    <LikeBtn
                        liked={liked}
                        fontSize="45px"
                        likeBtnClick={likeBtnClick}
                        className="like-icon"
                        sx={{ transition: "transform 0.2s ease-in-out" }}
                    />
                    <Typography
                        fontSize="15px"
                        mt="8px"
                        color={liked ? "error.main" : "text.secondary"}
                        fontWeight={liked ? 600 : 400}
                    >
                        좋아요
                    </Typography>
                </Box>

                {/* 북마크 */}
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    sx={{
                        cursor: "pointer",
                        "&:hover .bookmark-icon": {
                            transform: "scale(1.15)",
                        },
                    }}
                >
                    <BookMarkBtn
                        bookMarked={bookMarked}
                        fontSize="45px"
                        bookMarkBtnClick={bookMarkBtnClick}
                        className="bookmark-icon"
                        sx={{ transition: "transform 0.2s ease-in-out" }}
                    />
                    <Typography
                        fontSize="15px"
                        mt="8px"
                        color={bookMarked ? "#FFC107" : "text.secondary"}
                        fontWeight={bookMarked ? 600 : 400}
                    >
                        북마크
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default PostCenterBtns;
