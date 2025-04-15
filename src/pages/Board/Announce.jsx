import React from "react";
import { useParams } from "react-router-dom";
import { Box, InputBase, Typography } from "@mui/material";
import TitleBar from "../../components/Global/TitleBar.jsx";
import AnnounceData from "../../mock/Board/announceData.json";
import ImgSlide from "../../components/Board/ImgSlider.jsx";

const Announce = () => {
    const { announceId } = useParams();

    return (
        <Box>
            <TitleBar name={"공지"} />
            <Box
                sx={{
                    m: "0 10px 20px 10px",
                }}
            >
                <ImgSlide photos={AnnounceData.photos} />
                <Typography
                    sx={{
                        fontSize: "22px",
                        mb: "5px",
                    }}
                >
                    제목
                </Typography>
                <InputBase
                    value={AnnounceData.title}
                    readOnly
                    sx={{
                        width: "100%",
                        px: "10px",
                        fontSize: "18px",
                        border: "1px solid rgba(0, 0, 0, 0.3)",
                        borderRadius: "10px",
                        mb: "20px",
                    }}
                />
                <Typography
                    sx={{
                        fontSize: "22px",
                        mb: "5px",
                    }}
                >
                    내용
                </Typography>
                <InputBase
                    value={AnnounceData.content}
                    multiline
                    fullWidth
                    readOnly
                    minRows={3}
                    maxRows={Infinity}
                    sx={{
                        width: "100%",
                        px: "15px",
                        py: "10px",
                        border: "1px solid rgba(0, 0, 0, 0.3)",
                        borderRadius: "10px",
                        fontSize: "16px",
                        lineHeight: 1.5,
                        overflow: "hidden",
                        resize: "none",
                    }}
                />
            </Box>
        </Box>
    );
};

export default Announce;
