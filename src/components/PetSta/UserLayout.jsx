import React from "react";
import { Outlet, useParams } from "react-router-dom";
import UserInfo from "../../mock/PetSta/user-info.json";
import ProfileHeader from "./Post/ProfileHeader.jsx";

const UserLayout = () => {
    const { userId } = useParams();
    const targetUser = UserInfo.find((u) => String(u.id) === String(userId));

    return (
        <div>
            <ProfileHeader userName={targetUser?.name || "알 수 없음"} />
            <Outlet />
        </div>
    );
};

export default UserLayout;
