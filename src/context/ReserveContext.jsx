import { createContext, useContext, useState } from "react";

const ReserveContext = createContext();

export const ReserveProvider = ({ children }) => {
    const [category, setCategory] = useState("HOTEL");
    const [sortBy, setSortBy] = useState("rating");
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [scrollMap, setScrollMap] = useState({});
    const [location, setLocation] = useState({ latitude: null, longitude: null });

    const setScrollY = (pathname, y) => {
        setScrollMap((prev) => ({ ...prev, [pathname]: y }));
    };

    const getScrollY = (pathname) => scrollMap[pathname] || 0;

    return (
        <ReserveContext.Provider
            value={{
                category,
                setCategory,
                sortBy,
                setSortBy,
                data,
                setData,
                page,
                setPage,
                size,
                setSize,
                getScrollY,
                setScrollY,
                location,
                setLocation,
            }}
        >
            {children}
        </ReserveContext.Provider>
    );
};

export const useReserveContext = () => useContext(ReserveContext);
