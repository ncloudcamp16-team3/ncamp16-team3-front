import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { format, parseISO } from "date-fns";
import "react-calendar/dist/Calendar.css";
import { Box, Card, CardContent } from "@mui/material";

const Cal = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [schedules, setSchedules] = useState([]);
    const [events, setEvents] = useState([]);
    const [reserves, setReserves] = useState([]);

    // JSON 파일 로드
    useEffect(() => {
        fetch("src/mock/Calendar/calender_schedules.json")
            .then((response) => response.json())
            .then((data) => setSchedules(data))
            .catch((error) => console.error("Error loading schedules:", error));

        fetch("src/mock/Calendar/event.json")
            .then((response) => response.json())
            .then((data) => setEvents(data))
            .catch((error) => console.error("Error loading events:", error));

        fetch("src/mock/Calendar/reserves.json")
            .then((response) => response.json())
            .then((data) => setReserves(data))
            .catch((error) => console.error("Error loading reserves:", error));
    }, []);

    // 선택한 날짜의 일정 필터링
    const selectedSchedules = schedules.filter(
        (schedule) =>
            format(parseISO(schedule.start_date), "yyyy-MM-dd") ===
            format(selectedDate, "yyyy-MM-dd")
    );

    // 선택한 날짜에 해당하는 이벤트 필터링
    const selectedEvents = events.filter(
        (event) =>
            format(parseISO(event.start_date), "yyyy-MM-dd") ===
            format(selectedDate, "yyyy-MM-dd")
    );

    const selectedReserves = reserves.filter(
        (reserve) =>
            format(parseISO(reserve.entry_time), "yyyy-MM-dd") ===
            format(selectedDate, "yyyy-MM-dd")
    );

    // 일정이 있는 날짜인지 확인하고 이벤트 유형에 따라 반환
    const checkHasScheduleOrEvent = (date) => {
        const hasSchedule = schedules.some(
            (schedule) =>
                format(parseISO(schedule.start_date), "yyyy-MM-dd") ===
                format(date, "yyyy-MM-dd")
        );

        const hasEvent = events.some(
            (event) =>
                format(parseISO(event.start_date), "yyyy-MM-dd") ===
                format(date, "yyyy-MM-dd")
        );

        const hasReserve = reserves.some(
            (reserve) =>
                format(parseISO(reserve.entry_time), "yyyy-MM-dd") ===
                format(date, "yyyy-MM-dd")
        );

        return { hasSchedule, hasEvent, hasReserve };
    };
    // 날짜 선택 시 실행
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return (
        <div
            style={{
                backgroundColor: "#F2DFCE",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                textAlign="center"
                sx={{
                    height: "330px",
                    backgroundColor: "white",
                    color: "white",
                }}
            >
                <Calendar
                    calendarType="gregory"
                    formatDay={(locale, date) =>
                        date.toLocaleString("en", { day: "numeric" })
                    }
                    onChange={handleDateChange}
                    value={selectedDate}
                    tileContent={({ date }) => {
                        const { hasSchedule, hasEvent, hasReserve } =
                            checkHasScheduleOrEvent(date);

                        return (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 0.5,
                                }}
                            >
                                {hasSchedule && (
                                    <Box
                                        sx={{
                                            width: 6,
                                            height: 6,
                                            backgroundColor: "blue",
                                            borderRadius: "50%",
                                        }}
                                    />
                                )}

                                {hasEvent && (
                                    <Box
                                        sx={{
                                            width: 6,
                                            height: 6,
                                            backgroundColor: "#EB5757",
                                            borderRadius: "50%",
                                        }}
                                    />
                                )}

                                {hasReserve && (
                                    <Box
                                        sx={{
                                            width: 6,
                                            height: 6,
                                            backgroundColor: "#27AE60",
                                            borderRadius: "50%",
                                        }}
                                    />
                                )}
                            </Box>
                        );
                    }}
                />
            </Box>
            <Box>
                <h2>
                    {format(selectedDate, "yyyy년 MM월 dd일")} 일정 & 이벤트
                </h2>
                {selectedSchedules.length > 0 ||
                selectedEvents.length > 0 ||
                selectedReserves.length > 0 ? (
                    <div
                        style={{
                            padding: "10px",
                        }}
                    >
                        {/* 캘린더 일정 출력 */}
                        {selectedSchedules.length > 0 &&
                            selectedSchedules.map((schedule) => (
                                <Card
                                    key={schedule.id}
                                    sx={{
                                        mb: 2,
                                        borderRadius: "32px",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                        position: "relative",
                                        display: "flex",
                                    }}
                                >
                                    {/* 왼쪽 빨간색 배경 */}
                                    <Box
                                        sx={{
                                            width: "40px",
                                            backgroundColor: "#EB5757",
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
                                            "&:last-child": {
                                                paddingBottom: 2.5,
                                            },
                                            flexGrow: 1, // 남은 공간 차지
                                        }}
                                    >
                                        <h3>{schedule.title}</h3>
                                        <p>{schedule.content}</p>
                                        <p>
                                            🕒 {schedule.start_date} ~{" "}
                                            {schedule.end_date}
                                        </p>
                                        <p>📍 {schedule.address}</p>
                                    </CardContent>
                                </Card>
                            ))}

                        {/* 이벤트 출력 */}
                        {selectedEvents.length > 0 &&
                            selectedEvents.map((event) => (
                                <Card
                                    key={event.id}
                                    sx={{
                                        mb: 2,
                                        borderRadius: "32px",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                        position: "relative",
                                        display: "flex",
                                    }}
                                >
                                    {/* 왼쪽 파란색 배경 */}
                                    <Box
                                        sx={{
                                            width: "40px",
                                            backgroundColor: "#2F80ED",
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
                                            "&:last-child": {
                                                paddingBottom: 2.5,
                                            },
                                            flexGrow: 1, // 남은 공간 차지
                                        }}
                                    >
                                        <h3>{event.title}</h3>
                                        <p>📍 {event.address}</p>
                                        <p>
                                            🕒 {event.start_date} ~{" "}
                                            {event.end_date}
                                        </p>
                                        <a
                                            href={event.event_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: "lightblue",
                                                textDecoration: "none",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            🔗 이벤트 상세 보기
                                        </a>
                                    </CardContent>
                                </Card>
                            ))}

                        {/* 예약 출력 */}
                        {selectedReserves.length > 0 &&
                            selectedReserves.map((reserve) => (
                                <Card
                                    key={reserve.id}
                                    sx={{
                                        mb: 2,
                                        borderRadius: "32px",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                        position: "relative",
                                        display: "flex",
                                    }}
                                >
                                    {/* 왼쪽 녹색 배경 */}
                                    <Box
                                        sx={{
                                            width: "40px",
                                            backgroundColor: "#27AE60",
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
                                            "&:last-child": {
                                                paddingBottom: 2.5,
                                            },
                                            flexGrow: 1, // 남은 공간 차지
                                        }}
                                    >
                                        <h3>🏢 {reserve.facility_name}</h3>
                                        <p>📍 {reserve.address}</p>
                                        <p>
                                            🕒 {reserve.entry_time} ~{" "}
                                            {reserve.exit_time || "미정"}
                                        </p>
                                        <p>
                                            💰 예약 금액:{" "}
                                            {reserve.amount.toLocaleString()}원
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                ) : (
                    <p>해당 날짜에 일정이나 이벤트가 없습니다.</p>
                )}
            </Box>
        </div>
    );
};

export default Cal;
