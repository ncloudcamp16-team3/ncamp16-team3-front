import React, { useState } from "react";
import { Popover, List, ListItem, ListItemText } from "@mui/material";

const TimetablePopover = ({ timetables, children: Children, openTimeRange, isOpened }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget); // 클릭한 요소를 기준으로 위치 설정
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "timetable-popover" : undefined;

    return (
        <>
            <Children onClick={handleClick} openTimeRange={openTimeRange} isOpened={isOpened} />

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                <List sx={{ p: 1, minWidth: 200 }}>
                    {timetables.map((t) => (
                        <ListItem key={t.day} sx={{ px: 1 }}>
                            <ListItemText primary={t.day} secondary={`${t.openTime} - ${t.closeTime}`} />
                        </ListItem>
                    ))}
                </List>
            </Popover>
        </>
    );
};

export default TimetablePopover;
