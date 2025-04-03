import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { format, parseISO } from "date-fns";
import "react-calendar/dist/Calendar.css"; // css import

const Cal = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [schedules, setSchedules] = useState([]);
    const [events, setEvents] = useState([]);

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

    // 일정이 있는 날짜인지 확인
    const checkHasSchedule = (date) => {
        return (
            schedules.some(
                (schedule) =>
                    format(parseISO(schedule.start_date), "yyyy-MM-dd") ===
                    format(date, "yyyy-MM-dd")
            ) ||
            events.some(
                (event) =>
                    format(parseISO(event.start_date), "yyyy-MM-dd") ===
                    format(date, "yyyy-MM-dd")
            )
        );
    };

    // 날짜 선택 시 실행
    const handleDateChange = (date) => {
        setSelectedDate(date);
        console.log(
            `📅 선택한 날짜: ${format(date, "yyyy-MM-dd")}, 일정 있음: ${checkHasSchedule(date)}`
        );
    };

    return (
        <div className="p-4">
            <Calendar
                calendarType="gregory"
                locale="en-US"
                onChange={handleDateChange}
                value={selectedDate}
                tileContent={({ date }) =>
                    checkHasSchedule(date) ? (
                        <div className="flex justify-center items-center mt-1">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full">
                                일정
                            </span>
                        </div>
                    ) : null
                }
            />
            <div className="mt-4">
                <h2 className="text-lg font-semibold">
                    {format(selectedDate, "yyyy년 MM월 dd일")} 일정 & 이벤트
                </h2>
                {selectedSchedules.length > 0 || selectedEvents.length > 0 ? (
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
