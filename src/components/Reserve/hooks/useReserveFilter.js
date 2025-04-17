import { useMemo } from "react";

const useReserveFilter = (data, category, sortType) => {
    return useMemo(() => {
        const filtered = data.filter((item) => item.category === category);
        const sorted = [...filtered].sort((a, b) => {
            if (sortType === "rating") return b.rating - a.rating;
            if (sortType === "distance") return a.distance - b.distance;
            return 0;
        });
        return sorted;
    }, [data, category, sortType]);
};

export default useReserveFilter;
