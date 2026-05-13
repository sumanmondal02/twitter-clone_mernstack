import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiCloseLine, RiHeartFill, RiChat1Fill, RiUserFollowFill, RiDeleteBinLine, RiCheckLine } from "react-icons/ri";
import { useNotificationStore } from "../stores/notificationStore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function NotificationPanel({ isOpen, onClose }) {
  const navigate = useNavigate();
  const {
    notifications,
    isLoading,
    showPast,
    setShowPast,
    fetchNotifications,
    markAllRead,
    markAsRead,
    deleteNotification,
    clearAll,
  } = useNotificationStore();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
      setShowPast(false);
    }
  }, [isOpen]);

  const unread = notifications.filter((n) => !n.isRead);
  const read = notifications.filter((n) => n.isRead);
  const displayed = showPast ? read : unread;

  if (!isOpen) return null;

  const getIcon = (type) => {
    if (type === "like") return <RiHeartFill className="text-[#f4212e] text-[16px]" />;
    if (type === "comment") return <RiChat1Fill className="text-[#1d9bf0] text-[16px]" />;
    if (type === "follow") return <RiUserFollowFill className="text-[#00ba7c] text-[16px]" />;
  };

  const getMessage = (n) => {
    const name = `${n.fromUserId?.firstName} ${n.fromUserId?.lastName}`;
    if (n.type === "like") return <><span className="font-bold text-white">{name}</span> <span className="text-[#71767b]">
      liked your post</span></>;
    if (n.type === "comment") return <><span className="font-bold text-white">{name}</span> <span className="text-[#71767b]">
      replied to your post</span></>;
    if (n.type === "follow") return <><span className="font-bold text-white">{name}</span> <span className="text-[#71767b]">
      followed you</span></>;
  };

  const handleNotifClick = (n) => {
    navigate(`/profile/${n.fromUserId?.username}`);
    onClose();
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 z-[998] bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* DESKTOP PANEL */}
      <div className="hidden sm:flex fixed top-0 left-0 z-[999] h-full w-[420px] bg-[#0a0a0a]/90 
      backdrop-blur-md border-r border-[#2f3336] flex-col rounded-r-2xl animate-slide-in">

        {/* HEADER */}
        <div className="flex flex-col px-4 pt-4 pb-3 border-b border-[#2f3336] gap-3">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full hover:bg-[#16181c] flex items-center justify-center transition"
            >
              <RiCloseLine className="text-[22px] text-white" />
            </button>
            <span className="text-white font-bold text-[18px]">Notifications</span>
            <div className="w-9" />
          </div>

          {/* TABS */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowPast(false)}
              className={`flex-1 h-[34px] rounded-full text-[13px] font-bold transition ${
                !showPast ? "bg-white text-black" : "border border-[#2f3336] text-[#71767b] hover:bg-[#16181c]"
              }`}
            >
              Unread {unread.length > 0 && `(${unread.length})`}
            </button>
            <button
              onClick={() => setShowPast(true)}
              className={`flex-1 h-[34px] rounded-full text-[13px] font-bold transition ${
                showPast ? "bg-white text-black" : "border border-[#2f3336] text-[#71767b] hover:bg-[#16181c]"
              }`}
            >
              Past
            </button>
          </div>

          {/* ACTIONS */}
          {!showPast && unread.length > 0 && (
            <button
              onClick={markAllRead}
              className="text-[#1d9bf0] text-[13px] font-semibold hover:underline self-end"
            >
              Mark all as read
            </button>
          )}
          {showPast && read.length > 0 && (
            <button
              onClick={clearAll}
              className="text-red-500 text-[13px] font-semibold hover:underline self-end"
            >
              Clear all
            </button>
          )}
        </div>

        {/* LIST */}
        <NotifList
          displayed={displayed}
          isLoading={isLoading}
          showPast={showPast}
          getIcon={getIcon}
          getMessage={getMessage}
          handleNotifClick={handleNotifClick}
          deleteNotification={deleteNotification}
          markAsRead={markAsRead}
        />
      </div>

      {/* MOBILE PANEL — bottom sheet */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-[999] h-[75vh] bg-[#0a0a0a]/90 backdrop-blur-md border-t border-[#2f3336] 
      rounded-t-3xl flex flex-col animate-slide-up">

        {/* DRAG HANDLE */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#2f3336]" />
        </div>

        {/* HEADER */}
        <div className="flex flex-col px-4 pt-2 pb-3 border-b border-[#2f3336] gap-3">
          <div className="flex items-center justify-between">
            <span className="text-white font-bold text-[18px]">Notifications</span>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full hover:bg-[#16181c] flex items-center justify-center transition"
            >
              <RiCloseLine className="text-[22px] text-white" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowPast(false)}
              className={`flex-1 h-[34px] rounded-full text-[13px] font-bold transition ${
                !showPast ? "bg-white text-black" : "border border-[#2f3336] text-[#71767b] hover:bg-[#16181c]"
              }`}
            >
              Unread {unread.length > 0 && `(${unread.length})`}
            </button>
            <button
              onClick={() => setShowPast(true)}
              className={`flex-1 h-[34px] rounded-full text-[13px] font-bold transition ${
                showPast ? "bg-white text-black" : "border border-[#2f3336] text-[#71767b] hover:bg-[#16181c]"
              }`}
            >
              Past
            </button>
          </div>

          {!showPast && unread.length > 0 && (
            <button onClick={markAllRead} className="text-[#1d9bf0] text-[13px] font-semibold hover:underline self-end">
              Mark all as read
            </button>
          )}
          {showPast && read.length > 0 && (
            <button onClick={clearAll} className="text-red-500 text-[13px] font-semibold hover:underline self-end">
              Clear all
            </button>
          )}
        </div>

        <NotifList
          displayed={displayed}
          isLoading={isLoading}
          showPast={showPast}
          getIcon={getIcon}
          getMessage={getMessage}
          handleNotifClick={handleNotifClick}
          deleteNotification={deleteNotification}
          markAsRead={markAsRead}
        />
      </div>
    </>
  );
}

function NotifList({ displayed, isLoading, showPast, getIcon, getMessage, handleNotifClick, deleteNotification, markAsRead }) {
  return (
    <div className="flex-1 overflow-y-auto">
      {isLoading && (
        <div className="text-center text-[#71767b] py-8 text-[14px]">Loading...</div>
      )}
      {!isLoading && displayed.length === 0 && (
        <div className="text-center text-[#71767b] py-12 text-[14px]">
          {showPast ? "No past notifications" : "You're all caught up!"}
        </div>
      )}
      {displayed.map((n) => (
        <div
          key={n._id}
          onClick={() => handleNotifClick(n)}
          className={`flex items-start gap-3 px-4 py-3 border-b border-[#1e2124] cursor-pointer hover:bg-[#ffffff08] transition ${
            !n.isRead ? "bg-[#1d9bf008]" : ""
          }`}
        >
          {/* AVATAR + ICON */}
          <div className="relative shrink-0">
            <img
              src={n.fromUserId?.profileImageUrl || "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png"}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#0a0a0a] rounded-full p-[3px]">
              {getIcon(n.type)}
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1 min-w-0">
            <div className="text-[14px] leading-snug">{getMessage(n)}</div>
            {n.postId?.description && (
              <div className="text-[#71767b] text-[13px] mt-1 truncate">
                "{n.postId.description}"
              </div>
            )}
            <div className="text-[#71767b] text-[12px] mt-1">
              {dayjs(n.createdAt).fromNow()}
            </div>
          </div>

          {/* UNREAD DOT + DELETE */}
        <div className="flex flex-col items-end gap-2 shrink-0">
        {!n.isRead ? (
            <button
            onClick={(e) => {
                e.stopPropagation();
                markAsRead(n._id);
            }}
            className="
                text-[#1d9bf0]
                hover:bg-[#1d9bf0]/10
                transition
                w-8
                h-8
                rounded-full
                flex
                items-center
                justify-center">
            <RiCheckLine className="text-[18px]" />
            </button> 
            ) : ( 
            <button
            onClick={(e) => {
                e.stopPropagation();
                deleteNotification(n._id);
            }}
            className="
                text-[#71767b]
                hover:text-red-500
                transition
                w-8
                h-8
                rounded-full
                flex
                items-center
                justify-center
            "
            >
            <RiDeleteBinLine className="text-[15px]" />
            </button>
        )}
        </div>
        </div>
      ))}
    </div>
  );
}

export default NotificationPanel;