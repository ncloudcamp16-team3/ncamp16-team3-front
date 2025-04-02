import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import PetStaHeart from "../../assets/images/PetSta/pet-sta-heart.svg";
import PetStaComment from "../../assets/images/PetSta/pet-sta-comment.svg";
import PetStaBookmark from "../../assets/images/PetSta/pet-sta-bookmark.svg";
import { useTheme } from "@mui/material/styles";

const PostBottom = ({ user_name, likes, comments, content, created_at }) => {
    const [like_count, setLike_count] = useState("");
    const [comment_count, setComment_count] = useState("");
    const [isExpended, setIsExpended] = useState(false);
    const [createTime, setCreateTime] = useState("");

    const theme = useTheme();
    const isLongContent = content.length > 30;
    const shortContent =
        content.length > 30 ? content.slice(0, 30) + "..." : content;

    useEffect(() => {
        if (likes >= 10000) {
            setLike_count((likes / 10000).toFixed(1) + "만");
        } else {
            setLike_count(likes.toString());
        }
    }, [likes]);

    useEffect(() => {
        if (comments >= 10000) {
            setComment_count((comments / 10000).toFixed(1) + "만");
        } else {
            setComment_count(comments.toString());
        }
    }, [comments]);

    useEffect(() => {
        const currentTime = new Date();
        const createdTime = new Date(created_at);

        // 24시간 이내인지 확인
        const timeDifference = currentTime - createdTime; // 밀리초 단위 차이
        const minutesDifference = timeDifference / (1000 * 60); // 분 단위로 변환
        const hoursDifference = timeDifference / (1000 * 60 * 60); // 시간 단위로 변환

        if (minutesDifference < 1) {
            // 0분 전 -> "방금"
            setCreateTime("방금");
        } else if (minutesDifference < 60) {
            // 1시간 이내 -> "X분 전"
            const minutesAgo = Math.floor(minutesDifference);
            setCreateTime(`${minutesAgo}분 전`);
        } else if (hoursDifference < 24) {
            // 24시간 이내 -> "X시간 전"
            const hoursAgo = Math.floor(hoursDifference);
            setCreateTime(`${hoursAgo}시간 전`);
        } else {
            // 24시간을 넘으면 월/일 형식으로
            const options = { month: "2-digit", day: "2-digit" };
            const month = createdTime.getMonth() + 1; // 0부터 시작하므로 +1
            const day = createdTime.getDate();
            setCreateTime(`${month}월 ${day}일`);
        }
    }, [created_at]);

    const renderContent = (text) => {
        return text.split("\n").map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        ));
    };
    return (
        <div>
            <Box display="flex" justifyContent="space-between">
                <Box sx={{ padding: 1, display: "flex", alignItems: "center" }}>
                    <img src={PetStaHeart} alt="Like Icon" />
                    <Typography sx={{ marginRight: 2 }}>
                        {like_count}
                    </Typography>{" "}
                    {/* marginRight가 sx로 적용됨 */}
                    <img src={PetStaComment} alt="Comment Icon" />
                    <Typography>{comment_count}</Typography>
                </Box>
                <Box sx={{ padding: 1, display: "flex", alignItems: "center" }}>
                    <img src={PetStaBookmark} alt="Bookmark Icon" />
                </Box>
            </Box>
            <Box
                sx={{
                    padding: 1,
                    flexWrap: "wrap",
                }}
            >
                <Typography
                    display="inline"
                    sx={{
                        fontSize: "1.1rem",
                        marginRight: 2,
                        fontWeight: "bold",
                        whiteSpace: "nowrap", // 이름이 줄 바뀌지 않도록 설정
                    }}
                >
                    {user_name}
                </Typography>
                <Typography
                    component="span"
                    display="inline"
                    sx={{
                        wordBreak: "break-word", // 긴 텍스트가 줄 바뀌도록 설정
                        flex: "1", // 나머지 공간을 차지하도록 설정
                    }}
                >
                    {isExpended ? renderContent(content) : shortContent}
                    {isLongContent ? (
                        <Typography
                            component="span"
                            display="inline"
                            sx={{ color: theme.secondary, marginLeft: 1 }}
                            onClick={() => setIsExpended(!isExpended)}
                        >
                            {isExpended ? "" : "더 보기"}
                        </Typography>
                    ) : (
                        ""
                    )}
                </Typography>
            </Box>
            <Box
                sx={{
                    paddingLeft: 1,
                    marginBottom: 2,
                    color: theme.secondary,
                }}
            >
                {createTime}
            </Box>
        </div>
    );
};

export default PostBottom;
