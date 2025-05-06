import { useEffect, useState } from "react";

const useApiFetch = ({ apiFn, params = {}, deps = [] }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [last, setLast] = useState(false);
    const [noData, setNoData] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log(params);
            const response = await apiFn(params);
            if (response.content) {
                setData(response.content);
                setLast(response.last);
            } else if (response) {
                setData(response);
            }
            setNoData(false);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, deps);

    const handleError = (err) => {
        if (err) {
            setError(
                "다음 오류로 인해 목록을 불러오지 못했습니다. \n 3초 후 자동으로 다시 목록을 불러옵니다 \n " +
                    err.message || "데이터를 불러오는 데 실패했습니다."
            );
        }
        setTimeout(() => fetchData(), 3000);
    };

    return { data, loading, error, last, noData };
};

export default useApiFetch;
