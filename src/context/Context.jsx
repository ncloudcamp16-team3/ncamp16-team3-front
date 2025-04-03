import { createContext, useState } from "react";

export const Context = createContext();

export function Provider({ children }) {
    const [isMute, setIsMute] = useState(true);
    const toggleMute = () => {
        setIsMute((prev) => !prev);
    };

    return (
        <Context.Provider value={{ isMute, toggleMute }}>
            {children}
        </Context.Provider>
    );
}
