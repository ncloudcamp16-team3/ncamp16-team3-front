import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { format, parseISO } from "date-fns";
import "react-calendar/dist/Calendar.css";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Input,
    FormHelperText,
    TextField,
} from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const Cal = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [schedules, setSchedules] = useState([]);
    const [events, setEvents] = useState([]);
    const [reserves, setReserves] = useState([]);
    const [openItem, setOpenItem] = useState({ id: null, type: null });
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        address: "",
        start_date: dayjs(selectedDate),
        end_date: dayjs(selectedDate),
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const addSchedule = () => {
        if (!formData.title.trim()) return alert("제목을 입력해주세요.");

        const newSchedule = {
            id: Date.now(),
            title: formData.title,
            content: formData.content,
            address: formData.address,
            start_date: format(formData.start_date.toDate(), "yyyy-MM-dd"),
            end_date: format(formData.end_date.toDate(), "yyyy-MM-dd"),
        };

        setSchedules((prev) => [...prev, newSchedule]);
        setShowForm(false);
        setFormData({
            title: "",
            content: "",
            address: "",
            start_date: dayjs(selectedDate),
            end_date: dayjs(selectedDate),
        });
    };

    useEffect(() => {
        fetch("src/mock/Calendar/calender_schedules.json")
            .then((res) => res.json())
            .then(setSchedules)
            .catch((err) => console.error("Error loading schedules:", err));

        fetch("src/mock/Calendar/event.json")
            .then((res) => res.json())
            .then(setEvents)
            .catch((err) => console.error("Error loading events:", err));

        fetch("src/mock/Calendar/reserves.json")
            .then((res) => res.json())
            .then(setReserves)
            .catch((err) => console.error("Error loading reserves:", err));
    }, []);

    const handleToggle = (id, type) => {
        setOpenItem((prev) => (prev.id === id && prev.type === type ? { id: null, type: null } : { id, type }));
    };

    const handleBack = () => setOpenItem({ id: null, type: null });

    const isSameDate = (date1, date2) => format(date1, "yyyy-MM-dd") === format(date2, "yyyy-MM-dd");

    const selectedSchedules = schedules.filter((s) => isSameDate(parseISO(s.start_date), selectedDate));
    const selectedEvents = events.filter((e) => isSameDate(parseISO(e.start_date), selectedDate));
    const selectedReserves = reserves.filter((r) => isSameDate(parseISO(r.entry_time), selectedDate));

    const checkHasScheduleOrEvent = (date) => {
        const hasSchedule = schedules.some((s) => isSameDate(parseISO(s.start_date), date));
        const hasEvent = events.some((e) => isSameDate(parseISO(e.start_date), date));
        const hasReserve = reserves.some((r) => isSameDate(parseISO(r.entry_time), date));
        return { hasSchedule, hasEvent, hasReserve };
    };

    const renderDetails = (item, type) => {
        switch (type) {
            case "schedule":
                return (
                    <>
                        {item.content && <Typography sx={{ mt: 1 }}>{item.content}</Typography>}
                        {item.address && <Typography sx={{ mt: 0.5 }}>📍 {item.address}</Typography>}
                    </>
                );
            case "event":
                return (
                    <Typography sx={{ mt: 0.5, color: "lightblue", fontWeight: "bold" }}>{item.event_url}</Typography>
                );
            case "reserve":
                return (
                    <>
                        {item.address && <Typography sx={{ mt: 0.5 }}>📍 {item.address}</Typography>}
                        {item.amount && <Typography sx={{ mt: 0.5 }}>{item.amount.toLocaleString()}원</Typography>}
                    </>
                );
            default:
                return null;
        }
    };

    const renderCard = (item, type) => {
        const isOpen = openItem.id === item.id && openItem.type === type;
        const colors = {
            schedule: "#EB5757",
            event: "#2F80ED",
            reserve: "#27AE60",
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
                        backgroundColor: colors[type],
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
                        {type === "reserve" ? item.facility_name : item.title}
                    </Typography>
                    <Typography sx={{ color: "#A8A8A9", textAlign: "right" }}>
                        {type === "reserve"
                            ? `${item.entry_time} ~ ${item.exit_time}`
                            : `${item.start_date} ~ ${item.end_date}`}
                    </Typography>
                    {isOpen && renderDetails(item, type)}
                </CardContent>
            </Card>
        );
    };

    return (
        <div style={{ backgroundColor: "#F2DFCE", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                textAlign="center"
                sx={{ height: "330px", backgroundColor: "white", color: "white" }}
            >
                <Calendar
                    calendarType="gregory"
                    formatDay={(locale, date) => date.getDate()}
                    onChange={(date) => {
                        setSelectedDate(date);
                        setOpenItem({ id: null, type: null });
                    }}
                    value={selectedDate}
                    tileContent={({ date }) => {
                        const { hasSchedule, hasEvent, hasReserve } = checkHasScheduleOrEvent(date);
                        return (
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0.5 }}>
                                {hasSchedule && (
                                    <Box
                                        sx={{ width: 6, height: 6, backgroundColor: "#EB5757", borderRadius: "50%" }}
                                    />
                                )}
                                {hasEvent && (
                                    <Box
                                        sx={{ width: 6, height: 6, backgroundColor: "#2F80ED", borderRadius: "50%" }}
                                    />
                                )}
                                {hasReserve && (
                                    <Box
                                        sx={{ width: 6, height: 6, backgroundColor: "#27AE60", borderRadius: "50%" }}
                                    />
                                )}
                            </Box>
                        );
                    }}
                />
            </Box>

            <Box sx={{ px: 2 }}>
                <h2>{format(selectedDate, "yyyy년 MM월 dd일")} 일정 & 이벤트</h2>

                {showForm ? (
                    <Box sx={{ px: 2, py: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: 1, mb: 2 }}>
                        <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                            <InputLabel>제목</InputLabel>
                            <Input name="title" value={formData.title} onChange={handleInputChange} />
                        </FormControl>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <FormHelperText>일정</FormHelperText>
                            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                                <MobileDatePicker
                                    label="시작일"
                                    value={formData.start_date}
                                    onChange={(newValue) => handleDateChange("start_date", newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                                <MobileDatePicker
                                    label="종료일"
                                    value={formData.end_date}
                                    onChange={(newValue) => handleDateChange("end_date", newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Box>
                        </LocalizationProvider>

                        <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                            <InputLabel>장소</InputLabel>
                            <Input name="address" value={formData.address} onChange={handleInputChange} />
                        </FormControl>

                        <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                            <InputLabel>내용</InputLabel>
                            <Input name="content" value={formData.content} onChange={handleInputChange} />
                        </FormControl>

                        <Box display="flex" gap={1}>
                            <Button variant="contained" color="primary" onClick={addSchedule}>
                                저장
                            </Button>
                            <Button variant="outlined" onClick={() => setShowForm(false)}>
                                취소
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Button onClick={() => setShowForm(true)} variant="contained" sx={{ mx: 2, my: 1 }}>
                        일정추가
                    </Button>
                )}

                {selectedSchedules.length > 0 || selectedEvents.length > 0 || selectedReserves.length > 0 ? (
                    openItem.id ? (
                        <>
                            <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
                                이전으로
                            </Button>

                            {openItem.type === "schedule" &&
                                selectedSchedules
                                    .filter((s) => s.id === openItem.id)
                                    .map((s) => renderCard(s, "schedule"))}
                            {openItem.type === "event" &&
                                selectedEvents.filter((e) => e.id === openItem.id).map((e) => renderCard(e, "event"))}
                            {openItem.type === "reserve" &&
                                selectedReserves
                                    .filter((r) => r.id === openItem.id)
                                    .map((r) => renderCard(r, "reserve"))}
                        </>
                    ) : (
                        <>
                            {selectedSchedules.map((s) => renderCard(s, "schedule"))}
                            {selectedEvents.map((e) => renderCard(e, "event"))}
                            {selectedReserves.map((r) => renderCard(r, "reserve"))}
                        </>
                    )
                ) : (
                    <Typography>해당 날짜에 일정이나 이벤트가 없습니다.</Typography>
                )}
            </Box>
        </div>
    );
};

export default Cal;
