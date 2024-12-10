import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div className="flex items-center" key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <div
                className="tooltip tooltip-bottom tooltip-open "
                data-tip={m.sender.name}
              >
                <img
                  className="w-8 h-8 rounded-full cursor-pointer mr-2 mt-1"
                  src={m.sender.pic}
                  alt={m.sender.name}
                />
              </div>
            )}
            <span
              className={`p-3 rounded-xl max-w-[75%] ${
                m.sender._id === user._id
                  ? "bg-blue-200 self-end"
                  : "bg-green-200"
              }`}
              style={{
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? "0.75rem" : "2.5rem",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
