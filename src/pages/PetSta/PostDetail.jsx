import React from "react";
import { useLocation, useParams } from "react-router-dom";
import posts from "../../mock/PetSta/posts.json";
import VideoDetail from "../../components/PetSta/VideoDetail.jsx";

const PostDetail = () => {
    const { post_id } = useParams();
    const location = useLocation();
    const currentTime = location.state?.currentTime || 0;
    const post = posts.find((p) => p.post_id === post_id);
    return (
        <div>{post.file_type === "video" ? <VideoDetail post={post} currentTime={currentTime} /> : <div>엑</div>}</div>
    );
};

export default PostDetail;
