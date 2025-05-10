import React from "react";
import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import StarIcon from "@mui/icons-material/Star";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HistoryIcon from "@mui/icons-material/History";

const ReviewFilter = ({ sortBy, onSortChange, hasFilterOptions = false }) => {
    // 정렬 옵션 변경 핸들러
    const handleChange = (event, newSortBy) => {
        if (newSortBy !== null) {
            onSortChange(newSortBy);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: "8px 16px",
                backgroundColor: "#f5f7f9",
                borderRadius: "8px",
                marginBottom: "12px",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <FilterListIcon sx={{ fontSize: 20, color: "text.secondary", mr: 1 }} />
            </Box>

            <ToggleButtonGroup value={sortBy} exclusive onChange={handleChange} size="small">
                <ToggleButton value="newest" aria-label="최신순">
                    <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">최신순</Typography>
                </ToggleButton>
                <ToggleButton value="oldest" aria-label="오래된순">
                    <HistoryIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">오래된순</Typography>
                </ToggleButton>
                <ToggleButton value="highest" aria-label="평점높은순">
                    <StarIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <ArrowUpwardIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption">평점높은순</Typography>
                </ToggleButton>
                <ToggleButton value="lowest" aria-label="평점낮은순">
                    <StarIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption">평점낮은순</Typography>
                </ToggleButton>
                {hasFilterOptions && (
                    <ToggleButton value="reviewOnly" aria-label="리뷰만">
                        <Typography variant="caption">리뷰만</Typography>
                    </ToggleButton>
                )}
            </ToggleButtonGroup>
        </Box>
    );
};

export default ReviewFilter;
