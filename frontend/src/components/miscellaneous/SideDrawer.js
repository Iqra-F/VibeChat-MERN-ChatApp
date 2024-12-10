import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import ChatLoading from '../ChatLoading';
import { IoIosNotifications } from "react-icons/io";
import axios from 'axios';
import UserListItem from '../userAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
// import NotificationBadge from "react-notification-badge";
// import { Effect } from "react-notification-badge";
const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [error, setError] = useState(" ")
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate()
  const {setSelectedChat,user, chats, setChats,notification, setNotification } = ChatState()

   const handleSearch = async () => {
    if (!search) {
      displayError("Please Enter something in search")
      return;
    }
     try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    }
    catch (error) {
      displayError("Failed to Load the Search Results")
    }
  };
  const accessChat= async(userId)=>{
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      // onClose();
    } catch (error) {
      displayError("Error fetching the chat")
    }

  }
  const handleLogout = ()=>{
    localStorage.removeItem('userInfo')
    navigate('/')
  }
  const displayError = (message) => {
    setError(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <>
    {/* navbar */}
    <div className="navbar bg-base-100">
      
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        <ProfileModal user={user}>
        <li className=''><a>Profile</a></li>
        </ProfileModal>
        <li onClick={handleLogout}><a>Logout</a></li>
      </ul>
    </div>
  </div>
  <div className="navbar-center">
    <a className="btn btn-ghost hidden sm:block text-xl">VibeChat</a>
  </div>
  <div className="navbar-end">
 <div className="form-control mr-2 ">
  <input 
    type="text" 
    placeholder="Search" 
    className="input input-bordered w-24 md:w-auto"
    onClick={() => document.getElementById('my-drawer-4').checked = true} 
  />
</div>


    {/* image*/}
    <div tabIndex={0} role="button" className=" btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          {/* {user.name} */}
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      {/* notification */}
      <div className="dropdown dropdown-end">
            <div tabIndex="0" className="relative p-2 rounded hover:bg-teal-500 hover:text-white">
            <IoIosNotifications  size={20}/>
              {/* <NotificationBadge count={notification.length} effect={Effect.SCALE} /> */}
              {notification.length > 0 && (
      <span className="badge badge-error absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
        {notification.length}
      </span>
    )}
              <i className="fas fa-bell text-2xl"></i>
            </div>
            <ul tabIndex="0" className="dropdown-content menu p-2 shadow bg-white rounded-box w-52">
              {!notification.length && <li>No New Messages</li>}
              {notification.map((notif) => (
                <li key={notif._id}>
                  <div
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}  
                  </div>
                </li>
              ))}
            </ul>
          </div>
    {/* <button className="btn btn-ghost btn-circle">
      <div className="dropdown">
      <summary className="btn m-1">
         <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
    {
      !notification.length && 'No message received'
    }
    {
      notification.map(notif =>(
        <li key={notif._id} onClick={()=>{
          setSelectedChat(notif.chat)
          setNotification(notification.filter((n) => n!==notif))
          }}>            
           <a href="" className="">
            {
              notif.chat.isGroupChat? `New from: ${notif.chat.chatName}`: `New from: ${getSender(user, notif.chat.users)}`
            }
           </a>
        </li>
      ))
    }
  </ul>
     <span className="badge badge-xs badge-primary indicator-item"></span> 
      </div>
    </button> */}
  </div>
</div>
 {/* Toast for error messages */}
 {showToast && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        </div>
      )}
{/* sidedrawer */}
<div className="drawer drawer-end z-30">
  <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
  <div className="drawer-content">
    {/* Page content here */}
    {/* The Open drawer button is removed */}
  </div>
  <div className="drawer-side">
    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
    <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
      <li className=' '>
     <div className="form-control ">
  <input 
    type="text" 
    placeholder="Search" 
    className="input input-bordered w-24 md:w-auto"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    onClick={() => document.getElementById('my-drawer-4').checked = true} 
  />
  <button onClick={handleSearch} className="btn btn-error mr-4">Go</button>
</div>
</li>
<li className="mt-8 w-full">
{
      loading?(<ChatLoading/>):(
  
          searchResult?.map(user =>(
            <UserListItem
            key={user._id}
            user={user}
            handleFunction={()=>accessChat(user._id)}
            />
          ))
        
      )
    }
</li>
    </ul>
    
  </div>
  {
      loading &&
      <div className="absolute right-32 z-40 mt-6">
         <span className="loading  loading-spinner text-warning"></span>
      </div>
      
    }
</div>
    </>
  )
}

export default SideDrawer