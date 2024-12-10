import React from "react";
import { FaEye } from "react-icons/fa";
const ProfileModal = ({ user, children }) => {
  return (
    <>
      {children ? (
        <div
          className=""
          onClick={() => document.getElementById("my_modal_5").showModal()}
        >
          {children}
        </div>
      ) : (
        <div className=" ml-3  rounded ">
          <FaEye
            size={20}
            className=" hover:text-teal-500"
            onClick={() => document.getElementById("my_modal_5").showModal()}
          />
        </div>
      )}
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <button className="btn btn-ghost bg-teal-500 text-white font-bold  text-base">
            {user.name}
            </button>
          <p className="py-4 text-xl">
            {user.email}
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn hover:bg-teal-500 hover:text-white">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ProfileModal;
