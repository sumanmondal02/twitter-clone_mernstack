import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../stores/authStore";
import PostCard from "../components/PostCard";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const API = import.meta.env.VITE_URL;
const opts = { withCredentials: true };

function AdminDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("Stats");
  const [isLoading, setIsLoading] = useState(false);
  const [userFilter, setUserFilter] = useState("all");
  const [searchQ, setSearchQ] = useState("");

  useEffect(() => { fetchStats(); }, []);

  useEffect(() => {
    if (activeTab === "Users") fetchUsers();
    if (activeTab === "Posts") fetchPosts();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/admin-api/stats`, opts);
      setStats(res.data.payload);
    } catch (err) { console.log(err); }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API}/admin-api/users`, opts);
      setUsers(res.data.payload || []);
    } catch (err) { console.log(err); }
    finally { setIsLoading(false); }
  };

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API}/admin-api/posts`, opts);
      setPosts(res.data.payload || []);
    } catch (err) { console.log(err); }
    finally { setIsLoading(false); }
  };

  const blockUser = async (id) => {
    try {
      await axios.patch(`${API}/admin-api/users/${id}/block`, {}, opts);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isBlocked: true } : u));
      fetchStats();
      toast.success("User blocked");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const unblockUser = async (id) => {
    try {
      await axios.patch(`${API}/admin-api/users/${id}/unblock`, {}, opts);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isBlocked: false } : u));
      fetchStats();
      toast.success("User unblocked");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const deletePost = async (id) => {
    if (!window.confirm("Permanently delete this post? Cannot be recovered.")) return;
    try {
      await axios.delete(`${API}/admin-api/posts/${id}`, opts);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      fetchStats();
      toast.success("Post permanently deleted");
    } catch (err) { toast.error("Failed to delete post"); }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch = `${u.firstName} ${u.lastName} ${u.username} ${u.email}`
      .toLowerCase().includes(searchQ.toLowerCase());
    if (!matchSearch) return false;
    if (userFilter === "active") return !u.isBlocked && !u.isDeactivated;
    if (userFilter === "blocked") return u.isBlocked;
    if (userFilter === "deactivated") return u.isDeactivated;
    return true;
  });

  const tabs = ["Stats", "Users", "Posts"];

  return (
    <AppLayout>
      <div className="min-h-screen border-x border-[#2f3336]">

        {/* TOP BAR */}
        <div className="sticky top-0 z-30 backdrop-blur-md bg-black/70 px-4 py-3 flex items-center gap-3 border-b border-[#2f3336]">
          <div className="text-white font-bold text-[18px]">Admin Dashboard</div>
          <span className="text-[10px] bg-[#1d9bf0] text-white px-2 py-0.5 rounded-full font-bold tracking-wide">ADMIN</span>
        </div>

        {/* TABS */}
        <div className="flex border-b border-[#2f3336]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 h-[53px] hover:bg-[#16181c] transition font-medium text-[15px] text-white relative"
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[56px] h-1 rounded-full bg-[#1d9bf0]" />
              )}
            </button>
          ))}
        </div>

        <div className="pb-20">

          {/* STATS TAB */}
          {activeTab === "Stats" && (
            <div className="p-4 grid grid-cols-2 gap-4">
              {[
                { label: "Total Users", value: stats?.totalUsers, color: "text-[#1d9bf0]" },
                { label: "Active Users", value: stats?.activeUsers, color: "text-[#00ba7c]" },
                { label: "Blocked Users", value: stats?.blockedUsers, color: "text-red-500" },
                { label: "Deactivated", value: stats?.deactivatedUsers, color: "text-yellow-500" },
                { label: "Total Posts", value: stats?.totalPosts, color: "text-[#1d9bf0]" },
                { label: "Archived Posts", value: stats?.deletedPosts, color: "text-[#71767b]" },
              ].map(({ label, value, color }) => (
                <div key={label} className="border border-[#2f3336] rounded-2xl p-4 bg-[#16181c]/40">
                  <div className={`text-[28px] font-extrabold ${color}`}>{value ?? "—"}</div>
                  <div className="text-[#71767b] text-[13px] mt-1">{label}</div>
                </div>
              ))}
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === "Users" && (
            <div>
              {/* SEARCH + FILTER ROW */}
              <div className="px-4 py-3 border-b border-[#2f3336] flex gap-3 items-center">
                <input
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Search users..."
                  className="flex-1 h-[40px] rounded-full bg-[#16181c] border border-[#2f3336] focus:border-[#1d9bf0] px-4 text-white text-[14px] placeholder:text-[#71767b] outline-none transition"
                />
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="h-[40px] rounded-full bg-[#16181c] border border-[#2f3336] px-3 text-[#c4cbd1] text-[13px] outline-none cursor-pointer hover:border-[#536471] transition"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                  <option value="deactivated">Deactivated</option>
                </select>
              </div>

              {isLoading ? (
                <div className="text-center text-[#71767b] py-8">Loading...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center text-[#71767b] py-12 text-[14px]">No users found</div>
              ) : (
                filteredUsers.map((user) => (
                  <div key={user._id} className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#1e2124] hover:bg-[#080808] transition">
                    <div
                      className="flex items-center gap-3 min-w-0 cursor-pointer"
                      onClick={() => navigate(`/profile/${user.username}`)}
                    >
                      <img
                        src={user.profileImageUrl || "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png"}
                        alt="profile"
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-white font-bold text-[14px] flex items-center gap-2 flex-wrap">
                          {user.firstName} {user.lastName}
                          {user.isBlocked && (
                            <span className="text-[10px] font-bold bg-red-950 text-red-400 border border-red-900 px-2 py-0.5 rounded-full">Blocked</span>
                          )}
                          {user.isDeactivated && (
                            <span className="text-[10px] font-bold bg-yellow-950 text-yellow-400 border border-yellow-900 px-2 py-0.5 rounded-full">Deactivated</span>
                          )}
                        </div>
                        <div className="text-[#71767b] text-[12px] truncate">@{user.username} · {user.email}</div>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {user.isBlocked ? (
                        <button
                          onClick={() => unblockUser(user._id)}
                          className="px-3 h-[30px] rounded-full text-[12px] font-bold border border-[#536471] text-white hover:border-[#1d9bf0] hover:text-[#1d9bf0] transition"
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => blockUser(user._id)}
                          className="px-3 h-[30px] rounded-full text-[12px] font-bold border border-[#536471] text-white hover:border-red-500 hover:text-red-500 transition"
                        >
                          Block
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* POSTS TAB */}
          {activeTab === "Posts" && (
            <div>
              {isLoading ? (
                <div className="text-center text-[#71767b] py-8">Loading...</div>
              ) : posts.length === 0 ? (
                <div className="text-center text-[#71767b] py-12 text-[14px]">No posts found</div>
              ) : (
                posts.map((post) => (
                  <AdminPostRow key={post._id} post={post} onDelete={deletePost} onNavigate={navigate} />
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </AppLayout>
  );
}

// Separate admin post row — X-style, no emoji, proper badges
function AdminPostRow({ post, onDelete, onNavigate }) {
  return (
    <article className="border-b border-[#2f3336] px-4 py-3 hover:bg-[#080808] transition">
      {/* HEADER ROW */}
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex items-center gap-3 min-w-0 cursor-pointer"
          onClick={() => onNavigate(`/profile/${post.userId?.username}`)}
        >
          <img
            src={post.userId?.profileImageUrl || "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png"}
            className="w-10 h-10 rounded-full object-cover shrink-0"
            alt="profile"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-bold text-[14px] hover:underline cursor-pointer">
                {post.userId?.firstName} {post.userId?.lastName}
              </span>
              {post.isDeleted && (
                <span className="text-[10px] font-bold bg-red-950 text-red-400 border border-red-900 px-2 py-0.5 rounded-full">Archived</span>
              )}
              {!post.isPublished && !post.isDeleted && (
                <span className="text-[10px] font-bold bg-yellow-950 text-yellow-400 border border-yellow-900 px-2 py-0.5 rounded-full">Scheduled</span>
              )}
            </div>
            <div className="text-[#71767b] text-[12px]">
              @{post.userId?.username} · {dayjs(post.createdAt).fromNow()}
            </div>
          </div>
        </div>

        <button
          onClick={() => onDelete(post._id)}
          className="px-3 h-[30px] rounded-full text-[12px] font-bold border border-red-900 text-red-500 hover:bg-red-950 transition shrink-0"
        >
          Delete
        </button>
      </div>

      {/* BODY */}
      {post.description && (
        <div className="text-white text-[15px] mt-2 leading-relaxed break-words">{post.description}</div>
      )}

      {/* MEDIA */}
      {post.mediaUrl && (
        <img src={post.mediaUrl} className="mt-2 rounded-2xl max-h-[220px] w-full object-cover" alt="post media" />
      )}

      {/* STATS */}
      <div className="flex gap-5 mt-3 text-[#71767b] text-[13px]">
        <span>{post.likeCount || 0} likes</span>
        <span>{post.commentCount || 0} replies</span>
        {post.isEdited && <span>Edited</span>}
      </div>
    </article>
  );
}

export default AdminDashboard;