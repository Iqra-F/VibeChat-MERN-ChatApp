//to fetch all the chats for a user
import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [error, setError] = useState();
  const [showToast, setShowToast] = useState(false); // For controlling toast visibility

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      displayError("Failed to Load the chats");
    }
  };
  const displayError = (message) => {
    displayError(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);
  return (
    <div
      className={`${
        selectedChat ? "sm:flex hidden" : "flex"
      } flex-col items-center p-3 h-[80vh] bg-white  w-full md:w-1/2 rounded-lg border`}
    >
      <div className="pb-3 px-3 text-base  md:text-2xl font-sans flex w-full justify-between items-center">
        My Chats
        <GroupChatModal>
          <button className="flex text-xs sm:text-sm rounded p-1 sm:p-2 md:text-xs lg:text-sm items-center">
            New Group Chat <FaPlus className="ml-2 hidden sm:block"/>
          </button>
        </GroupChatModal>
      </div>
      {showToast && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        </div>
      )}
      <div className="flex flex-col p-3 bg-gray-100 w-full h-full rounded-lg overflow-hidden">
        {chats ? (
          <div className="overflow-y-scroll">
            {chats.map((chat) => (
              <div
                onClick={() => setSelectedChat(chat)}
                className={`cursor-pointer px-3 py-2 text-sm sm:text-base rounded mb-1 ${
                  selectedChat === chat
                    ? "bg-teal-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
                key={chat._id}
              >
                <p className="cursor-pointer">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </p>
                {chat.latestMessage && (
                  <p className="text-xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
};

export default MyChats;
