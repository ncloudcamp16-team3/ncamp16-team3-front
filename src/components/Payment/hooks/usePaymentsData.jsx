import { useState, useEffect } from "react";
// In a real project, this would be imported directly
// import bookingsData from '../data/bookings.json';

export const usePaymentsData = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulating direct JSON import
        const paymentsData = {
            payments: [
                {
                    id: 1,
                    name: "멍브로",
                    date: "2025-04-10",
                    time: "13:00",
                    price: 240000,
                    imageUrl:
                        "../../../../public/mock/Global/images/haribo.jpg",
                },
                {
                    id: 2,
                    name: "명브로",
                    date: "2025-03-23",
                    time: "17:00",
                    price: 360000,
                    imageUrl:
                        "../../../../public/mock/Global/images/haribo.jpg",
                },
                {
                    id: 3,
                    name: "명보로",
                    date: "2025-02-18",
                    time: "13:00",
                    price: 120000,
                    imageUrl:
                        "../../../../public/mock/Global/images/haribo.jpg",
                },
                {
                    id: 4,
                    name: "명보르",
                    date: "2025-01-20",
                    time: "09:00",
                    price: 360000,
                    imageUrl:
                        "../../../../public/mock/Global/images/haribo.jpg",
                },
            ],
        };

        // Set data directly from the imported JSON
        setPayments(paymentsData.payments);
        setLoading(false);
    }, []);

    return { payments, loading, error };
};
