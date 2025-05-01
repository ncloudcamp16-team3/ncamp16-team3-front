import { useState, useEffect } from "react";

export const usePaymentsData = (params = {}) => {
    const { userId = 1, startDate, endDate, page, size } = params;

    const [payments, setPayments] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [last, setLast] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const query = new URLSearchParams();

                query.append("id", userId);
                if (startDate) query.append("startDate", startDate);
                if (endDate) query.append("endDate", endDate);
                if (page) query.append("page", page);
                if (size) query.append("size", size);
                console.log(query);

                const response = await fetch(`http://localhost:8080/api/payment/get?${query}`);
                if (!response.ok) {
                    const errorData = await response.text();
                    throw new Error(`데이터 요청 실패: ${response.status} ${errorData}`);
                }

                const data = await response.json();
                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
                setTotalElements(data.totalElements);
                if (totalPages - data.currentPage <= 10) setLast(true);
                setPayments(data.data || []);
            } catch (err) {
                setError(err);
                console.error("Payment data fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, startDate, endDate, page, size]);
    return { payments, currentPage, totalPages, totalElements, last, loading, error };
};
