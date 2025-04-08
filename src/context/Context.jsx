import { createContext, useState } from "react";

export const Context = createContext();

export function Provider({ children }) {
    const [isMute, setIsMute] = useState(true);
    const [address, setAddress] = useState("");
    const [user, setUser] = useState({
        name: "USER1823",
        photo: "haribo.jpg",
        id: "3212",
    });
    const toggleMute = () => {
        setIsMute((prev) => !prev);
    };

    return (
        <Context.Provider value={{ isMute, address, setAddress, toggleMute, user, setUser }}>
            {children}
        </Context.Provider>
    );
}
