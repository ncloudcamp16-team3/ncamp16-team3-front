import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../../context/Context.jsx";
import MyProfile from "../../components/PetSta/MyProfile.jsx";
import UserProfile from "../../components/PetSta/UserProfile.jsx";
import { getUserPage } from "../../services/petstaService.js";
import { CircularProgress } from "@mui/material";

const UserPage = () => {
    const { userId } = useParams();
    const { user } = useContext(Context);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserPage(userId);
                setUserInfo(data);
            } catch (err) {
                setError("유저 정보를 불러오는 데 실패하였습니다.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [userId]);
    const isMyPage = String(userId) === String(user.id);

    if (error) return <div>{error}</div>;
    if (!userInfo && !loading) return <div>해당 유저를 찾을 수 없습니다.</div>;

    return (
        <div>
            {!loading && userInfo ? (
                isMyPage ? (
                    <MyProfile userInfo={userInfo} />
                ) : (
                    <UserProfile userInfo={userInfo} />
                )
            ) : (
                <CircularProgress size={30} />
            )}
        </div>
    );
};

export default UserPage;
