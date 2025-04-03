import { createContext, useState } from "react";

export const Context = createContext();

export function Provider({ children }) {
    const [isMute, setIsMute] = useState(true);
    const [address, setAddress] = useState("");
    const toggleMute = () => {
        setIsMute((prev) => !prev);
    };

    return <Context.Provider value={{ isMute, address, setAddress, toggleMute }}>{children}</Context.Provider>;
}
