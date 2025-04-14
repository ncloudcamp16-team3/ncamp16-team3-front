import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../../context/Context.jsx";
import MyProfile from "../../components/PetSta/MyProfile.jsx";
import UserProfile from "../../components/PetSta/UserProfile.jsx";
import UserInfos from "../../mock/PetSta/user-info.json";
import UserInfo from "../../mock/PetSta/user-info.json";

const UserPage = () => {
    const { userId } = useParams();
    const { user } = useContext(Context);

    // userId에 해당하는 user 정보 찾기
    const userInfo = UserInfos.find((u) => String(u.id) === String(userId));

    const isMyPage = String(userId) === String(user.id);

    if (!userInfo) return <div>해당 유저를 찾을 수 없습니다.</div>;

    const targetUser = UserInfo.find((u) => u.id === userId);

    return <div>{isMyPage ? <MyProfile userInfo={userInfo} /> : <UserProfile userInfo={userInfo} />}</div>;
};

export default UserPage;
