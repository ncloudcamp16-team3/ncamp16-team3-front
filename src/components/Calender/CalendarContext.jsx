import React, { createContext, useContext, useState } from "react";
import dayjs from "dayjs";
import { format, parseISO } from "date-fns";
import { deleteSchedule, getScheduleAll, postSchedule, putSchedule } from "../../services/calendarService.js";
import { Context } from "../../context/Context.jsx";

// CalendarContext 정의
export const CalendarContext = createContext();

// CalendarProvider 정의
export const CalendarProvider = ({ children }) => {
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
    const { user, fcmToken } = useContext(Context);

    const getTypeColor = (type) => {
        const colors = {
            schedule: "#EB5757",
            event: "#2F80ED",
            reserve: "#27AE60",
        };
        return colors[type] || "#ccc";
    };

    const handleToggle = (id, type) => {
        console.log("startDate", formData.startDate);
        console.log("endDate", formData.endDate);
        setOpenItem((prev) => (prev.id === id && prev.type === type ? { id: null, type: null } : { id, type }));
    };

    const getTitle = (item, type) => {
        return type === "reserve" ? item.facility_name : item.title;
    };

    const getPeriod = (item, type) => {
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
                {format(parseISO(item.startDate), "yy-MM-dd hh:mm")}~ {format(parseISO(item.endDate), "yy-MM-dd hh:mm")}
            </>
        );
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
            const scheduleData = {
                id: formData.id,
                userId: formData.userId,
                title: formData.title,
                content: formData.content,
                address: formData.address,
                latitude: formData.latitude || null,
                longitude: formData.longitude || null,
                startDate: dayjs(formData.startDate).format("YYYY-MM-DD HH:mm:ss"),
                endDate: dayjs(formData.endDate).format("YYYY-MM-DD HH:mm:ss"),
            };

            // 수정된 일정을 API로 업데이트
            await putSchedule(scheduleData);

            // 서버에서 최신 스케줄 데이터 가져오기
            const schedulesData = await getScheduleAll(user.id);
            console.log("Schedules data fetched:", schedulesData); // 디버깅: 스케줄 데이터 확인

            // 스케줄 데이터를 상태에 반영
            setSchedules(schedulesData);

            // 수정 폼 초기화
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

            // 서버에서 최신 스케줄 데이터 가져오기
            const schedulesData = await getScheduleAll(user.id);
            console.log("Schedules data fetched:", schedulesData); // 디버깅: 스케줄 데이터 확인

            // 삭제된 항목을 제외한 새로운 리스트로 갱신
            setSchedules(schedulesData);

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
                fcmToken: fcmToken,
            };

            // 새로운 일정 추가
            await postSchedule(scheduleData);

            // 서버에서 최신 스케줄 데이터 가져오기
            const schedulesData = await getScheduleAll(user.id);
            console.log("Schedules data fetched:", schedulesData); // 디버깅: 스케줄 데이터 확인

            // 새로 추가된 스케줄을 상태에 반영
            setSchedules(schedulesData);

            // 폼 초기화
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
                fcmToken: "",
            });
            alert("일정이 성공적으로 등록되었습니다!");
        } catch (error) {
            alert("일정 등록에 실패했습니다.");
            console.error("일정 등록 에러:", error);
        }
    };

    return (
        <CalendarContext.Provider
            value={{
                selectedDate,
                setSelectedDate,
                currentViewMonth,
                setCurrentViewMonth,
                schedules,
                setSchedules,
                events,
                setEvents,
                reserves,
                setReserves,
                openItem,
                setOpenItem,
                showForm,
                setShowForm,
                modifyForm,
                setModifyForm,
                selectedItem,
                setSelectedItem,
                loading,
                setLoading,
                formData,
                setFormData,
                address,
                setAddress,
                getTypeColor,
                handleToggle,
                getTitle,
                getPeriod,
                handleBack,
                selectedSchedules,
                selectedEvents,
                selectedReserves,
                checkHasScheduleOrEvent,
                handleInputChange,
                handleDateChange,
                handleModifyClick,
                saveModifiedSchedule,
                removeSchedule,
                addSchedule,
            }}
        >
            {children}
        </CalendarContext.Provider>
    );
};
