import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../../context/Context.jsx";
import MyProfile from "../../components/PetSta/MyProfile.jsx";
import UserProfile from "../../components/PetSta/UserProfile.jsx";
import UserInfos from "../../mock/PetSta/UserInfo.json";

const UserPage = () => {
    const { user_id } = useParams();
    const { user } = useContext(Context);

    // user_id에 해당하는 user 정보 찾기
    const userInfo = UserInfos.find((u) => String(u.id) === String(user_id));

    const isMyPage = String(user_id) === String(user.id);

    if (!userInfo) return <div>해당 유저를 찾을 수 없습니다.</div>;

    return <div>{isMyPage ? <MyProfile userInfo={userInfo} /> : <UserProfile userInfo={userInfo} />}</div>;
};

export default UserPage;
