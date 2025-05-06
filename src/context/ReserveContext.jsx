import { createContext, useContext, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getFacilityToReserveById } from "../services/reserveService.js";

const ReserveRouteContext = createContext(null);
const FacilityListContext = createContext(null);
const FacilityDetailContext = createContext(null);
const ReserveListContext = createContext(null);
const ReserveDetailContext = createContext(null);

export function ReserveRouteProvider({ children }) {
    const location = useLocation();
    const navigate = useNavigate();

    const query = useMemo(() => new URLSearchParams(location.search), [location.search]);

    const getQuery = (key) => query.get(key);
    const setQuery = (params = {}) => {
        const updated = new URLSearchParams(location.search);
        Object.entries(params).forEach(([k, v]) => {
            if (v == null) updated.delete(k);
            else updated.set(k, v);
        });
        navigate(`${location.pathname}?${updated.toString()}`, { replace: false });
    };

    const goTo = (path, params = {}) => {
        const qs = new URLSearchParams(params).toString();
        navigate(`${path}${qs ? `?${qs}` : ""}`);
    };

    return (
        <ReserveRouteContext.Provider
            value={{
                path: location.pathname,
                getQuery,
                setQuery,
                goTo,
            }}
        >
            {children}
        </ReserveRouteContext.Provider>
    );
}

export const FacilityListProvider = ({ children }) => {
    const [category, setCategory] = useState("HOTEL");
    const [sortBy, setSortBy] = useState("starPoint");
    const [list, setList] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [scrollMap, setScrollMap] = useState({});
    const [location, setLocation] = useState({ latitude: null, longitude: null });

    const setScrollY = (pathname, y) => {
        setScrollMap((prev) => ({ ...prev, [pathname]: y }));
    };

    const getScrollY = (pathname) => scrollMap[pathname] || 0;

    return (
        <FacilityListContext.Provider
            value={{
                category,
                setCategory,
                sortBy,
                setSortBy,
                list,
                setList,
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
        </FacilityListContext.Provider>
    );
};

export const FacilityDetailProvider = ({ children }) => {
    const [reviewPage, setReviewPage] = useState(0);
    const [reviewSize, setReviewSize] = useState(5);
    const [facility, setFacility] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFacility = async (id) => {
        setLoading(true);
        try {
            const data = await getFacilityToReserveById({ id });
            setFacility(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 5000);
        }
    };

    const value = {
        reviewPage,
        setReviewPage,
        reviewSize,
        setReviewSize,
        facility,
        loading,
        error,
        fetchFacility,
    };

    return <FacilityDetailContext.Provider value={value}>{children}</FacilityDetailContext.Provider>;
};

export const ReserveListProvider = ({ children }) => {
    const [list, setList] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [scrollMap, setScrollMap] = useState({});
    const [location, setLocation] = useState({ latitude: null, longitude: null });

    const setScrollY = (pathname, y) => {
        setScrollMap((prev) => ({ ...prev, [pathname]: y }));
    };

    const getScrollY = (pathname) => scrollMap[pathname] || 0;

    return (
        <ReserveListContext.Provider
            value={{
                list,
                setList,
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
        </ReserveListContext.Provider>
    );
};

export const ReserveDetailProvider = ({ children }) => {
    const [detail, setDetail] = useState([]);
    const [scrollMap, setScrollMap] = useState({});
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [userWantReserve, setUserWantReserve] = useState(false);

    const setScrollY = (pathname, y) => {
        setScrollMap((prev) => ({ ...prev, [pathname]: y }));
    };

    const getScrollY = (pathname) => scrollMap[pathname] || 0;

    return (
        <ReserveDetailContext.Provider
            value={{
                detail,
                setDetail,
                getScrollY,
                setScrollY,
                location,
                setLocation,
                isMapOpen,
                setIsMapOpen,
                userWantReserve,
                setUserWantReserve,
            }}
        >
            {children}
        </ReserveDetailContext.Provider>
    );
};

export const useReserveRouteContext = () => {
    const ctx = useContext(ReserveRouteContext);
    if (!ctx) throw new Error("useReserveRoute must be used within ReserveRouteProvider");
    return ctx;
};
export const useFacilityListContext = () => useContext(FacilityListContext);
export const useFacilityDetailContext = () => useContext(FacilityDetailContext);
export const useReserveListContext = () => useContext(ReserveListContext);
export const useReserveDetailContext = () => useContext(ReserveDetailContext);
