import React from 'react'
import { TiDelete } from "react-icons/ti";
const UserBadgeItem = ({user,handleFunction}) => {
  return (
    <>
 <div className="badge badge-accent badge-outline mr-1">
            {user.name} 
            <TiDelete className="cursor-pointer" onClick={(e) => { 
                e.stopPropagation();
                handleFunction();
            }} />
        </div>    </>
  )
}

export default UserBadgeItem