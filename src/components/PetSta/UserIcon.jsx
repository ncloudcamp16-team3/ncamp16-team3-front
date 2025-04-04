import React from "react";
import { Box } from "@mui/material";

const UserIcon = ({ userInfo }) => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="relative"
            width="46px"
            height="46px"
            borderRadius="50%"
        >
            <Box
                component="span"
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                borderRadius="50%"
                padding="3px"
                sx={{
                    background:
                        userInfo.is_view === "true"
                            ? "transparent"
                            : "linear-gradient(90deg, #C913B9 0%, #F9373F 50%, #FECD00 100%)",
                    WebkitMask: "linear-gradient(white, white) content-box, linear-gradient(white, white)",
                    WebkitMaskComposite: "destination-out",
                    maskComposite: "exclude",
                }}
            />
            <Box
                borderRadius="50%"
                border="2px solid transparent"
                overflow="hidden"
                width="42px"
                height="42px"
                flex="0 0 auto"
            >
                <Box
                    component="img"
                    src={`/mock/PetSta/images/${userInfo.user_photo}`} // 템플릿 리터럴 사용
                    alt="profile"
                    sx={{
                        minWidth: "100%",
                        userSelect: "none",
                        pointerEvents: "none",
                    }}
                />
            </Box>
        </Box>
    );
};

export default UserIcon;
