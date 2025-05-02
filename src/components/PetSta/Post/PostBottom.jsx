import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import CommentButton from "./CommentButton.jsx";
import BookmarkButton from "./BookmarkButton.jsx";
import PostContent from "./PostContent.jsx";
import PostTime from "./PostTime.jsx";
import Likes from "./Likes.jsx";

const PostBottom = ({ initialLiked, initialBookmarked, userName, postId, likes, comments, content, createdAt }) => {
    const [commentCount, setCommentCount] = useState(comments);
    const [isExpended, setIsExpended] = useState(false);
    const [createTime, setCreateTime] = useState("");

    const theme = useTheme();
    const isLongContent = content.length > 30;
    const shortContent = isLongContent ? content.slice(0, 30) + "..." : content;

    useEffect(() => {
        if (comments >= 10000) {
            setCommentCount((comments / 10000).toFixed(1) + "만");
        } else {
            setCommentCount(comments.toString());
        }
    }, [comments]);

    useEffect(() => {
        const now = new Date();
        const created = new Date(createdAt);
        console.log("createdat:" + createdAt);
        console.log("현재시간" + now.toString());
        console.log("시간시간" + created.toString());
        const diff = now - created;
        const minutes = diff / (1000 * 60);
        const hours = diff / (1000 * 60 * 60);

        if (minutes < 1) setCreateTime("방금");
        else if (minutes < 60) setCreateTime(`${Math.floor(minutes)}분 전`);
        else if (hours < 24) setCreateTime(`${Math.floor(hours)}시간 전`);
        else setCreateTime(`${created.getMonth() + 1}월 ${created.getDate()}일`);
    }, [createdAt]);

    const handleExpandClick = () => setIsExpended((prev) => !prev);

    return (
        <div>
            <Box display="flex" justifyContent="space-between">
                <Box display="flex">
                    <Likes initialLiked={initialLiked} likes={likes} postId={postId} />
                    <CommentButton postId={postId} commentCount={commentCount} />
                </Box>
                <BookmarkButton initialBookmarked={initialBookmarked} postId={postId} />
            </Box>
            <PostContent
                userName={userName}
                content={content}
                shortContent={shortContent}
                isExpended={isExpended}
                isLongContent={isLongContent}
                handleExpandClick={handleExpandClick}
                theme={theme}
            />
            <PostTime createTime={createTime} theme={theme} />
        </div>
    );
};

export default PostBottom;
