import React, { useEffect, useState } from "react";
import PhotoPost from "../../components/PetSta/PhotoPost.jsx"; // PhotoPost 컴포넌트 가져오기
import postsData from "../../mock/PetSta/posts.json";
import VideoPost from "../../components/PetSta/VideoPost.jsx";
import FriendList from "../../components/PetSta/FriendList.jsx";
import { Box } from "@mui/material";
import theme from "../../theme/theme.js";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
// JSON 데이터 불러오기

const PetSta = () => {
    const [posts, setPosts] = useState([]);
    const [isMute, setIsMute] = useState(true);
    const [showBox, setShowBox] = useState(false);
    const handleFabClick = () => setShowBox((prev) => !prev);
    const navigate = useNavigate();
    useEffect(() => {
        setPosts(postsData); // JSON 파일에서 데이터를 setPosts로 업데이트
    }, []);

    const [rightPosition, setRightPosition] = useState("20px");

    useEffect(() => {
        const updatePosition = () => {
            const windowWidth = window.innerWidth;
            const layoutWidth = 500;

            if (windowWidth <= layoutWidth) {
                setRightPosition("20px");
            } else {
                const sideGap = (windowWidth - layoutWidth) / 2 + 20; // 20은 내부 여백
                setRightPosition(`${sideGap}px`);
            }
        };

        updatePosition();
        window.addEventListener("resize", updatePosition);

        return () => window.removeEventListener("resize", updatePosition);
    }, []);
    const toggleMute = () => {
        setIsMute(!isMute);
    };

    return (
        <Box>
            <FriendList />
            {posts.map((post) =>
                post.fileType === "video" ? (
                    <VideoPost
                        key={post.postId}
                        postId={post.postId}
                        userId={post.userId}
                        userName={post.userName}
                        userPhoto={post.userPhoto}
                        fileName={post.fileName}
                        fileType={post.fileType}
                        likes={post.likes}
                        comments={post.comments}
                        content={post.content}
                        createdAt={post.createdAt}
                        isMute={isMute}
                        toggleMute={toggleMute}
                    />
                ) : (
                    <PhotoPost
                        key={post.postId}
                        postId={post.postId}
                        userId={post.userId}
                        userName={post.userName}
                        userPhoto={post.userPhoto}
                        fileName={post.fileName}
                        fileType={post.fileType}
                        likes={post.likes}
                        comments={post.comments}
                        content={post.content}
                        createdAt={post.createdAt}
                    />
                )
            )}
            {showBox && (
                <Box
                    position="fixed"
                    bottom="140px"
                    right={rightPosition}
                    zIndex={10}
                    bgcolor={theme.brand5}
                    borderRadius="12px"
                    boxShadow={3}
                    padding="10px"
                    minWidth="150px"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    fontWeight="600"
                >
                    <Box
                        width="100%"
                        sx={{ cursor: "pointer", textAlign: "center" }}
                        onClick={() => navigate("/petsta/post/add/photo")}
                    >
                        새 게시물
                    </Box>
                    <Box
                        sx={{
                            height: "1px",
                            width: "90%",
                            borderBottom: "1px solid #C8C8C8",
                            my: "10px",
                        }}
                    />
                    <Box
                        width="100%"
                        sx={{ cursor: "pointer", textAlign: "center" }}
                        onClick={() => navigate("/petsta/post/add/video")}
                    >
                        새 동영상
                    </Box>
                </Box>
            )}

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                position="fixed"
                bottom="80px"
                right={rightPosition}
                zIndex={10}
                bgcolor={theme.brand3}
                borderRadius="100%"
                width="50px"
                height="50px"
                onClick={handleFabClick}
            >
                <AddIcon sx={{ fontSize: "35px", color: "white" }} />
            </Box>
        </Box>
    );
};

export default PetSta;
