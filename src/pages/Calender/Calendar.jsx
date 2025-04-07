import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { format, parseISO } from "date-fns";
import "react-calendar/dist/Calendar.css";
import "/src/css/calendar/cal.css";
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
import { LocalizationProvider, MobileDateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
const { kakao } = window;

const Cal = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentViewMonth, setCurrentViewMonth] = useState(new Date()); // 현재 보이
    const [schedules, setSchedules] = useState([]);
    const [events, setEvents] = useState([]);
    const [reserves, setReserves] = useState([]);
    const [openItem, setOpenItem] = useState({ id: null, type: null });
    const [showForm, setShowForm] = useState(false);
    const [modifyForm, setModifyForm] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

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

    const handleModifyClick = (item) => {
        setSelectedItem(item);
        setFormData({
            title: item.title,
            address: item.address,
            content: item.content,
            start_date: dayjs(item.start_date),
            end_date: dayjs(item.end_date),
        });
        setModifyForm(true);
        setShowForm(false); // 일정추가 폼 숨기기
    };

    const saveModifiedSchedule = () => {
        // 이곳에 서버에 수정 요청 보내는 로직 추가
        console.log("수정할 데이터", formData);

        // 저장 후 초기화
        setModifyForm(false);
        setSelectedItem(null);
    };

    const addSchedule = () => {
        if (!formData.title.trim()) return alert("제목을 입력해주세요.");

        const newSchedule = {
            id: Date.now(),
            title: formData.title,
            content: formData.content,
            address: formData.address,
            start_date: format(formData.start_date.toDate(), "yyyy-MM-dd HH:mm:ss"),
            end_date: format(formData.end_date.toDate(), "yyyy-MM-dd HH:mm:ss"),
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

    const MapPreview = ({ latitude, longitude, mapId = "map-preview" }) => {
        useEffect(() => {
            if (!window.kakao || !latitude || !longitude) return;

            const container = document.getElementById(mapId);
            const options = {
                center: new kakao.maps.LatLng(latitude, longitude),
                level: 3,
            };

            const map = new kakao.maps.Map(container, options);

            new kakao.maps.Marker({
                map,
                position: options.center,
            });
        }, [latitude, longitude, mapId]);

        return <div id={mapId} style={{ width: "100%", height: "150px", borderRadius: "8px" }} />;
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
        if (!item) return null;

        const mapId = `map-${item.id || item.title || Math.random()}`;

        switch (type) {
            case "schedule":
                return (
                    <>
                        {item.address && (
                            <Box sx={{ mt: 1 }}>
                                <MapPreview latitude={item.latitude} longitude={item.longitude} mapId={mapId} />
                                <Typography sx={{ mt: 1 }}>
                                    <span style={{ color: "#A8A8A9" }}>장소 : </span>
                                    {item.address}
                                </Typography>
                            </Box>
                        )}

                        {item.start_date && (
                            <Typography sx={{ mt: 1 }}>
                                <span style={{ color: "#A8A8A9" }}>시작날짜 : </span>
                                {item.start_date}
                            </Typography>
                        )}
                        {item.end_date && (
                            <Typography sx={{ mt: 1 }}>
                                <span style={{ color: "#A8A8A9" }}>종료날짜 : </span>
                                {item.end_date}
                            </Typography>
                        )}
                        {item.content && (
                            <Typography sx={{ mt: 1 }}>
                                <span style={{ color: "#A8A8A9" }}>내용 : </span>
                                {item.content}
                            </Typography>
                        )}
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mx: 1, my: 1 }}>
                            <Button
                                sx={{ backgroundColor: "#FFA500", borderRadius: "50px", mr: 1 }}
                                onClick={() => handleModifyClick(item)}
                                variant="contained"
                            >
                                수정
                            </Button>
                            <Button
                                sx={{ backgroundColor: "#E9A260", borderRadius: "50px" }}
                                onClick={handleBack}
                                variant="contained"
                            >
                                확인
                            </Button>
                        </Box>
                    </>
                );
            case "event":
                return (
                    <>
                        {item.address && (
                            <Box sx={{ mt: 1 }}>
                                <MapPreview latitude={item.latitude} longitude={item.longitude} mapId={mapId} />
                                <Typography sx={{ mt: 1 }}>
                                    <span style={{ color: "#A8A8A9" }}>장소 : </span>
                                    {item.address}
                                </Typography>
                            </Box>
                        )}
                        {item.start_date && (
                            <Typography sx={{ mt: 1 }}>
                                <span style={{ color: "#A8A8A9" }}>시작날짜 : </span>
                                {item.start_date}
                            </Typography>
                        )}
                        {item.end_date && (
                            <Typography sx={{ mt: 1 }}>
                                <span style={{ color: "#A8A8A9" }}>종료날짜 : </span>
                                {item.end_date}
                            </Typography>
                        )}
                        {item.event_url && (
                            <Typography sx={{ mt: 0.5 }}>
                                <span style={{ color: "#A8A8A9" }}>링크 : </span>
                                <a
                                    href={item.event_url}
                                    style={{ color: "lightblue", textDecoration: "underline" }}
                                    target="_blank"
                                >
                                    {item.event_url}
                                </a>
                            </Typography>
                        )}
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mx: 1, my: 1 }}>
                            <Button
                                sx={{ backgroundColor: "#E9A260", borderRadius: "50px" }}
                                onClick={handleBack}
                                variant="contained"
                            >
                                확인
                            </Button>
                        </Box>
                    </>
                );
            case "reserve":
                return (
                    <>
                        {item.address && (
                            <Box sx={{ mt: 1 }}>
                                <MapPreview latitude={item.latitude} longitude={item.longitude} mapId={mapId} />
                                <Typography sx={{ mt: 1 }}>
                                    <span style={{ color: "#A8A8A9" }}>장소 : </span>
                                    {item.address}
                                </Typography>
                            </Box>
                        )}
                        {item.entry_time && (
                            <Typography sx={{ mt: 1 }}>
                                <span style={{ color: "#A8A8A9" }}>시작날짜 : </span>
                                {item.entry_time}
                            </Typography>
                        )}
                        {item.exit_time && (
                            <Typography sx={{ mt: 1 }}>
                                <span style={{ color: "#A8A8A9" }}>종료날짜 : </span>
                                {item.exit_time}
                            </Typography>
                        )}
                        {item.amount && (
                            <Typography sx={{ mt: 0.5 }}>
                                <span style={{ color: "#A8A8A9" }}>결제 금액 : </span>
                                {item.amount.toLocaleString()}원
                            </Typography>
                        )}
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mx: 1, my: 1 }}>
                            <Button
                                sx={{ backgroundColor: "#2F80ED", borderRadius: "50px", mr: 1 }}
                                onClick={handleBack}
                                variant="contained"
                            >
                                예약상세
                            </Button>
                            <Button
                                sx={{ backgroundColor: "#E9A260", borderRadius: "50px" }}
                                onClick={handleBack}
                                variant="contained"
                            >
                                확인
                            </Button>
                        </Box>
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
                sx={{ height: "350px", backgroundColor: "white", color: "white" }}
            >
                <Calendar
                    calendarType="gregory"
                    formatDay={(locale, date) => date.getDate()}
                    onChange={(date) => {
                        setSelectedDate(date);
                        setOpenItem({ id: null, type: null });
                    }}
                    value={selectedDate}
                    onActiveStartDateChange={({ activeStartDate }) => {
                        setCurrentViewMonth(activeStartDate); // 달력 넘길 때 기준 변경
                    }}
                    tileClassName={({ date, view }) => {
                        if (view === "month") {
                            const shownMonth = currentViewMonth.getMonth();
                            const shownYear = currentViewMonth.getFullYear();

                            const isSameMonth = date.getMonth() === shownMonth && date.getFullYear() === shownYear;

                            if (!isSameMonth) return "neighboring-month";

                            const day = date.getDay();
                            if (day === 0) return "sunday";
                            if (day === 6) return "saturday";
                        }
                        return null;
                    }}
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

            <Box sx={{ px: 2, py: 2 }}>
                {!showForm && !modifyForm && !selectedItem && (
                    <>
                        {selectedSchedules.length > 0 || selectedEvents.length > 0 || selectedReserves.length > 0 ? (
                            openItem.id ? (
                                <>
                                    {openItem.type === "schedule" &&
                                        selectedSchedules
                                            .filter((s) => s.id === openItem.id)
                                            .map((s) => renderCard(s, "schedule"))}
                                    {openItem.type === "event" &&
                                        selectedEvents
                                            .filter((e) => e.id === openItem.id)
                                            .map((e) => renderCard(e, "event"))}
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
                    </>
                )}

                {showForm && (
                    <>
                        <Card
                            sx={{
                                borderRadius: "32px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                position: "relative",
                                display: "flex",
                            }}
                        >
                            <Box
                                sx={{
                                    width: "40px",
                                    backgroundColor: "#EB5757",
                                }}
                            />

                            <Box sx={{ flex: 1, p: 2 }}>
                                <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>제목</InputLabel>
                                    <Input name="title" onChange={handleInputChange} />
                                </FormControl>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <FormHelperText>일정</FormHelperText>
                                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                                        <MobileDateTimePicker
                                            label="시작일"
                                            onChange={(newValue) => handleDateChange("start_date", newValue)}
                                            renderInput={(params) => <TextField {...params} fullWidth />}
                                        />
                                        <MobileDateTimePicker
                                            label="종료일"
                                            onChange={(newValue) => handleDateChange("end_date", newValue)}
                                            renderInput={(params) => <TextField {...params} fullWidth />}
                                        />
                                    </Box>
                                </LocalizationProvider>

                                <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>장소</InputLabel>
                                    <Input name="address" onChange={handleInputChange} />
                                </FormControl>

                                <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>내용</InputLabel>
                                    <Input name="content" onChange={handleInputChange} />
                                </FormControl>

                                <Box sx={{ display: "flex", justifyContent: "flex-end", mx: 2, my: 1 }}>
                                    <Button
                                        sx={{ backgroundColor: "#27AE60", borderRadius: "50px", mr: 1 }}
                                        onClick={addSchedule}
                                        variant="contained"
                                    >
                                        저장
                                    </Button>
                                    <Button
                                        sx={{ backgroundColor: "#D9D9D9", borderRadius: "50px" }}
                                        onClick={() => setShowForm(false)}
                                        variant="contained"
                                    >
                                        취소
                                    </Button>
                                </Box>
                            </Box>
                        </Card>
                    </>
                )}

                {modifyForm && selectedItem && (
                    <>
                        <Card
                            sx={{
                                borderRadius: "32px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                position: "relative",
                                display: "flex",
                            }}
                        >
                            <Box sx={{ width: "40px", backgroundColor: "#EB5757" }} />

                            <Box sx={{ flex: 1, p: 2 }}>
                                <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>제목</InputLabel>
                                    <Input name="title" value={formData.title} onChange={handleInputChange} />
                                </FormControl>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <FormHelperText>일정</FormHelperText>
                                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                                        <MobileDateTimePicker
                                            label="시작일"
                                            value={formData.start_date}
                                            onChange={(newValue) => handleDateChange("start_date", newValue)}
                                            renderInput={(params) => <TextField {...params} fullWidth />}
                                        />
                                        <MobileDateTimePicker
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

                                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                    <Button
                                        sx={{ backgroundColor: "#FFA500", borderRadius: "50px" }}
                                        onClick={saveModifiedSchedule}
                                        variant="contained"
                                    >
                                        수정
                                    </Button>
                                    <Button
                                        sx={{ backgroundColor: "#EB5757", borderRadius: "50px" }}
                                        onClick={() => {
                                            setModifyForm(false);
                                            setSelectedItem(null);
                                        }}
                                        variant="contained"
                                    >
                                        삭제
                                    </Button>
                                    <Button
                                        sx={{ backgroundColor: "#D9D9D9", borderRadius: "50px" }}
                                        onClick={() => {
                                            setModifyForm(false);
                                            setSelectedItem(null);
                                        }}
                                        variant="contained"
                                    >
                                        취소
                                    </Button>
                                </Box>
                            </Box>
                        </Card>
                    </>
                )}
                {!showForm && !modifyForm && !selectedItem && !openItem?.id && (
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mx: 2, my: 1 }}>
                        <Button
                            sx={{ backgroundColor: "#E9A260", borderRadius: "50px" }}
                            onClick={() => setShowForm(true)}
                            variant="contained"
                        >
                            일정추가
                        </Button>
                    </Box>
                )}
            </Box>
        </div>
    );
};

export default Cal;
