import React, { useContext } from "react";
import ProfileHeader from "../PetSta/Post/ProfileHeader.jsx";
import { Context } from "../../context/Context.jsx";
import { Box, Typography } from "@mui/material";
import SearchIcon from "../../assets/images/Chat/search-icon.svg";
import ChatItem from "./ChatItem.jsx";
import ChatListData from "../../mock/Chat/chat_list.json";

const ChatList = () => {
    const { user } = useContext(Context);

    return (
        <Box p={1}>
            <ProfileHeader userName={user.name} />
            <Box bgcolor="#d9d9d9" p={2} borderRadius="15px" display="flex" alignItems="center">
                <img src={SearchIcon} />
                <Typography fontWeight="bold" ml={2}>
                    검색
                </Typography>
            </Box>
            <Typography p={1}>메시지</Typography>

            {/* 채팅 목록 뿌리기 */}
            {ChatListData.map((item) => (
                <ChatItem key={item.id} name={item.name} photo={item.photo} lastMessage={item.lastMessage} />
            ))}
        </Box>
    );
};

export default ChatList;
