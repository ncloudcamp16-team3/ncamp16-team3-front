import React from "react";
import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
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
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                padding: "8px 8px",
                backgroundColor: "#f5f7f9",
                borderRadius: "8px",
                marginBottom: "12px",
            }}
        >
            <ToggleButtonGroup
                value={sortBy}
                exclusive
                fullWidth
                onChange={handleChange}
                size="small"
                sx={{
                    flexWrap: "nowrap",
                    overflowX: "auto",
                }}
            >
                <ToggleButton
                    value="newest"
                    aria-label="최신순"
                    sx={{
                        minWidth: 0,
                        whiteSpace: "nowrap",
                        padding: "4px 8px",
                        justifyContent: "center",
                        flexDirection: "row",
                        gap: "4px",
                    }}
                >
                    <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption" noWrap>
                        최신순
                    </Typography>
                </ToggleButton>
                <ToggleButton
                    value="oldest"
                    aria-label="오래된순"
                    sx={{
                        minWidth: 0,
                        whiteSpace: "nowrap",
                        padding: "4px 8px",
                        justifyContent: "center",
                        flexDirection: "row",
                        gap: "4px",
                    }}
                >
                    <HistoryIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption" noWrap>
                        오래된순
                    </Typography>
                </ToggleButton>
                <ToggleButton
                    value="highest"
                    aria-label="평점높은순"
                    sx={{
                        minWidth: 0,
                        whiteSpace: "nowrap",
                        padding: "4px 8px",
                        justifyContent: "center",
                        flexDirection: "row",
                        gap: "4px",
                    }}
                >
                    <ArrowUpwardIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption" noWrap>
                        평점높은순
                    </Typography>
                </ToggleButton>
                <ToggleButton
                    value="lowest"
                    aria-label="평점낮은순"
                    sx={{
                        minWidth: 0,
                        whiteSpace: "nowrap",
                        padding: "4px 8px",
                        justifyContent: "center",
                        flexDirection: "row",
                        gap: "4px",
                    }}
                >
                    <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption" noWrap>
                        평점낮은순
                    </Typography>
                </ToggleButton>
                {hasFilterOptions && (
                    <ToggleButton
                        value="reviewOnly"
                        aria-label="리뷰만"
                        sx={{
                            minWidth: 0,
                            whiteSpace: "nowrap",
                            padding: "4px 8px",
                            justifyContent: "center",
                            flexDirection: "row",
                            gap: "4px",
                        }}
                    >
                        <Typography variant="caption" noWrap>
                            리뷰만
                        </Typography>
                    </ToggleButton>
                )}
            </ToggleButtonGroup>
        </Box>
    );
};

export default ReviewFilter;
