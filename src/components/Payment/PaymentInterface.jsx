import React, { useState } from "react";
import { PaymentHistory } from "./PaymentHistory";
import { FilterSection } from "./FilterSection";
import styles from "../../css/payment/PaymentHistoryInterface.module.css";
import dayjs from "dayjs";
import { fetchPaymentHistory } from "../../services/paymentService.js";

export const PaymentHistoryInterface = () => {
    const today = dayjs().format("YYYY-MM-DD");

    const [periodSelect, setPeriodSelect] = useState(null);
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);

    const handlePeriodChange = (period) => {
        setPeriodSelect(period);
        const todayObj = dayjs();

        let newStartDate = today;
        if (period === "15일") newStartDate = todayObj.subtract(15, "day").format("YYYY-MM-DD");
        else if (period === "1개월") newStartDate = todayObj.subtract(1, "month").format("YYYY-MM-DD");
        else if (period === "3개월") newStartDate = todayObj.subtract(3, "month").format("YYYY-MM-DD");

        setStartDate(newStartDate);
        setEndDate(today);
    };

    const handleDateChange = (type, value) => {
        if (type === "start") setStartDate(value);
        else if (type === "end") setEndDate(value);

        // 날짜 수동 입력 시 자동 선택 해제
        if (periodSelect) setPeriodSelect(null);
    };

    const handleSearch = async () => {
        if (!startDate || !endDate) return;

        setLoading(true);
        try {
            const res = await fetchPaymentHistory(startDate, endDate);
            setPayments(res.data);
        } catch (err) {
            console.error("결제 내역 조회 실패:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <FilterSection
                periodSelect={periodSelect}
                startDate={startDate}
                endDate={endDate}
                onPeriodChange={handlePeriodChange}
                onDateChange={handleDateChange}
                onSearch={handleSearch}
            />
            <PaymentHistory payments={payments} loading={loading} />
        </div>
    );
};
