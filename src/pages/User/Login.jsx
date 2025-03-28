import React, { useState } from "react";

const Login = () => {
    const [search, setSearch] = useState("");
    const [printing, setPrinting] = useState("");
    const onchange = (e) => {
        setSearch(e.target.value);
    };

    const changing = () => {
        setPrinting(search);
    };

    return (
        <div>
            로그인화면
            <input onChange={onchange} />
            <button onClick={changing}>버튼</button>
            <div>{printing}</div>
        </div>
    );
};

export default Login;
