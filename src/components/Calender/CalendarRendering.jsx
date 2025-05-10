import React, { useContext, useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "/src/css/calendar/cal.css";
import { Box, Typography, Button } from "@mui/material";
import ScheduleFormCard from "../../components/Calender/ScheduleFormCard.jsx";
import { getScheduleAll, getEventAll, getReserveAll } from "../../services/calendarService.js";
import { Context } from "../../context/Context.jsx";
import { CalendarContext } from "./CalendarContext.jsx";
import RenderCard from "./RenderCard.jsx";

const CalendarRendering = () => {
    const { user, snackbar, setSnackbar } = useContext(Context);
    const {
        selectedDate,
        setSelectedDate,
        currentViewMonth,
        setCurrentViewMonth,
        setSchedules,
        setEvents,
        openItem,
        setOpenItem,
        showForm,
        setShowForm,
        modifyForm,
        setModifyForm,
        selectedItem,
        setSelectedItem,
        setLoading,
        formData,
        setFormData,
        address,
        setAddress,
        selectedSchedules,
        selectedEvents,
        selectedReserves,
        checkHasScheduleOrEvent,
        handleInputChange,
        handleDateChange,
        saveModifiedSchedule,
        removeSchedule,
        addSchedule,

        reserves,
        setReserves,
    } = useContext(CalendarContext);
    const getInitialRightPosition = () => {
        if (typeof window !== "undefined") {
            const windowWidth = window.innerWidth;
            const layoutWidth = 500;

            if (windowWidth <= layoutWidth) {
                return "10px";
            } else {
                const sideGap = (windowWidth - layoutWidth) / 2 + 10;
                return `${sideGap}px`;
            }
        }
        return "10px"; // SSR일 경우 안전한 기본값
    };

    const [rightPosition, setRightPosition] = useState(getInitialRightPosition);

    useEffect(() => {
        const updatePosition = () => {
            const windowWidth = window.innerWidth;
            const layoutWidth = 500;

            if (windowWidth <= layoutWidth) {
                setRightPosition("10px");
            } else {
                const sideGap = (windowWidth - layoutWidth) / 2 + 10; // 20은 내부 여백
                setRightPosition(`${sideGap}px`);
            }
        };

        updatePosition();
        window.addEventListener("resize", updatePosition);

        return () => window.removeEventListener("resize", updatePosition);
    }, []);

    const useAddressUpdate = (address, setFormData) => {
        useEffect(() => {
            setFormData((prev) => ({ ...prev, address }));
        }, [address, setFormData]);
    };

    const useFormReset = (showForm, setFormData, setAddress) => {
        useEffect(() => {
            if (showForm) {
                setAddress(""); // 주소 문자열 초기화
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
        }, [showForm, setFormData, setAddress]);
    };

    useAddressUpdate(address, setFormData);
    useFormReset(showForm, setFormData, setAddress);

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
                const reserveData = await getReserveAll(user.id);
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

    return (
        <>
            <Box
                style={{
                    backgroundColor: "#F2DFCE",
                    minHeight: "100vh",
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        backgroundColor: "white",
                        borderBottom: "1px solid #ccc",
                        fontSize: "20px",
                        fontWeight: "bold",
                        height: "60px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>캘린더</Typography>
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                    sx={{ backgroundColor: "white", color: "white", pb: 2 }}
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
                                                .map((s, index) => <RenderCard key={index} item={s} type="schedule" />)}
                                        {openItem.type === "event" &&
                                            selectedEvents
                                                .filter((e) => e.id === openItem.id)
                                                .map((e, index) => <RenderCard key={index} item={e} type="event" />)}
                                        {openItem.type === "reserve" &&
                                            selectedReserves
                                                .filter((r) => r.id === openItem.id)
                                                .map((r, index) => <RenderCard key={index} item={r} type="reserve" />)}
                                    </>
                                ) : (
                                    <>
                                        {selectedSchedules.map((s, index) => (
                                            <RenderCard key={index} item={s} type="schedule" />
                                        ))}
                                        {selectedEvents.map((e, index) => (
                                            <RenderCard key={index} item={e} type="event" />
                                        ))}
                                        {selectedReserves.map((r, index) => (
                                            <RenderCard key={index} item={r} type="reserve" />
                                        ))}
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
                            setFormData={setFormData}
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
                            setFormData={setFormData}
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
                </Box>
                {/* 일정추가 버튼 */}
                {!showForm && !modifyForm && !selectedItem && !openItem?.id && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "fixed",
                            bottom: "80px",
                            right: rightPosition,
                            zIndex: 10,
                            borderRadius: "100%",
                            transform: "translateZ(0)",
                        }}
                    >
                        <Button
                            sx={{
                                backgroundColor: "#E9A260",
                                borderRadius: "50px",
                                transform: "translateZ(0)",
                            }}
                            onClick={() => setShowForm(true)}
                            variant="contained"
                        >
                            일정추가
                        </Button>
                    </Box>
                )}
            </Box>
        </>
    );
};

export default CalendarRendering;
