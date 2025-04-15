import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ImgSlide from "../../components/Board/ImgSlider.jsx";
import PostData from "../../mock/Board/postData.json";
import PostTitleBar from "../../components/Board/PostTitleBar.jsx";
import PostDeleteModal from "../../components/Board/PostDeleteModal.jsx";

const PostDetails = () => {
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [updateAble, setUpdateAble] = useState(false);

    useEffect(() => {
        alert("openDeleteModal=" + openDeleteModal);
        alert("updateAble=" + updateAble);
    }, [openDeleteModal, updateAble]);

    return (
        <Box>
            <PostTitleBar
                writer={PostData.user}
                setOpenDeleteModal={setOpenDeleteModal}
                setUpdateAble={setUpdateAble}
            />
            <Box
                sx={{
                    m: "0 10px 20px 10px",
                }}
            >
                <ImgSlide photos={PostData.photos} />
            </Box>
            <PostDeleteModal openDeleteModal={openDeleteModal} setOpenDeleteModal={setOpenDeleteModal} />
        </Box>
    );
};

export default PostDetails;
