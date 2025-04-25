import React, { useContext, useEffect, useState } from "react";
import Calendar from "react-calendar";
import { format, parseISO } from "date-fns";
import "react-calendar/dist/Calendar.css";
import "/src/css/calendar/cal.css";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import dayjs from "dayjs";
import TitleBar from "../../components/Global/TitleBar.jsx";
import ScheduleFormCard from "../../components/Calender/ScheduleFormCard.jsx";
import {
    deleteSchedule,
    getScheduleAll,
    postSchedule,
    putSchedule,
    getEventAll,
} from "../../services/calendarService.js";
import { Context } from "../../context/Context.jsx";
const { kakao } = window;

const CalendarRendering = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentViewMonth, setCurrentViewMonth] = useState(new Date());
    const [schedules, setSchedules] = useState([]);
    const [events, setEvents] = useState([]);
    const [reserves, setReserves] = useState([]);
    const [openItem, setOpenItem] = useState({ id: null, type: null });
    const [showForm, setShowForm] = useState(false);
    const [modifyForm, setModifyForm] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);

    const { user } = useContext(Context);

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        address: "",
        startDate: dayjs(selectedDate),
        endDate: dayjs(selectedDate),
        latitude: "",
        longitude: "",
    });

    const [address, setAddress] = useState("");

    // 2. 주소 상태가 바뀔 때 formData.address도 업데이트
    useEffect(() => {
        setFormData((prev) => ({ ...prev, address }));
    }, [address]);

    useEffect(() => {
        if (showForm) {
            setAddress(""); // 주소 문자열 초기화 (사용 중이라면 유지)
            setFormData({
                id: "",
                userId: "",
                title: "",
                startDate: null,
                endDate: null,
                address: "",
                content: "",
                latitude: "",
                longitude: "",
                dateList: [],
            });
        }
    }, [showForm]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching schedules..."); // 디버깅: 스케줄 데이터 로딩 시작
                // fetch를 이용한 스케줄 데이터 가져오기
                const schedulesData = await getScheduleAll(user.id);
                console.log("Schedules data fetched:", schedulesData); // 디버깅: 스케줄 데이터 확인
                setSchedules(schedulesData);

                console.log("Fetching events..."); // 디버깅: 이벤트 데이터 로딩 시작
                // fetch로 이벤트 데이터 가져오기
                const eventData = await getEventAll();
                console.log("Events data fetched:", eventData); // 디버깅: 이벤트 데이터 확인
                setEvents(eventData);

                console.log("Fetching reserves..."); // 디버깅: 예약 데이터 로딩 시작
                // fetch로 예약 데이터 가져오기
                const reserveData = await fetch("src/mock/Calendar/reserves.json").then((res) => res.json());
                console.log("Reserves data fetched:", reserveData); // 디버깅: 예약 데이터 확인
                setReserves(reserveData);
            } catch (err) {
                console.error("데이터 로딩 실패:", err); // 에러 로깅
            } finally {
                setLoading(false); // 데이터 로딩 완료 후 상태 변경
                console.log("Loading finished.");
            }
        };

        fetchData(); // 비동기 함수 호출
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "address") setAddress(value);
        else setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleModifyClick = (item) => {
        setSelectedItem(item);
        setFormData({
            id: item.id,
            userId: item.userId,
            title: item.title,
            address: item.address,
            content: item.content,
            startDate: dayjs(item.startDate),
            endDate: dayjs(item.endDate),
            latitude: item.latitude || "", // 좌표가 없을 경우 빈 문자열로 처리
            longitude: item.longitude || "",
        });
        setModifyForm(true);
        setShowForm(false);
    };

    const saveModifiedSchedule = async () => {
        try {
            const startDate = dayjs(formData.startDate);
            const endDate = dayjs(formData.endDate);

            console.log("Start Date:", formData.startDate);
            console.log("End Date:", formData.endDate);

            console.log("수정할 데이터", formData);

            const scheduleData = {
                id: formData.id,
                userId: formData.userId,
                title: formData.title,
                content: formData.content,
                address: formData.address,
                latitude: formData.latitude || null,
                longitude: formData.longitude || null,
                startDate: startDate.format("YYYY-MM-DD HH:mm:ss"),
                endDate: endDate.format("YYYY-MM-DD HH:mm:ss"),
            };

            const modifySchedule = await putSchedule(scheduleData);
            setSchedules((prev) => [...prev, modifySchedule]);
            setModifyForm(false);
            setSelectedItem(null);
        } catch (error) {
            alert("일정 수정에 실패했습니다.");
            console.error("일정 수정 에러:", error);
        }
    };
    const removeSchedule = async () => {
        try {
            // 삭제 요청
            await deleteSchedule({ id: formData.id });

            // 삭제된 항목을 제외한 새로운 리스트로 갱신
            setSchedules((prev) => prev.filter((schedule) => schedule.id !== formData.id));

            // 수정 폼 및 선택 항목 초기화
            setModifyForm(false);
            setSelectedItem(null);
        } catch (error) {
            alert("일정 삭제에 실패했습니다.");
            console.error("일정 삭제 에러:", error);
        }
    };

    const addSchedule = async () => {
        try {
            const scheduleData = {
                userId: user.id,
                title: formData.title,
                content: formData.content,
                address: formData.address,
                latitude: formData.latitude || null,
                longitude: formData.longitude || null,
                startDate: dayjs(formData.startDate).format("YYYY-MM-DD HH:mm:ss"),
                endDate: dayjs(formData.endDate).format("YYYY-MM-DD HH:mm:ss"),
            };

            const createdSchedule = await postSchedule(scheduleData);

            setSchedules((prev) => [...prev, createdSchedule]);
            setShowForm(false);
            setFormData({
                userId: "",
                title: "",
                content: "",
                address: "",
                latitude: "",
                longitude: "",
                startDate: dayjs(selectedDate),
                endDate: dayjs(selectedDate),
            });
            alert("일정이 성공적으로 등록되었습니다!");
        } catch (error) {
            alert("일정 등록에 실패했습니다.");
            console.error("일정 등록 에러:", error);
        }
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

            new kakao.maps.Marker({ map, position: options.center });
        }, [latitude, longitude, mapId]);

        return <div id={mapId} style={{ width: "100%", height: "150px", borderRadius: "8px" }} />;
    };

    const handleToggle = (id, type) => {
        console.log("startDate", formData.startDate);
        console.log("endDate", formData.endDate);
        setOpenItem((prev) => (prev.id === id && prev.type === type ? { id: null, type: null } : { id, type }));
    };

    const handleBack = () => setOpenItem({ id: null, type: null });

    const isSameDate = (date1, date2) => format(date1, "yyyy-MM-dd") === format(date2, "yyyy-MM-dd");

    const selectedSchedules = schedules.filter((s) => s.dateList?.includes(format(selectedDate, "yyyy-MM-dd")));
    const selectedEvents = events.filter((e) => isSameDate(parseISO(e.startDate), selectedDate));
    const selectedReserves = reserves.filter((r) => isSameDate(parseISO(r.entry_time), selectedDate));

    const checkHasScheduleOrEvent = (date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        return {
            hasSchedule: schedules.some((s) => s.dateList?.includes(dateStr)),
            hasEvent: events.some((e) => isSameDate(parseISO(e.startDate), date)),
            hasReserve: reserves.some((r) => isSameDate(parseISO(r.entry_time), date)),
        };
    };

    const renderDetails = (item, type) => {
        if (!item) return null;

        const mapId = `map-${item.id || item.title || Math.random()}`;

        const renderMapAndAddress = () =>
            item.address && (
                <Box sx={{ mt: 1 }}>
                    <MapPreview latitude={item.latitude} longitude={item.longitude} mapId={mapId} />
                    <Typography sx={{ mt: 1 }}>
                        <span style={{ color: "#A8A8A9" }}>장소 : </span>
                        {item.address}
                    </Typography>
                </Box>
            );

        const renderDateField = (label, value) =>
            value && (
                <Typography sx={{ mt: 1 }}>
                    <span style={{ color: "#A8A8A9" }}>{label} : </span>
                    {value}
                </Typography>
            );

        const renderButtonGroup = (buttons) => (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mx: 1, my: 1 }}>
                {buttons.map(({ label, color, onClick }, index) => (
                    <Button
                        key={index}
                        sx={{ backgroundColor: color, borderRadius: "50px", ml: index > 0 ? 1 : 0 }}
                        onClick={onClick}
                        variant="contained"
                    >
                        {label}
                    </Button>
                ))}
            </Box>
        );

        switch (type) {
            case "schedule":
                return (
                    <>
                        {renderMapAndAddress()}
                        {item.content && renderDateField("내용", item.content)}
                        {renderButtonGroup([
                            { label: "수정", color: "#FFA500", onClick: () => handleModifyClick(item) },
                            { label: "확인", color: "#E9A260", onClick: handleBack },
                        ])}
                    </>
                );
            case "event":
                return (
                    <>
                        {renderMapAndAddress()}
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
                        {renderButtonGroup([{ label: "확인", color: "#E9A260", onClick: handleBack }])}
                    </>
                );
            case "reserve":
                return (
                    <>
                        {renderMapAndAddress()}
                        {item.amount && renderDateField("결제 금액", `${item.amount.toLocaleString()}원`)}
                        {renderButtonGroup([
                            { label: "예약상세", color: "#2F80ED", onClick: handleBack },
                            { label: "확인", color: "#E9A260", onClick: handleBack },
                        ])}
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

        const getTitle = () => (type === "reserve" ? item.facility_name : item.title);
        const getPeriod = () => {
            if (type === "reserve") {
                return (
                    <>
                        {format(parseISO(item.entry_time), "yy-MM-dd hh:mm")}~{" "}
                        {format(parseISO(item.exit_time), "yy-MM-dd hh:mm")}
                    </>
                );
            }
            return (
                <>
                    {format(parseISO(item.startDate), "yy-MM-dd hh:mm")}~{" "}
                    {format(parseISO(item.endDate), "yy-MM-dd hh:mm")}
                </>
            );
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
                        {getTitle()}
                    </Typography>
                    <Typography sx={{ color: "#A8A8A9", textAlign: "right" }}>{getPeriod()}</Typography>
                    {isOpen && renderDetails(item, type)}
                </CardContent>
            </Card>
        );
    };

    return (
        <div style={{ backgroundColor: "#F2DFCE", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <div style={{ backgroundColor: "white", borderBottom: "1px #ccc solid" }}>
                <TitleBar name="캘린더" />
            </div>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                textAlign="center"
                sx={{ height: "390px", backgroundColor: "white", color: "white" }}
            >
                <Calendar
                    prev2Label={null}
                    next2Label={null}
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
                            <Box
                                sx={{
                                    position: "relative",
                                    textAlign: "center",
                                    width: "100%",
                                }}
                            >
                                <Box
                                    sx={{
                                        position: "absolute",
                                        display: "flex",
                                        justifyContent: "center",
                                        left: "50%",
                                        transform: "translate(-50%,50%)",
                                        gap: 0.5,
                                    }}
                                >
                                    {hasSchedule && (
                                        <Box
                                            sx={{
                                                width: 7,
                                                height: 7,
                                                backgroundColor: "#EB5757",
                                                borderRadius: "50%",
                                            }}
                                        />
                                    )}
                                    {hasEvent && (
                                        <Box
                                            sx={{
                                                width: 7,
                                                height: 7,
                                                backgroundColor: "#2F80ED",
                                                borderRadius: "50%",
                                            }}
                                        />
                                    )}
                                    {hasReserve && (
                                        <Box
                                            sx={{
                                                width: 7,
                                                height: 7,
                                                backgroundColor: "#27AE60",
                                                borderRadius: "50%",
                                            }}
                                        />
                                    )}
                                </Box>
                            </Box>
                        );
                    }}
                />
            </Box>

            <Box sx={{ px: 2, py: 2 }}>
                {/* 일정 상세 보기 */}
                {!showForm && !modifyForm && !selectedItem && (
                    <>
                        {selectedSchedules.length || selectedEvents.length || selectedReserves.length ? (
                            openItem?.id ? (
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
                            <Typography sx={{ textAlign: "center", color: "#888" }}>
                                선택한 날짜에 등록된 일정이 없습니다.
                            </Typography>
                        )}
                    </>
                )}

                {/* 일정 추가 폼 */}
                {showForm && (
                    <ScheduleFormCard
                        formData={formData}
                        address={address}
                        setAddress={setAddress}
                        onInputChange={handleInputChange}
                        onDateChange={handleDateChange}
                        onSubmit={addSchedule}
                        onCancel={() => setShowForm(false)}
                    />
                )}

                {/* 일정 수정 폼 */}
                {modifyForm && selectedItem && (
                    <ScheduleFormCard
                        formData={formData}
                        address={address}
                        setAddress={setAddress}
                        onInputChange={handleInputChange}
                        onDateChange={handleDateChange}
                        onSubmit={saveModifiedSchedule}
                        onDelete={removeSchedule}
                        onCancel={() => {
                            setModifyForm(false);
                            setSelectedItem(null);
                        }}
                        isModify
                    />
                )}

                {/* 일정추가 버튼 */}
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

export default CalendarRendering;
