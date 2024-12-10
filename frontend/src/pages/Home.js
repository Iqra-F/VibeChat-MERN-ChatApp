import React, { useEffect } from 'react'
import Signup from '../components/auth/Signup'
import Login from '../components/auth/Login'
import { useNavigate } from 'react-router-dom'
import chat from '../assets/chat.png';
import chatbubble from '../assets/chat-bubble_.png';
import speechbubbles from '../assets/speech-bubbles-2.png';


const Home = () => {
  const navigate = useNavigate()
  useEffect(() => {
      // since the data i.e user info will be in stringify format so we need to parse it first
     const user = JSON.parse(localStorage.getItem("userInfo"))
  // if the user is logged in then he will be directed to chats page
  if(user){
      navigate("/chats")
  }
  }, [navigate])
  
  return (
    <>
      <div className=" max-w-full gap-2 bg-transparent h-screen container mx-auto flex flex-col sm:flex-row md:px-20 px-4 ">
      {/* left */}
      
      <div className=" rounded md:w-1/2 mt-2  flex flex-col sm:my-auto justify-center items-center">
<div className="flex justify-center gap-14 sm:gap-0 sm:justify-between w-full mx-12">
<img src={chatbubble} alt="" className="size-8 md:size-32 sm:size-20 " />
<img src={speechbubbles} alt="" className="size-8 md:size-32 sm:size-20 " />
</div>


        <img src={chat} alt="" className="size-48 sm:size-60 md:size-auto"/>

        </div>
        {/* right */}
        <div className=" md:w-1/2 gap-4 flex flex-col my-auto justify-center items-center">
        <h2 className=" text-lg sm:text-xl md:text-2xl rounded-md font-semibold w-full bg-white text-center font-work  py-2">
          Welcome to Iqra Chat App!
        </h2>
        <div className="rounded-2xl w-full flex justify-center  items-center bg-white">
        <div role="tablist" className="w-full tabs tabs-lifted">
  <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="signup" />
  <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
    <Signup/>
  </div>

  <input
    type="radio"
    name="my_tabs_2"
    role="tab"
    className="tab"
    aria-label="login"
    defaultChecked 
    />
  <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-3 sm:p-6">
    <Login/>
  </div>
</div>
        </div>
        </div>
      </div>
    </>
  )
}

export default Home