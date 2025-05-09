import { useEffect, useRef, useState } from "react";
import { Box, Collapse, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTheme } from "@mui/material/styles";

const ReviewDropdown = ({ user, review, onUpdate, onDelete }) => {
    const theme = useTheme();
    const dropdownRef = useRef(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (user.id !== review.userId) return null;

    return (
        <Box ref={dropdownRef} sx={{ position: "relative", display: "inline-block", flex: "1 0 auto", mb: 4 }}>
            <MoreVertIcon
                onClick={() => setOpen((prev) => !prev)}
                sx={{
                    position: "absolute",
                    right: "10px",
                    cursor: "pointer",
                    color: theme.brand3,
                    fontSize: "28px",
                    borderRadius: 20,
                }}
            />
            <Collapse in={open} unmountOnExit>
                <Box
                    sx={{
                        position: "absolute",
                        top: "45px",
                        right: "10px",
                        bgcolor: theme.brand4,
                        borderRadius: 2,
                        zIndex: 1000,
                        p: "5px 0",
                    }}
                >
                    <Box
                        onClick={() => {
                            onUpdate(true);
                            setOpen(false);
                        }}
                        sx={{
                            cursor: "pointer",
                            color: "white",
                            px: 2,
                            py: 1,
                            "&:hover": { bgcolor: theme.brand3 },
                        }}
                    >
                        <Typography variant="body2">리뷰 수정하기</Typography>
                    </Box>
                    <Box
                        onClick={() => {
                            onDelete();
                            setOpen(false);
                        }}
                        sx={{
                            cursor: "pointer",
                            color: "white",
                            px: 2,
                            py: 1,
                            "&:hover": { bgcolor: theme.brand3 },
                        }}
                    >
                        <Typography variant="body2">리뷰 삭제하기</Typography>
                    </Box>
                </Box>
            </Collapse>
        </Box>
    );
};

export default ReviewDropdown;
