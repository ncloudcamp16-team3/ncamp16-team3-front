import { useState, useEffect } from "react";
import paymentsData from "../../../mock/Payments/payments.json";
// In a real project, this would be imported directly
// import bookingsData from '../data/bookings.json';

export const usePaymentsData = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // const fetchData = async () => {
        //     try {
        //         const response = await fetch("/api/payments"); // 예시 URL
        //         const data = await response.json();
        //         setPayments(data);
        //     } catch (err) {
        //         setError(err);
        //     } finally {
        //         setLoading(false);
        //     }
        // };
        //
        // fetchData();

        const paymentData = paymentsData;
        setPayments(paymentData);
        setLoading(false);
    }, []);

    return { payments, loading, error };
};
