import React, { useContext } from "react";
import { Box, Collapse } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DropdownBoardItem from "./DropdownBoardItem.jsx";
import BoardIcons from "../../constants/boardIcons.js";
import { Context } from "../../context/Context.jsx";

const DropdownBoard = ({ dropList, setDroplist }) => {
    const { boardTypeList } = useContext(Context);
    const theme = useTheme();

    return (
        <Box
            sx={{
                position: "absolute",
                top: "35px",
                pointerEvents: dropList ? "auto" : "none",
                zIndex: 1000,
            }}
        >
            <Collapse in={dropList} unmountOnExit>
                <Box
                    sx={{
                        bgcolor: theme.brand5,
                        borderRadius: 1,
                        p: "5px 10px",
                    }}
                >
                    {boardTypeList.map((boardType, index) => {
                        return (
                            <DropdownBoardItem
                                key={index}
                                icon={BoardIcons[index % BoardIcons.length]}
                                selectedBoardType={boardType}
                                setDroplist={setDroplist}
                            />
                        );
                    })}
                </Box>
            </Collapse>
        </Box>
    );
};

export default DropdownBoard;
