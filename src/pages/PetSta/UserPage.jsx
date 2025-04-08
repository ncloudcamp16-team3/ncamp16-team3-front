import { useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../../context/Context.jsx";
import UserInfos from "../../mock/PetSta/UserInfo.json";

const UserPage = () => {
    const { user_id } = useParams();
    const { user } = useContext(Context);
    UserInfos;

    const isMyPage = String(user_id) === String(user.id); // 혹시몰라서 string 비교로

    // return <div>{isMyPage ? <MyProfile userInfo={userInfo} /> : <UserProfile userInfo={userInfo} />}</div>;
};

export default UserPage;
