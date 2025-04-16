import React from "react";
import { useTheme } from "@mui/material/styles";
import { Button } from "@mui/material";

const UpdateBtn = ({ postTitle, postContent, postId, postPhotos }) => {
    const theme = useTheme();

    const requestPostUpdate = () => {
        alert(postId + "번 게시물" + "\n제목=" + postTitle + "\n내용=" + postContent + "\n으로 수정요청");
        window.location.reload();
    };

    return (
        <Button
            onClick={requestPostUpdate}
            sx={{
                position: "fixed",
                bottom: "85px",
                left: "10px",
                right: "10px",
                height: "50px",
                maxWidth: "480px",
                backgroundColor: theme.brand3,
                borderRadius: "10px",
                color: "white",
                zIndex: 1000,
                margin: "0 auto",
                alignItems: "center",
                fontSize: "20px",
                "&:hover": {
                    backgroundColor: "#d88e4f",
                    boxShadow: "none",
                },
            }}
        >
            수정하기
        </Button>
    );
};

export default UpdateBtn;
