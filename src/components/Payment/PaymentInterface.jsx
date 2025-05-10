import React, { useEffect, useState } from "react";
import { PaymentHistory } from "./PaymentHistory";
import { FilterSection } from "./FilterSection";
import dayjs from "dayjs";
import { fetchPaymentHistory } from "../../services/paymentService.js";

export const PaymentHistoryInterface = () => {
    const [periodSelect, setPeriodSelect] = useState("15일"); // Default "15일"
    const [startDate, setStartDate] = useState(dayjs().subtract(15, "day")); // Default 15 days ago
    const [endDate, setEndDate] = useState(dayjs());
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);

    // Initial search on load
    useEffect(() => {
        handleSearch();
    }, []);

    const handleSearch = async () => {
        if (!startDate || !endDate) return;

        setLoading(true);
        try {
            const res = await fetchPaymentHistory(startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD"));
            setPayments(res.data);
        } catch (err) {
            console.error("Payment history fetch failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <FilterSection
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                periodSelect={periodSelect}
                setPeriodSelect={setPeriodSelect}
                onSearch={handleSearch}
            />
            <PaymentHistory payments={payments} loading={loading} />
        </div>
    );
};
