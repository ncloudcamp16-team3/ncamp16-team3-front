import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getPostById } from "../../services/petstaService.js";
import VideoDetail from "../../components/PetSta/Post/VideoDetail.jsx";
import PhotoDetail from "../../components/PetSta/Post/PhotoDetail.jsx";
import { useFollow } from "../../context/FollowContext.jsx";

const PostDetail = () => {
    const { postId } = useParams();
    const [post, setPost] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const currentTime = location.state?.currentTime || 0;
    const { setInitialFollow } = useFollow();

    useEffect(() => {
        const getPost = async () => {
            try {
                const data = await getPostById(postId);
                setPost(data);
                setInitialFollow(data.userId, data.initialFollowed);
            } catch (error) {
                const msg = error?.response?.data?.message || "게시글을 불러오는 중 오류가 발생했습니다.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        getPost();
    }, []);

    if (error) {
        return (
            <div style={{ textAlign: "center", marginTop: "100px" }}>
                <p style={{ color: "gray", fontSize: "18px" }}>{error}</p>
            </div>
        );
    }

    return (
        <>
            {post.fileType === "VIDEO" ? (
                <VideoDetail post={post} currentTime={currentTime} />
            ) : post.fileType === "PHOTO" ? (
                <PhotoDetail post={post} />
            ) : null}
        </>
    );
};

export default PostDetail;
