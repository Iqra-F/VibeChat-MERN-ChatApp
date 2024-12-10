import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../userAvatar/UserListItem';
import UserBadgeItem from '../userAvatar/UserBadgeItem.js';

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      displayError('Error searching users');
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      displayError('Please fill all the fields');
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);

      // Display success toast
      setInfo('New Group Chat Created!');
      setShowToast(true);

      // Reset fields and close modal
      setGroupChatName('');
      setSelectedUsers([]);
      document.getElementById('my_modal_1').close();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setShowToast(false);
        setInfo(null);
      }, 4000);
    } catch (error) {
      displayError('Failed to Create the Chat!');
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      displayError('User already added');
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (userToDelete) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== userToDelete._id));
  };

  const displayError = (message) => {
    setError(message);
    setShowToast(true);

    // Clear error message after 3 seconds
    setTimeout(() => {
      setShowToast(false);
      setError(null);
    }, 3000);
  };

  return (
    <>
      <span onClick={() => document.getElementById('my_modal_1').showModal()}>{children}</span>
      <dialog id="my_modal_1" className="modal w-full">
        {showToast && (error || info) && (
          <div className="toast toast-top toast-end z-50">
            <div className={`alert ${error ? 'alert-error' : 'alert-success'}`}>
              <span>{error || info}</span>
            </div>
          </div>
        )}

        <div className="modal-box">
          <h3 className="font-bold text-lg">Create Group Chat</h3>
          <div className="modal-action w-full">
            <form onSubmit={(e) => e.preventDefault()} className="w-full">
              <label className="py-4 input input-bordered flex items-center gap-2">
                Name
                <input
                  type="text"
                  onChange={(e) => setGroupChatName(e.target.value)}
                  className="grow"
                  placeholder="Chat Group"
                />
              </label>
              <label className="py-4 input input-bordered flex items-center gap-2 my-2">
                <input
                  type="text"
                  onChange={(e) => handleSearch(e.target.value)}
                  className="grow"
                  placeholder="Search"
                />
              </label>

              {selectedUsers.map((user) => (
                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleDelete(user)} />
              ))}

              {loading ? (
                <div className="flex justify-center">
                  <span className="loading loading-dots loading-lg"></span>
                </div>
              ) : (
                searchResult.slice(0, 3).map((user) => (
                  <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                ))
              )}

              <div className="flex justify-end">
                <button className="btn hover:bg-teal-500" onClick={handleSubmit}>
                  Done!
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default GroupChatModal;
