import { createContext, useContext, useState } from "react";

const ReserveContext = createContext();

export const ReserveProvider = ({ children }) => {
    const [category, setCategory] = useState("HOTEL");
    const [sortBy, setSortBy] = useState("starPoint");
    const [data, setData] = useState([]);
    const [noData, setNoData] = useState(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [last, setLast] = useState(false);
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [globalModalOpen, setGlobalModalOpen] = useState(false);
    const [message, setMessage] = useState({
        title: "",
        text: "",
        confirmText: "",
        cancelText: "",
        redirectUrl: "",
    });
    const [globalConfirmModal, setGlobalConfirmModal] = useState({
        open: false,
        onClose: () => {},
        onConfirm: () => {},
        title: "",
        description: "",
        confirmText: "",
        cancelText: "",
    });

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
                location,
                setLocation,
                noData,
                setNoData,
                last,
                setLast,
                infoModalOpen,
                setInfoModalOpen,
                globalModalOpen,
                setGlobalModalOpen,
                message,
                setMessage,
                globalConfirmModal,
                setGlobalConfirmModal,
            }}
        >
            {children}
        </ReserveContext.Provider>
    );
};

export const useReserveContext = () => useContext(ReserveContext);
