import React, { useContext } from "react";
import { Box, Typography } from "@mui/material";
import { Context } from "../../context/Context.jsx";

const BoardDropdownItem = ({ icon, selectedBoardType, setDroplist }) => {
    const { setBoardType } = useContext(Context);

    const setBoardAndSetDrop = () => {
        setBoardType(selectedBoardType);
        setDroplist(false);
    };

    return (
        <Box
            onClick={setBoardAndSetDrop}
            sx={{
                m: "5px 0",
            }}
        >
            <Box
                component="img"
                src={icon}
                sx={{
                    verticalAlign: "middle",
                    mr: "5px",
                    display: "inline",
                }}
            />
            <Typography
                sx={{
                    display: "inline",
                    verticalAlign: "middle",
                }}
            >
                {selectedBoardType.name}
            </Typography>
        </Box>
    );
};

export default BoardDropdownItem;
