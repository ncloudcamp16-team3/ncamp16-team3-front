import React, { useContext, useEffect, useState } from "react";
import Male from "../../assets/images/PetMeeting/male.svg";
import Female from "../../assets/images/PetMeeting/female.svg";
import Theme from "../../theme/theme.js";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import TitleBar from "../../components/Global/TitleBar.jsx";
import { getPet } from "../../services/petService.js";
import PetImgSlide from "../../components/PetMeeting/PetImgSlide.jsx";
import Loading from "../../components/Global/Loading.jsx";
import { Context } from "../../context/Context.jsx";
import { createChatRoom, postMatchCheck, postMatchStart } from "../../services/chatService.js";

const PetDetails = () => {
    const { petId } = useParams();
    const [currentPet, setCurrentPet] = useState({});
    const navigate = useNavigate();
    const { nc, user, pet, showModal } = useContext(Context);
    const [loading, setLoading] = useState(true);

    const getAge = (birthDateString) => {
        const birthDate = new Date(birthDateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
        return age;
    };

    const handleChat = async () => {
        if (!pet.id) {
            showModal(null, "나의 반려동물을 선택해주세요", null);
        }

        if (!nc || !currentPet || !user) return;

        try {
            const uniqueId = await createChatRoom(currentPet.ownerId);

            const filter = { name: uniqueId };
            const channelList = await nc.getChannels(filter, {}, { per_page: 1 });
            const { edges } = channelList;

            let realChannelId = null;

            if (edges.length > 0) {
                realChannelId = edges[0].node.id;
            } else {
                const newChannel = await nc.createChannel({
                    type: "PRIVATE",
                    name: uniqueId,
                });
                realChannelId = newChannel.id;
                await nc.addUsers(realChannelId, [`ncid${user.id}`, `ncid${currentPet.ownerId}`]);
            }

            const subFilter = {
                channel_id: realChannelId,
                user_id: `ncid${user.id}`,
            };
            const subs = await nc.getSubscriptions(subFilter, {}, { per_page: 1 });
            const isSubscribed = subs.length > 0;

            if (!isSubscribed) {
                await nc.subscribe(realChannelId);
                console.log("✅ 사용자 구독 완료");
            }

            // ✅ 채팅 버튼 누를 때 매칭 체크
            const matched = await postMatchCheck(pet.id, currentPet.id);
            console.log(matched);

            if (!matched.data) {
                // 매칭이 안 되어있으면 매칭 생성
                await postMatchStart(pet.id, currentPet.id);

                // 그리고 "대화가 시작되었어요" 메시지 전송
                const messagePayload = {
                    customType: "MATCH",
                    content: {
                        participants: [
                            {
                                name: pet?.name || "",
                                age: pet?.birthDate ? `${getAge(pet.birthDate)}살` : "",
                                photo: pet?.photos?.[0]?.path || "",
                            },
                            {
                                name: currentPet?.name || "",
                                age: currentPet?.birthDate ? `${getAge(currentPet.birthDate)}살` : "",
                                photo: currentPet?.photos?.[0]?.path || "",
                            },
                        ],
                        text: "대화가 시작되었어요",
                    },
                };

                await nc.sendMessage(realChannelId, {
                    type: "text",
                    message: JSON.stringify(messagePayload),
                });

                console.log("✅ 매칭 메시지 전송 완료");
            }

            navigate(`/chat/room/${realChannelId}`);
        } catch (e) {
            console.error("❌ 채팅방 처리 실패:", e);
        }
    };

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const res = await getPet({ id: petId });
                setCurrentPet(res.data);
                console.log(res.data);
                setLoading(false);
            } catch (err) {
                console.log("에러 발생: " + err.message);
                showModal(null, "친구를 찾지 못했습니다", () => {
                    navigate(`/`);
                });
            }
        };
        fetchPet();
    }, [petId]);

    return (
        <Box>
            <TitleBar name={"친구 프로필"} />
            {loading ? (
                <Loading />
            ) : (
                <Box sx={{ width: "100% - 20px", margin: "0 10px 75px 10px", pb: "0" }}>
                    {currentPet?.photos?.length > 0 && <PetImgSlide photos={currentPet.photos} />}
                    <Typography sx={{ mt: "0", fontSize: "25px", display: "inline", verticalAlign: "middle" }}>
                        {currentPet?.name}
                    </Typography>
                    <Box
                        component="img"
                        src={currentPet?.gender === "MALE" ? Male : Female}
                        sx={{ verticalAlign: "middle" }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "center", m: "10px 0" }}>
                        <Typography
                            sx={{
                                p: "5px 15px",
                                borderRadius: "20px",
                                backgroundColor: "#FFEBCD",
                                fontSize: "20px",
                                margin: "0 2%",
                            }}
                        >
                            {currentPet?.type}
                        </Typography>
                        <Typography
                            sx={{
                                p: "5px 15px",
                                borderRadius: "20px",
                                backgroundColor: "#E0CDFF",
                                fontSize: "20px",
                                margin: "0 2%",
                            }}
                        >
                            {getAge(currentPet?.birthDate)}세
                        </Typography>
                        <Typography
                            sx={{
                                p: "5px 15px",
                                borderRadius: "20px",
                                backgroundColor: "#FFCDD6",
                                fontSize: "20px",
                                margin: "0 2%",
                            }}
                        >
                            {currentPet?.weight}KG
                        </Typography>
                    </Box>
                    <Typography sx={{ fontSize: "20px" }}>정보</Typography>
                    <Typography sx={{ fontSize: "16px", color: "rgba(0, 0, 0, 0.5)" }}>
                        생년월일 : {currentPet?.birthDate}
                        <br />
                        중성화 : {currentPet?.neutured ? "O" : "X"}
                        <br />
                        소개 : {currentPet?.introduction}
                    </Typography>
                    <Box
                        sx={{
                            position: "fixed",
                            bottom: "60px",
                            left: "10px",
                            right: "10px",
                            height: "75px",
                            maxWidth: "480px",
                            margin: "0 auto",
                            backgroundColor: "white",
                            zIndex: 999,
                        }}
                    />
                    <Button
                        onClick={handleChat}
                        sx={{
                            position: "fixed",
                            bottom: "85px",
                            left: "10px",
                            right: "10px",
                            maxWidth: "480px",
                            backgroundColor: Theme.brand3,
                            borderRadius: "10px",
                            color: "white",
                            zIndex: 1000,
                            margin: "0 auto",
                        }}
                    >
                        채팅하기
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default PetDetails;
