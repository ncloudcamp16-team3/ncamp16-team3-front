import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getPostById } from "../../services/petstaService.js";
import VideoDetail from "../../components/PetSta/Post/VideoDetail.jsx";
import PhotoDetail from "../../components/PetSta/Post/PhotoDetail.jsx";
import { useFollow } from "../../context/FollowContext.jsx";

const PostDetail = () => {
    const { postId } = useParams();
    const [post, setPost] = useState({});
    const location = useLocation();
    const currentTime = location.state?.currentTime || 0;
    const { setInitialFollow } = useFollow();

    useEffect(() => {
        const getPost = async () => {
            try {
                const data = await getPostById(postId); // 서비스에서 데이터를 기다림
                setPost(data); // ★ 받은 데이터 저장
                console.log(data);
                setInitialFollow(data.userId, data.initialFollowed);
            } catch (error) {
                console.error("게시글을 불러오는데 실패했습니다.", error);
            }
        };

        getPost(); // useEffect 내에서 비동기 함수 호출
    }, []);

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
