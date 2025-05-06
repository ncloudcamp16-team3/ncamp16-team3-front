import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Context } from "../../context/Context.jsx";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTheme } from "@mui/material/styles";
import Arrow from "../../assets/images/Global/left-arrow-brand.svg";
import { useNavigate } from "react-router-dom";
import DropdownPostBtns from "./DropdownPostBtns.jsx";

const PostTitleBar = ({ postData, setOpenDeleteModal, setOpenUpdateModal }) => {
    const { boardType, user } = useContext(Context);
    const [dropPostBtn, setDropPostBtn] = useState(false);
    const theme = useTheme();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropPostBtn && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropPostBtn(false); // 🔹 외부 클릭 시 닫기
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropPostBtn]);

    return (
        <Box
            sx={{
                position: "relative",
                alignItems: "center",
                width: "100%",
                height: "60px",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Box position="absolute" left={10} onClick={() => navigate("/board")} sx={{ cursor: "pointer" }}>
                <img src={Arrow} width="26px" height="26px" alt="back" />
            </Box>
            <Box>
                <Typography fontWeight="bold" fontSize="20px">
                    {boardType.name}
                </Typography>
            </Box>
            {user.id === postData.authorId && (
                <Box
                    ref={dropdownRef}
                    sx={{
                        position: "absolute",
                        right: "20px",
                    }}
                >
                    <MoreVertIcon
                        onClick={() => setDropPostBtn(!dropPostBtn)}
                        sx={{
                            cursor: "pointer",
                            color: theme.brand3,
                            fontSize: "28px",
                        }}
                    />
                    <DropdownPostBtns
                        dropPostBtn={dropPostBtn}
                        setDropPostBtn={setDropPostBtn}
                        setOpenDeleteModal={setOpenDeleteModal}
                        setOpenUpdateModal={setOpenUpdateModal}
                    />
                </Box>
            )}
        </Box>
    );
};

export default PostTitleBar;
