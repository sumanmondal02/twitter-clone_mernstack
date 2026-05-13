import * as s from "../styles/common";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTrendingStore } from "../stores/trendingStore";
import { useSuggestionsStore } from "../stores/suggestionsStore";
import { useAuth } from "../stores/authStore";

function RightSidebar() {
  const navigate = useNavigate();
  const { trends, fetchTrends } = useTrendingStore();
  const { suggestions, isLoading, fetchSuggestions, followUser } = useSuggestionsStore();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.isAdmin;

  useEffect(() => { fetchTrends(); }, []);
  useEffect(() => { if (!isAdmin) fetchSuggestions(); }, [isAdmin]);

  return (
    <aside className={s.rightPanel}>
      <div className={s.widgetCard}>
        <h2 className={s.widgetCardTitle}>Trending</h2>
        {trends.length === 0 ? (
          <div className="text-[#71767b] text-[13px] px-5 pb-3">No trending hashtags yet</div>
        ) : (
          trends.map(({ tag, count }) => (
            <div
              key={tag}
              onClick={() => navigate(`/explore/${tag.replace("#", "")}`)}
              className="px-3 py-2 hover:bg-[#16181c] cursor-pointer transition rounded-lg"
            >
              <div className="text-white font-bold text-[15px]">{tag}</div>
              <div className="text-[#71767b] text-[12px]">{count} {count === 1 ? "post" : "posts"}</div>
            </div>
          ))
        )}
      </div>

      {!isAdmin && (
        <div className={s.widgetCard}>
          <h2 className={s.widgetCardTitle}>Who to follow</h2>
          {isLoading ? (
            <div className="text-[#71767b] text-[13px] px-5 pb-3">Loading...</div>
          ) : suggestions.length === 0 ? (
            <div className="text-[#71767b] text-[13px] px-5 pb-3">No suggestions</div>
          ) : (
            suggestions.slice(0, 3).map((user) => (
              <div key={user._id} className="flex items-center justify-between gap-3 px-3 py-2 hover:bg-[#16181c] transition rounded-lg">
                <div className="flex items-center gap-2 min-w-0 cursor-pointer" onClick={() => navigate(`/profile/${user.username}`)}>
                  <img
                    src={user.profileImageUrl || "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png"}
                    alt="profile"
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-white font-bold text-[13px] truncate">{user.firstName} {user.lastName}</div>
                    <div className="text-[#71767b] text-[12px] truncate">@{user.username}</div>
                  </div>
                </div>
                <button
                  onClick={() => followUser(user._id)}
                  className="bg-white text-black text-[12px] font-bold px-3 h-[28px] rounded-full hover:bg-[#d7dbdc] transition shrink-0"
                >
                  Follow
                </button>
              </div>
            ))
          )}
        </div>
      )}

      <div className="text-[#71767b] text-[13px] leading-5 px-3 pt-4 pb-1 flex flex-wrap gap-x-3 gap-y-1">
        <span className="hover:underline cursor-pointer" onClick={() => navigate("/terms")}>Terms</span>
        <span className="hover:underline cursor-pointer" onClick={() => navigate("/privacy")}>Privacy</span>
        <span className="hover:underline cursor-pointer" onClick={() => navigate("/cookies")}>Cookies</span>
      </div>
      <span className="text-[#71767b] text-[12px] px-3">© 2026 X Clone. Built with React, Node.js, and MongoDB.</span>
    </aside>
  );
}

export default RightSidebar;