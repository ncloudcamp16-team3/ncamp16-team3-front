import React from "react";
import "../../css/App.css";
import icon from "../../assets/images/icon1.svg";
import notification from "../../assets/images/Notification2.svg";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

const Header = () => {
    const navigate = useNavigate();
    return (
        <Box
            component="div"
            className="header"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
        >
            <Box
                sx={{
                    borderRadius: "50%",
                    border: "1px solid #D1D5DB",
                    overflow: "hidden",
                    width: "40px",
                    height: "40px",
                }}
            >
                <Box
                    component="img"
                    src={"./mock/Global/images/haribo.jpg"}
                    alt="profile"
                    sx={{
                        maxWidth: "100%",
                    }}
                />
            </Box>
            <Box display="flex" alignItems="center">
                <Box
                    component="img"
                    src={icon}
                    alt="아이콘"
                    sx={{
                        objectFit: "contain",
                    }}
                />
                <Box
                    component="span"
                    sx={{
                        ml: 0.5,
                        whiteSpace: "nowrap",
                        fontWeight: "bold",
                    }}
                >
                    꼬리친구들
                </Box>
            </Box>
            <div onClick={() => navigate("/notification")}>
                <Box
                    component="img"
                    src={notification}
                    alt="종"
                    sx={{
                        objectFit: "contain",
                        width: "40px",
                        height: "40px",
                    }}
                />
            </div>
        </Box>
    );
};

export default Header;
