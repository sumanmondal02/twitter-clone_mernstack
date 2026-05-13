import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiCloseLine } from "react-icons/ri";
import { useFollowStore } from "../stores/followStore";

function FollowModal({ title, type, closeModal, isOwnProfile }) {
  const navigate = useNavigate();
  const { followers, following, followUserInModal, unfollowUserInModal, removeFollowerInModal } = useFollowStore();
  const [search, setSearch] = useState("");

  const users = type === "followers" ? followers : following;

  // Filter users by search query
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`;
      return (
        fullName.toLowerCase().includes(search.toLowerCase()) ||
        user.username.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [users, search]);

  // Handle follow/unfollow action
  const handleAction = async (e, user) => {
    e.stopPropagation();

    if (type === "followers" && isOwnProfile) {
      await removeFollowerInModal(user._id);
    } else if (type === "following" && isOwnProfile) {
      await unfollowUserInModal(user._id);
    } else {
      if (user.isFollowing) {
        await unfollowUserInModal(user._id);
      } else {
        await followUserInModal(user._id);
      }
    }
  };

  // Get button label based on context
  const getButtonLabel = (user) => {
    if (type === "followers" && isOwnProfile) return "Remove";
    if (type === "following" && isOwnProfile) return "Unfollow";
    return user.isFollowing ? "Following" : "Follow";
  };

  // Get button styling based on context
  const getButtonStyle = (user) => {
    if (type === "followers" && isOwnProfile) {
      return "border border-[#536471] text-white hover:border-[#f4212e] hover:bg-[#2c1116] hover:text-[#f4212e]";
    }
    if (type === "following" && isOwnProfile) {
      return "border border-[#536471] text-white hover:border-[#f4212e] hover:bg-[#2c1116] hover:text-[#f4212e]";
    }
    return user.isFollowing
      ? "border border-[#536471] text-white hover:border-[#f4212e] hover:bg-[#2c1116] hover:text-[#f4212e]"
      : "bg-white text-black hover:bg-[#d7dbdc]";
  };

  return (
    <div onClick={closeModal} className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex justify-center text-white pt-[7vh] items-start overflow-y-auto overflow-x-hidden sm:px-4">
      <div onClick={(e) => e.stopPropagation()} className="relative w-full sm:max-w-[600px] h-screen sm:h-auto sm:max-h-[80vh] sm:min-h-[200px] bg-[#101010cf] border mb-3 border-[#2f3336] rounded-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="h-[53px] flex items-center gap-5 px-4 border-b border-[#2f3336]">
          <button onClick={closeModal} className="w-9 h-9 rounded-full hover:bg-[#16181c] flex items-center justify-center transition">
            <RiCloseLine className="text-[23px] text-white" />
          </button>
          <h2 className="text-[20px] font-bold">{title}</h2>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[#2f3336]">
          <input
            type="text"
            placeholder={`Search ${title}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[44px] rounded-full bg-[#16181c] border border-[#2f3336] px-4 text-white caret-white
            focus:border-[#1d9bf0] outline-none text-[15px] placeholder:text-[#71767b]"
          />
        </div>

        {/* Users List */}
        <div className="overflow-y-auto flex-1 text-white">
          {filteredUsers.length === 0 && (
            <div className="text-center text-[#71767b] py-16 text-[15px]">No users found</div>
          )}

          {filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                navigate(`/profile/${user.username}`);
                closeModal();
              }}
              className="flex items-start justify-between gap-3 mb-[-10px] px-4 py-4 hover:bg-[#080808] transition cursor-pointer"
            >
              {/* User Info */}
              <div className="flex gap-3 min-w-0">
                <img
                  src={user.profileImageUrl || "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png"}
                  alt="profile"
                  className="w-11 h-11 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-bold truncate">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-[#71767b] text-[15px] truncate">@{user.username}</div>
                </div>
              </div>

              {/* Action Button */}
              {!user.isOwnProfile && (
                <button
                  onClick={(e) => handleAction(e, user)}
                  className={`min-w-[90px] h-[36px] rounded-full font-bold text-[14px] transition px-4 ${getButtonStyle(user)}`}
                >
                  {getButtonLabel(user)}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FollowModal;