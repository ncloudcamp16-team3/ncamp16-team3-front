import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, InputBase, Typography } from "@mui/material";
import TitleBar from "../../components/Global/TitleBar.jsx";
import ImgSlide from "../../components/Board/ImgSlider.jsx";
import { getAnnounceDetail } from "../../services/announceService.js";
import Loading from "../../components/Global/Loading.jsx";

const Announce = () => {
    const { announceId } = useParams();
    const [loading, setLoading] = useState(true);
    const [announceData, setAnnounceData] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                const res = await getAnnounceDetail(announceId);
                setAnnounceData(res.data);
            } catch (err) {
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    return (
        <Box>
            <TitleBar name={"공지"} />
            {loading ? (
                <Loading />
            ) : (
                <Box
                    sx={{
                        m: "0 10px 20px 10px",
                    }}
                >
                    {announceData.photos.length > 0 && <ImgSlide photos={announceData.photos} />}
                    <Typography
                        sx={{
                            fontSize: "22px",
                            mb: "5px",
                        }}
                    >
                        제목
                    </Typography>
                    <InputBase
                        value={announceData.title}
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
                        value={announceData.content}
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
            )}
        </Box>
    );
};

export default Announce;
