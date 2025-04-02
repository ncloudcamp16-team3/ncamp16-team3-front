import React from "react";

const Post = () => {
    return (
        <div>
            <video
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    transform: "scale(0.999)",
                }}
            >
                <source
                    src={`./mock/PetSta/videos/${file_name}`}
                    type="video/mp4"
                />
            </video>
        </div>
    );
};

export default Post;
