import { createContext, useState } from "react";

export const Context = createContext();

export function Provider({ children }) {
    const [isMute, setIsMute] = useState(true);
    const [user, setUser] = useState({
        name: "USER1823",
        photo: "haribo.jpg",
    });
    const toggleMute = () => {
        setIsMute((prev) => !prev);
    };

    return <Context.Provider value={{ isMute, toggleMute, user, setUser }}>{children}</Context.Provider>;
}
