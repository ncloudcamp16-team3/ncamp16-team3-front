import React, { useEffect, useState } from "react";
import PhotoPost from "../../components/PetSta/Post/PhotoPost.jsx";
import VideoPost from "../../components/PetSta/Post/VideoPost.jsx";
import FriendList from "../../components/PetSta/FriendList.jsx";
import { Box } from "@mui/material";
import theme from "../../theme/theme.js";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { getPostLists } from "../../services/petstaService.js";
import { useFollow } from "../../context/FollowContext.jsx";

const PetSta = () => {
    const [posts, setPosts] = useState([]);
    const [isMute, setIsMute] = useState(true);
    const [showBox, setShowBox] = useState(false);
    const [rightPosition, setRightPosition] = useState("20px");
    const [followings, setFollowings] = useState([]);
    const navigate = useNavigate();
    const { setInitialFollow } = useFollow();

    useEffect(() => {
        const getPosts = async () => {
            try {
                const data = await getPostLists();
                setPosts(data.posts);
                setFollowings(data.followings);
                data.posts.forEach((post) => {
                    setInitialFollow(post.userId, post.initialFollowed);
                });
            } catch (error) {
                console.error("게시글을 불러오는데 실패했습니다.", error);
            }
        };

        getPosts();
    }, []);

    useEffect(() => {
        const updatePosition = () => {
            const windowWidth = window.innerWidth;
            const layoutWidth = 500;

            if (windowWidth <= layoutWidth) {
                setRightPosition("20px");
            } else {
                const sideGap = (windowWidth - layoutWidth) / 2 + 20;
                setRightPosition(`${sideGap}px`);
            }
        };

        updatePosition();
        window.addEventListener("resize", updatePosition);

        return () => window.removeEventListener("resize", updatePosition);
    }, []);

    const handleFabClick = () => setShowBox((prev) => !prev);

    const toggleMute = () => {
        setIsMute(!isMute);
    };

    return (
        <Box>
            <FriendList followings={followings} />
            {posts.map((post) =>
                post.fileType === "VIDEO" ? (
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
                        initialLiked={post.initialLiked}
                        initialBookmarked={post.initialBookmarked}
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
                        initialLiked={post.initialLiked}
                        initialBookmarked={post.initialBookmarked}
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
