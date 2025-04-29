import React, { useContext } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { CalendarContext } from "./CalendarContext.jsx";
import RenderMapAddress from "./RenderMapAddress.jsx";
import RenderButtonGroup from "./RenderButtonGroup.jsx";

const RenderCard = ({ item, type }) => {
    const { openItem, getTypeColor, handleToggle, getTitle, getPeriod, handleBack, handleModifyClick } =
        useContext(CalendarContext);
    const isOpen = openItem.id === item.id && openItem.type === type;

    const renderDateField = (label, value) => {
        return (
            value && (
                <Typography sx={{ mt: 1 }}>
                    <span style={{ color: "#A8A8A9" }}>{label} : </span>
                    {value}
                </Typography>
            )
        );
    };

    const renderDetails = (item, type) => {
        if (!item) return null;

        switch (type) {
            case "schedule":
                return (
                    <>
                        <RenderMapAddress item={item} />
                        {item.content && renderDateField("내용", item.content)}
                        <RenderButtonGroup
                            buttons={[
                                { label: "수정", color: "#FFA500", onClick: () => handleModifyClick(item) },
                                { label: "확인", color: "#E9A260", onClick: handleBack },
                            ]}
                        />
                    </>
                );
            case "event":
                return (
                    <>
                        <RenderMapAddress item={item} />
                        {item.eventUrl && (
                            <Typography sx={{ mt: 0.5 }}>
                                <span style={{ color: "#A8A8A9" }}>링크 : </span>
                                <a
                                    href={item.eventUrl}
                                    style={{ color: "lightblue", textDecoration: "underline" }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {item.eventUrl}
                                </a>
                            </Typography>
                        )}
                        <RenderButtonGroup buttons={[{ label: "확인", color: "#E9A260", onClick: handleBack }]} />
                    </>
                );
            case "reserve":
                return (
                    <>
                        <RenderMapAddress item={item} />
                        {item.amount && renderDateField("결제 금액", `${item.amount.toLocaleString()}원`)}
                        <RenderButtonGroup
                            buttons={[
                                { label: "예약상세", color: "#2F80ED", onClick: handleBack },
                                { label: "확인", color: "#E9A260", onClick: handleBack },
                            ]}
                        />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Card
            key={`${type}-${item.id}`}
            sx={{
                mb: 2,
                borderRadius: "32px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                position: "relative",
                display: "flex",
            }}
        >
            <Box
                sx={{
                    width: "40px",
                    minWidth: "40px",
                    maxWidth: "40px",
                    flexShrink: 0,
                    backgroundColor: getTypeColor(type),
                    borderTopLeftRadius: "12px",
                    borderBottomLeftRadius: "12px",
                }}
            />
            <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    p: 2.5,
                    "&:last-child": { paddingBottom: 2.5 },
                    flexGrow: 1,
                }}
            >
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ cursor: "pointer", fontWeight: "bold" }}
                    onClick={() => handleToggle(item.id, type)}
                >
                    {getTitle(item, type)}
                </Typography>
                <Typography sx={{ color: "#A8A8A9", textAlign: "right" }}>{getPeriod(item, type)}</Typography>
                {isOpen && renderDetails(item, type)}
            </CardContent>
        </Card>
    );
};
export default RenderCard;
