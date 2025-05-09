import { useEffect, useRef, useState } from "react";
import { Box, Collapse, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTheme } from "@mui/material/styles";

const ReviewDropdown = ({ user, review, onUpdate, onDelete }) => {
    const theme = useTheme();
    const dropdownRef = useRef(null);
    const [dropReviewBtn, setDropReviewBtn] = useState(false);

    // 수정 가능 상태 전달용 (예: 상위에서 onUpdate(true))
    const setUpdateAble = (flag) => {
        onUpdate(flag);
    };

    // 삭제 요청 핸들러
    const requestReviewDelete = () => {
        onDelete(); // 삭제 로직은 부모에서 처리
        setDropReviewBtn(false);
    };

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropReviewBtn(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const DropdownCommentBtns = () => (
        <Box
            sx={{
                position: "absolute",
                bgcolor: theme.brand4,
                borderRadius: 2,
                top: "45px",
                right: "10px",
                pointerEvents: dropReviewBtn ? "auto" : "none",
                zIndex: 1000,
            }}
        >
            <Collapse in={dropReviewBtn} unmountOnExit>
                <Box
                    onClick={() => {
                        setDropReviewBtn(false);
                        setUpdateAble(true);
                    }}
                    sx={{
                        cursor: "pointer",
                        color: "white",
                        p: "5px 10px",
                    }}
                >
                    <Typography sx={{ m: "5px 10px" }}>리뷰 수정하기</Typography>
                </Box>
                <Box
                    onClick={requestReviewDelete}
                    sx={{
                        cursor: "pointer",
                        color: "white",
                        p: "5px 10px",
                    }}
                >
                    <Typography sx={{ m: "0px 10px 5px 10px" }}>리뷰 삭제하기</Typography>
                </Box>
            </Collapse>
        </Box>
    );

    return (
        user?.id === review?.userId && (
            <Box ref={dropdownRef}>
                <MoreVertIcon
                    onClick={() => {
                        setDropReviewBtn((prev) => !prev);
                    }}
                    sx={{
                        position: "absolute",
                        right: "10px",
                        top: "10px",
                        cursor: "pointer",
                        color: theme.brand3,
                        fontSize: "28px",
                    }}
                />
                <DropdownCommentBtns />
            </Box>
        )
    );
};

export default ReviewDropdown;
