import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import SingleChat from './SingleChat'

const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const {selectedChat} = ChatState()
  return (
    <>
     <div
      className={`${
        selectedChat ? "flex" : "hidden"
      } md:flex flex-col items-center h-[80vh] p-3 bg-white w-full md:w-2/3 rounded-lg border border-gray-300`}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
    </>
  )
}

export default ChatBox

