import React, { useEffect, useState } from "react";
import PhotoPost from "../../components/PetSta/PhotoPost.jsx"; // PhotoPost 컴포넌트 가져오기
import postsData from "../../mock/PetSta/posts.json";
import VideoPost from "../../components/PetSta/VideoPost.jsx";
import FriendList from "../../components/PetSta/FriendList.jsx";
// JSON 데이터 불러오기

const PetSta = () => {
    const [posts, setPosts] = useState([]);
    const [isMute, setIsMute] = useState(true);

    useEffect(() => {
        setPosts(postsData); // JSON 파일에서 데이터를 setPosts로 업데이트
    }, []);

    const toggleMute = () => {
        setIsMute(!isMute);
    };

    return (
        <div>
            <FriendList />
            {posts.map((post) =>
                post.file_type === "video" ? (
                    <VideoPost
                        key={post.post_id}
                        post_id={post.post_id}
                        user_id={post.user_id}
                        user_name={post.user_name}
                        user_photo={post.user_photo}
                        file_name={post.file_name}
                        file_type={post.file_type}
                        likes={post.likes}
                        comments={post.comments}
                        content={post.content}
                        created_at={post.created_at}
                        isMute={isMute}
                        toggleMute={toggleMute}
                    />
                ) : (
                    <PhotoPost
                        key={post.post_id}
                        post_id={post.post_id}
                        user_id={post.user_id}
                        user_name={post.user_name}
                        user_photo={post.user_photo}
                        file_name={post.file_name}
                        file_type={post.file_type}
                        likes={post.likes}
                        comments={post.comments}
                        content={post.content}
                        created_at={post.created_at}
                    />
                )
            )}
        </div>
    );
};

export default PetSta;
