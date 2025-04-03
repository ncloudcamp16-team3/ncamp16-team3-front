import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { format, parseISO } from "date-fns";
import "react-calendar/dist/Calendar.css";
import { Box } from "@mui/material"; // css import

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
        <div className="p-4">
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
                                gap: 0.5, // 원 사이의 간격 조정
                            }}
                        >
                            {hasSchedule && (
                                <Box
                                    sx={{
                                        width: 6,
                                        height: 6,
                                        backgroundColor: "blue", // 일정(schedule)일 경우 파란색
                                        borderRadius: "50%",
                                    }}
                                />
                            )}

                            {hasEvent && (
                                <Box
                                    sx={{
                                        width: 6,
                                        height: 6,
                                        backgroundColor: "red", // 이벤트(event)일 경우 빨간색
                                        borderRadius: "50%",
                                    }}
                                />
                            )}

                            {hasReserve && (
                                <Box
                                    sx={{
                                        width: 6,
                                        height: 6,
                                        backgroundColor: "green",
                                        borderRadius: "50%",
                                    }}
                                />
                            )}
                        </Box>
                    );
                }}
            />
            <div className="mt-4">
                <h2 className="text-lg font-semibold">
                    {format(selectedDate, "yyyy년 MM월 dd일")} 일정 & 이벤트
                </h2>
                {selectedSchedules.length > 0 ||
                selectedEvents.length > 0 ||
                selectedReserves.length > 0 ? (
                    <div className="mt-2 space-y-4">
                        {/* 캘린더 일정 출력 */}
                        {selectedSchedules.length > 0 && (
                            <div>
                                <h3 className="text-md font-bold">📌 일정</h3>
                                <ul className="mt-2 space-y-2">
                                    {selectedSchedules.map((schedule) => (
                                        <li
                                            key={schedule.id}
                                            className="p-2 border rounded shadow"
                                        >
                                            <h3 className="font-bold">
                                                {schedule.title}
                                            </h3>
                                            <p>{schedule.content}</p>
                                            <p className="text-sm text-gray-500">
                                                🕒 {schedule.start_date} ~{" "}
                                                {schedule.end_date}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                📍 {schedule.address}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* 이벤트 출력 */}
                        {selectedEvents.length > 0 && (
                            <div>
                                <h3 className="text-md font-bold">🎉 이벤트</h3>
                                <ul className="mt-2 space-y-2">
                                    {selectedEvents.map((event) => (
                                        <li
                                            key={event.id}
                                            className="p-2 border rounded shadow"
                                        >
                                            <h3 className="font-bold">
                                                {event.title}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                📍 {event.address}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                🕒 {event.start_date} ~{" "}
                                                {event.end_date}
                                            </p>
                                            <a
                                                href={event.event_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 underline"
                                            >
                                                🔗 이벤트 상세 보기
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* 예약 출력 */}
                        {selectedReserves.length > 0 && (
                            <div>
                                <h3 className="text-md font-bold">예약 목록</h3>
                                <ul className="mt-2 space-y-2">
                                    {selectedReserves.map((reserve) => (
                                        <li
                                            key={reserve.id}
                                            className="p-3 border rounded-lg shadow-md bg-white"
                                        >
                                            <h3 className="font-bold text-lg">
                                                🏢 {reserve.facility_name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                📍 {reserve.address}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                🕒 {reserve.entry_time} ~{" "}
                                                {reserve.exit_time || "미정"}
                                            </p>
                                            <p className="text-sm text-gray-700 font-semibold">
                                                💰 예약 금액:{" "}
                                                {reserve.amount.toLocaleString()}
                                                원
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-500 mt-2">
                        해당 날짜에 일정이나 이벤트가 없습니다.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Cal;
