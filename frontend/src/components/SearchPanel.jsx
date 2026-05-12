import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSearchStore } from "../stores/searchStore";
import { useAuth } from "../stores/authStore";
import { RiCloseLine } from "react-icons/ri";

const API = import.meta.env.VITE_URL;

function SearchPanel({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { results, isSearching, query, setQuery, searchUsers, clearSearch } = useSearchStore();
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 200);
    else clearSearch();
  }, [isOpen]);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchUsers(val), 350);
  };

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
    onClose();
    clearSearch();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 z-[998] bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* DESKTOP PANEL */}
      <div className="
        hidden sm:flex
        fixed top-0 left-0 z-[999]
        h-full w-[420px]
        bg-[#0a0a0a]/85 backdrop-blur-md
        border-r border-[#2f3336]
        flex-col rounded-r-2xl
        animate-slide-in
      ">
        {/* HEADER */}
        <div className="flex flex-col px-4 pt-4 pb-3 border-b border-[#2f3336] gap-3">

          {/* X BUTTON */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-[#16181c] flex items-center justify-center transition self-start"
          >
            <RiCloseLine className="text-[22px] text-white" />
          </button>

          {/* SEARCH BAR */}
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              value={query}
              onChange={handleChange}
              placeholder="Search people..."
              className="
                w-full h-[40px] rounded-full
                bg-[#16181c]/60
                border border-[#2f3336]
                focus:border-[#1d9bf0]
                pl-4 pr-10 text-white text-[15px]
                placeholder:text-[#71767b]
                outline-none transition
              "
            />
            {query && (
              <button
                onClick={() => { setQuery(""); clearSearch(); inputRef.current?.focus(); }}
                className="absolute right-3 text-[#71767b] hover:text-white transition"
              >
                <RiCloseLine className="text-[18px]" />
              </button>
            )}
          </div>
        </div>

        {/* RESULTS */}
        <div className="flex-1 overflow-y-auto">
          {isSearching && (
            <div className="text-center text-[#71767b] py-8 text-[14px]">Searching...</div>
          )}
          {!isSearching && query && results.length === 0 && (
            <div className="text-center text-[#71767b] py-8 text-[14px]">No results for "{query}"</div>
          )}
          {!isSearching && !query && (
            <div className="text-center text-[#71767b] py-8 text-[14px]">Search by name or username</div>
          )}
          {results.map((user) => (
            <SearchUserCard key={user._id} user={user} currentUser={currentUser} onUserClick={handleUserClick} />
          ))}
        </div>
      </div>

      {/* MOBILE PANEL — bottom sheet */}
      <div className="
        sm:hidden
        fixed bottom-0 left-0 right-0 z-[999]
        h-[70vh]
        bg-[#0a0a0a]/90 backdrop-blur-md
        border-t border-[#2f3336]
        rounded-t-3xl
        flex flex-col
        animate-slide-up
      ">
        {/* DRAG HANDLE */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#2f3336]" />
        </div>

        {/* HEADER */}
        <div className="flex items-center gap-3 px-4 pt-2 pb-3 border-b border-[#2f3336]">
          <div className="relative flex-1 flex items-center">
            <input
              ref={inputRef}
              value={query}
              onChange={handleChange}
              placeholder="Search people..."
              className="
                w-full h-[40px] rounded-full
                bg-[#16181c]/60
                border border-[#2f3336]
                focus:border-[#1d9bf0]
                pl-4 pr-10 text-white text-[15px]
                placeholder:text-[#71767b]
                outline-none transition
              "
            />
            {query && (
              <button
                onClick={() => { setQuery(""); clearSearch(); inputRef.current?.focus(); }}
                className="absolute right-3 text-[#71767b] hover:text-white transition"
              >
                <RiCloseLine className="text-[18px]" />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-[#16181c] flex items-center justify-center transition shrink-0"
          >
            <RiCloseLine className="text-[22px] text-white" />
          </button>
        </div>

        {/* RESULTS */}
        <div className="flex-1 overflow-y-auto">
          {isSearching && (
            <div className="text-center text-[#71767b] py-8 text-[14px]">Searching...</div>
          )}
          {!isSearching && query && results.length === 0 && (
            <div className="text-center text-[#71767b] py-8 text-[14px]">No results for "{query}"</div>
          )}
          {!isSearching && !query && (
            <div className="text-center text-[#71767b] py-8 text-[14px]">Search by name or username</div>
          )}
          {results.map((user) => (
            <SearchUserCard key={user._id} user={user} currentUser={currentUser} onUserClick={handleUserClick} />
          ))}
        </div>
      </div>
    </>
  );
}

function SearchUserCard({ user, currentUser, onUserClick }) {
  const isOwnProfile = user.isOwnProfile || user._id?.toString() === currentUser?.id?.toString();

  return (
    <div
      onClick={() => onUserClick(user.username)}
      className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-[#ffffff08] cursor-pointer transition border-b border-[#1e2124]"
    >
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={user.profileImageUrl || "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png"}
          alt="profile"
          className="w-11 h-11 rounded-full object-cover shrink-0"
        />
        <div className="min-w-0">
          <div className="text-white font-bold text-[14px] truncate">{user.firstName} {user.lastName}</div>
          <div className="text-[#71767b] text-[13px] truncate">@{user.username}</div>
          {user.bio && <div className="text-[#71767b] text-[12px] truncate mt-0.5">{user.bio}</div>}
        </div>
      </div>
      {!isOwnProfile && (
        <div onClick={(e) => e.stopPropagation()} className="shrink-0">
          <FollowButtonInSearch user={user} />
        </div>
      )}
    </div>
  );
}

function FollowButtonInSearch({ user }) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [loading, setLoading] = useState(false);

  const toggle = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      if (isFollowing) {
        await axios.delete(`${API}/user-api/unfollow/${user._id}`, { withCredentials: true });
        setIsFollowing(false);
      } else {
        await axios.post(`${API}/user-api/follow/${user._id}`, {}, { withCredentials: true });
        setIsFollowing(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`px-4 h-[32px] rounded-full font-bold text-[13px] transition disabled:opacity-50 ${
        isFollowing
          ? "border border-[#536471] text-white hover:border-red-500 hover:text-red-500"
          : "bg-white text-black hover:bg-[#d7dbdc]"
      }`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}

export default SearchPanel;