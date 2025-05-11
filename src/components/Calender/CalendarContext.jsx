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
    // const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [message, setMessage] = useState("");

    const { user, fcmToken, handleSnackbarOpen, snackbar, setSnackbar } = useContext(Context);

    const getTypeColor = (type) => {
        const colors = {
            schedule: "#EB5757",
            event: "#2F80ED",
            reserve: "#27AE60",
        };
        return colors[type] || "#ccc";
    };

    const handleToggle = (id, type) => {
        // console.log("startDate", formData.startDate);
        // console.log("endDate", formData.endDate);
        setOpenItem({ id, type });
    };

    const getTitle = (item, type) => {
        return item.title;
    };

    const getPeriod = (item, type) => {
        if (type === "reserve") {
            return (
                <>
                    {format(parseISO(item.entryTime), "yy-MM-dd HH:mm")} ~{" "}
                    {format(parseISO(item.exitTime), "yy-MM-dd HH:mm")}
                </>
            );
        }
        return (
            <>
                {format(parseISO(item.startDate), "yy-MM-dd HH:mm")} ~{" "}
                {format(parseISO(item.endDate), "yy-MM-dd HH:mm")}
            </>
        );
    };

    const handleBack = () => setOpenItem({ id: null, type: null });

    const isSameDate = (date1, date2) => format(date1, "yyyy-MM-dd") === format(date2, "yyyy-MM-dd");

    const selectedSchedules = schedules.filter((s) => s.dateList?.includes(format(selectedDate, "yyyy-MM-dd")));
    const selectedEvents = events.filter((e) => e.dateList?.includes(format(selectedDate, "yyyy-MM-dd")));
    const selectedReserves = reserves.filter((r) => r.dateList?.includes(format(selectedDate, "yyyy-MM-dd")));

    const checkHasScheduleOrEvent = (date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        return {
            hasSchedule: schedules.some((s) => s.dateList?.includes(dateStr)),
            hasEvent: events.some((e) => e.dateList?.includes(dateStr)),
            hasReserve: reserves.some((r) => r.dateList?.includes(dateStr)),
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
        const start = dayjs(formData.startDate);
        const end = dayjs(formData.endDate);

        // 누락된 필드 체크
        const fieldsToCheck = {
            title: formData.title,
            address: formData.address,
            latitude: formData.latitude,
            longitude: formData.longitude,
            content: formData.content,
        };

        const missingFields = Object.entries(fieldsToCheck)
            .filter(([, value]) => !value) // 값이 없으면 필터링
            .map(([key]) => key); // 키(항목명)만 추출

        if (missingFields.length > 0) {
            const fieldLabels = {
                title: "제목",
                address: "장소",
                latitude: "위도",
                longitude: "경도",
                content: "내용",
            };
            const missing = missingFields.map((f) => fieldLabels[f] || f).join(", ");
            setSnackbar((prev) => ({
                ...prev,
                message: `${missing} ${missingFields.length > 1 ? "항목들이" : "항목이"} 입력되지 않았습니다.`,
                severity: "warning",
                open: true,
            }));
            return; // 필드 누락 시 진행되지 않도록 리턴
        }

        try {
            const scheduleData = {
                id: formData.id,
                userId: formData.userId,
                title: formData.title,
                content: formData.content,
                address: formData.address,
                latitude: formData.latitude || null,
                longitude: formData.longitude || null,
                startDate: start.format("YYYY-MM-DD HH:mm:ss"),
                endDate: end.format("YYYY-MM-DD HH:mm:ss"),
            };

            // 수정된 일정을 API로 업데이트
            await putSchedule(scheduleData);

            // 서버에서 최신 스케줄 데이터 가져오기
            const schedulesData = await getScheduleAll(user.id);
            // console.log("Schedules data fetched:", schedulesData); // 디버깅: 스케줄 데이터 확인

            // 스케줄 데이터를 상태에 반영
            setSchedules(schedulesData);

            // 수정 폼 초기화
            setModifyForm(false);
            setSelectedItem(null);
        } catch (error) {
            handleSnackbarOpen("일정 등록에 실패했습니다.", "error");
            console.error("일정 수정 에러:", error);
        }
    };
    const removeSchedule = async () => {
        try {
            // 삭제 요청
            await deleteSchedule({ id: formData.id });

            // 서버에서 최신 스케줄 데이터 가져오기
            const schedulesData = await getScheduleAll(user.id);
            // console.log("Schedules data fetched:", schedulesData); // 디버깅: 스케줄 데이터 확인

            // 삭제된 항목을 제외한 새로운 리스트로 갱신
            setSchedules(schedulesData);

            // 수정 폼 및 선택 항목 초기화
            setModifyForm(false);
            setSelectedItem(null);
            setOpenItem({ id: null, type: null }); // 상세보기 닫기
        } catch (error) {
            handleSnackbarOpen("일정 등록에 실패했습니다.", "error");
            console.error("일정 삭제 에러:", error);
        }
    };

    const addSchedule = async () => {
        const start = dayjs(formData.startDate);
        const end = dayjs(formData.endDate);

        // 누락된 필드 체크
        const fieldsToCheck = {
            title: formData.title,
            address: formData.address,
            // latitude: formData.latitude,
            // longitude: formData.longitude,
            content: formData.content,
        };

        const missingFields = Object.entries(fieldsToCheck)
            .filter(([, value]) => !value) // 값이 없으면 필터링
            .map(([key]) => key); // 키(항목명)만 추출

        if (missingFields.length > 0) {
            const fieldLabels = {
                title: "제목",
                address: "장소",
                // latitude: "위도",
                // longitude: "경도",
                content: "내용",
            };
            const missing = missingFields.map((f) => fieldLabels[f] || f).join(", ");
            handleSnackbarOpen(
                `${missing} ${missingFields.length > 1 ? "항목들이" : "항목이"} 입력되지 않았습니다.`,
                "warning"
            );
            return; // 필드 누락 시 진행되지 않도록 리턴
        }

        try {
            const scheduleData = {
                userId: user.id,
                title: formData.title,
                content: formData.content,
                address: formData.address,
                latitude: formData.latitude || null,
                longitude: formData.longitude || null,
                startDate: start.format("YYYY-MM-DD HH:mm:ss"),
                endDate: end.format("YYYY-MM-DD HH:mm:ss"),
                fcmToken: fcmToken,
            };

            // 새로운 일정 추가
            await postSchedule(scheduleData);

            // 서버에서 최신 스케줄 데이터 가져오기
            const schedulesData = await getScheduleAll(user.id);
            // console.log("Schedules data fetched:", schedulesData); // 디버깅: 스케줄 데이터 확인

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
            handleSnackbarOpen("일정이 성공적으로 등록되었습니다!", "success");
        } catch (error) {
            handleSnackbarOpen("시작일시와 종료일시를 확인해주세요.", "error");
            // console.log("일정 등록 에러:", error);
        }
    };

    const [reserveId, setReserveId] = useState(null); // 예약 ID를 관리하는 상태 추가
    const [selectedReserve, setSelectedReserve] = useState(null); // 선택된 예약 정보

    const handleReserveId = (id) => {
        // 선택된 예약 ID를 설정
        setReserveId(id);

        // 선택된 예약 정보 찾기 (예시로 reserves 상태에서 id에 해당하는 예약을 찾는 방식)
        const selectedReserve = reserves.find((reserve) => reserve.id === id);
        setSelectedReserve(selectedReserve);

        // console.log("선택된 예약 정보:", selectedReserve);
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
                message,
                setMessage,
                reserveId,
                setReserveId,
                selectedReserve,
                setSelectedReserve,
                handleReserveId,
            }}
        >
            {children}
        </CalendarContext.Provider>
    );
};
