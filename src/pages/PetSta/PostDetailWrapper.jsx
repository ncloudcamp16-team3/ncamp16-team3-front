import React from "react";
import FollowProvider from "../../context/FollowContext.jsx";
import PostDetail from "./PostDetail.jsx";

const PostDetailWrapper = () => {
    return (
        <FollowProvider>
            <PostDetail />
        </FollowProvider>
    );
};

export default PostDetailWrapper;
