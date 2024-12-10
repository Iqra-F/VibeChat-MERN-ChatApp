import React from 'react'

const UserListItem = ({user,handleFunction}) => {
  return (
    <>
      <div className="flex flex-row items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer   " onClick={handleFunction}>
      <div className="avatar ">
  <div className="mask mask-hexagon w-12 h-12 mr-3">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
  </div>
</div>

<div className="flex flex-col gap-2">
<p className=" font-bold text-base">
            {user.name}
            </p>
          <p className="  text-xs">
            {user.email}
          </p>
</div>
        </div>  
    </>
  )
}

export default UserListItem