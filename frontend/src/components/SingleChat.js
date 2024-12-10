import { useEffect, useState } from "react";
import axios from "axios";
import { FaLongArrowAltLeft } from "react-icons/fa";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../components/animations/typing.json";
import io from "socket.io-client";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";

const ENDPOINT = "http://localhost:9000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]); // for all messages
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [showToast, setShowToast] = useState(false); // Toast visibility
  const [toastMessage, setToastMessage] = useState(""); // Toast message
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      // creating a room with the id of chat
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      setToastMessage("Failed to load messages.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, [user]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        setToastMessage("Failed to send message.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  // }, []);
  }, [selectedChat]);
  console.log("notification******", notification);
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    //if not typing say it is typing upto 3 seconds
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    // but after 3 seconds if user is still not typing, stop typing

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000; //3 seconds
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      // if timeDiff is greater than3 secs, and still showing typing
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      <div className="relative w-full h-full">
        {/* Toast Container */}
        {showToast && (
          <div className="toast toast-end z-50">
            <div className="alert alert-error">
              <span>{toastMessage}</span>
            </div>
          </div>
        )}
        {selectedChat ? (
          <div className="flex flex-col w-full h-full bg-gray-100 rounded-lg ">
            <div className="flex  justify-between items-center text-lg p-3 w-full bg-white rounded-t-lg border-b">
              <button
                className="sm:hidden p-1 rounded"
                onClick={() => setSelectedChat("")}
              >
                <FaLongArrowAltLeft />
              </button>
              <div className=" sm:w-full sm:flex sm:justify-between ">
                {!selectedChat.isGroupChat ? (
                  <>
                    {getSender(user, selectedChat.users)}
                    <ProfileModal
                      user={getSenderFull(user, selectedChat.users)}
                    />
                  </>
                ) : (
                  <>
                    <div className="md:w-full md:flex md:justify-between">
                      {selectedChat.chatName.toUpperCase()}
                      <UpdateGroupChatModal
                        fetchMessages={fetchMessages}
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-end h-full p-3 bg-gray-200 overflow-y-hidden">
              {loading ? (
                <div className="flex justify-center items-center">
                  <span className="loading loading-spinner text-accent"></span>
                </div>
              ) : (
                <div className="overflow-y-auto messages">
                  <ScrollableChat messages={messages} />
                </div>
              )}
              {istyping && (
                <div className="mt-3">
                  {/* <span className="loading loading-ball loading-xs"></span>
<span className="loading loading-ball loading-sm"></span>
<span className="loading loading-ball loading-md"></span>
<span className="loading loading-ball loading-lg"></span> */}
                  <Lottie options={defaultOptions} width={70} />
                </div>
              )}
              <input
                type="text"
                className="mt-3 p-3 w-full rounded-lg bg-gray-300"
                placeholder="Enter a message..."
                value={newMessage}
                onChange={typingHandler}
                required
                onKeyDown={sendMessage}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-2xl font-semibold">
              Click on a user to start chatting
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default SingleChat;
