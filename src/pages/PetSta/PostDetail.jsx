import React from "react";
import { useLocation, useParams } from "react-router-dom";
import posts from "../../mock/PetSta/posts.json";
import VideoDetail from "../../components/PetSta/Post/VideoDetail.jsx";
import PhotoDetail from "../../components/PetSta/Post/PhotoDetail.jsx";

const PostDetail = () => {
    const { postId } = useParams();
    const location = useLocation();
    const currentTime = location.state?.currentTime || 0;
    const post = posts.find((p) => p.postId === Number(postId));
    return (
        <div>
            {post.fileType === "video" ? (
                <VideoDetail post={post} currentTime={currentTime} />
            ) : (
                <PhotoDetail post={post} />
            )}
        </div>
    );
};

export default PostDetail;
