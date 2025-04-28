import React from "react";
import "react-calendar/dist/Calendar.css";
import "/src/css/calendar/cal.css";
import CalendarRendering from "../../components/Calender/CalendarRendering.jsx";
import { CalendarProvider } from "../../components/Calender/CalendarContext.jsx"; // CalendarProvider 임포트

const Cal = () => {
    return (
        <CalendarProvider>
            <CalendarRendering />
        </CalendarProvider>
    );
};

export default Cal;
