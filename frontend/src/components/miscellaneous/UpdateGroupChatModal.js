import { useState } from "react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { FaUser } from "react-icons/fa";
const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.error("Search error:", error);
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `/api/chat/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      console.error("Rename error:", error);
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) return;

    if (selectedChat.groupAdmin._id !== user._id) return;

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      console.error("Add user error:", error);
      setLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) return;

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );
      user1._id === user._id ? setSelectedChat(null) : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      console.error("Remove user error:", error);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button className="btn btn-sm btn-outline" onClick={() => window.my_modal.showModal()}>
      <FaUser />
      </button>

      {/* DaisyUI Modal */}
      <dialog id="my_modal" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg text-center">{selectedChat.chatName}</h3>
          <div className="flex flex-wrap gap-2 py-3">
            {selectedChat.users.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                admin={selectedChat.groupAdmin}
                handleFunction={() => handleRemove(u)}
              />
            ))}
          </div>
          <div className="form-control">
            <input
              type="text"
              placeholder="Chat Name"
              className="input input-bordered w-full"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <button
              className={`p-2 rounded mt-2 ${renameloading ? "loading" : ""}`}
              onClick={handleRename}
            >
              Update
            </button>
          </div>
          <div className="form-control mt-4">
            <input
              type="text"
              placeholder="Add User to Group"
              className="input input-bordered w-full"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          {loading ? (
            <div className="flex justify-center mt-3">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="mt-3">
              {searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))}
            </div>
          )}
          <div className="modal-action">
            <button className="btn hover:bg-red-500 hover:text-white  cursor-not-allowed"
             onClick={() => handleRemove(user)}
             >
              Leave Group
            </button>
            <button className="btn  hover:outline-none hover:bg-teal-500" onClick={() => window.my_modal.close()}>
              Close
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default UpdateGroupChatModal;
