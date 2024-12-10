import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
const ChatContext= createContext()
const ChatProvider=({children})=>{
    const [user, setUser] = useState()
    const [selectedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState([])
    const [notification, setNotification] = useState([]);
    const navigate = useNavigate()
    useEffect(() => {
        // since the data i.e user info will be in stringify format so we need to parse it first
       const userInfo = JSON.parse(localStorage.getItem("userInfo"))
    setUser(userInfo)
    // if the user s not logged in then he will be directed to login page
    if(!userInfo){
        navigate("/")
    }
    }, [navigate]) //when the navigate changes, it will run 
    
  return(
    <ChatContext.Provider value={{user, setUser,selectedChat, setSelectedChat,chats, setChats, notification, setNotification}}>
        {children}
    </ChatContext.Provider>
  )
}
export const ChatState=()=>{
return useContext(ChatContext)
}
export default ChatProvider; 