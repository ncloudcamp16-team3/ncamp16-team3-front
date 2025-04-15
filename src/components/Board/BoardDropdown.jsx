import React from "react";
import { Box, Collapse } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import BoardDropdownItem from "./BoardDropdownItem.jsx";
import BoardTypeList from "../../mock/Board/boardTypeList.json";
import BoardIcons from "../../constants/boardIcons.js";

const BoardDropdown = ({ dropList, setDroplist }) => {
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
                    {BoardTypeList.map((boardType, index) => {
                        return (
                            <BoardDropdownItem
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

export default BoardDropdown;
