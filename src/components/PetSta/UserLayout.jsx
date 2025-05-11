import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import ProfileHeader from "./Post/ProfileHeader.jsx";
import { getUserName } from "../../services/petstaService.js";

const UserLayout = () => {
    const { userId } = useParams();
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const data = await getUserName(userId);
                setUserName(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUserName();
        // console.log(userName);
    }, [userId]);

    return (
        <div>
            <ProfileHeader userName={userName} />
            <Outlet />
        </div>
    );
};

export default UserLayout;
