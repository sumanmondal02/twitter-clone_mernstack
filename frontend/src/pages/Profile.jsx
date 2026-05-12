import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import EditProfileModal from "../components/EditProfileModal";
import dayjs from "dayjs";
import { useAuth } from "../stores/authStore";
import { useProfile } from "../stores/profileStore";
import FollowModal from "../components/FollowModal";
import { useFollowStore } from "../stores/followStore";
import { usePost } from "../stores/postStore";
import PostCard from "../components/PostCard";
import ProfilePostsSkeleton from "../components/ProfilePostsSkeleton";

function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    profile,
    isLoading,
    profileNotFound,
    getProfile,
    isOwnProfile,
    isFollowing,
    followUser,
    unfollowUser,
  } = useProfile();
  const profileUser = profile;
  const {
    profilePosts,
    fetchProfilePosts,
    isLoadingProfilePosts,
    profilePostsFilter,
    clearProfilePosts,
    profilePostsHasMore,
    isFetchingMoreProfilePosts,
    replies,
    fetchReplies,
    isLoadingReplies,
    likedPosts,
    fetchLikedPosts,
    isLoadingLikedPosts,
    deleteComment,
    toggleLike,
  } = usePost();
  const posts = profilePosts || [];
  const observerRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Posts");
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    gender: "",
    dob: "",
    bio: "",
  });
  const originalData = {
    firstName: profileUser?.firstName || "",
    lastName: profileUser?.lastName || "",
    username: profileUser?.username || "",
    gender: profileUser?.gender || "",
    bio: profileUser?.bio || "",
    dob: profileUser?.dob ? profileUser.dob.split("T")[0] : "",
  };
  const hasChanges = JSON.stringify(editData) !== JSON.stringify(originalData);
  const { fetchFollowers, fetchFollowing } = useFollowStore();

  // Group replies by post._id so multiple replies to same post are shown together
  const groupedReplies = replies.reduce((acc, reply) => {
    const postId = reply.post?._id;
    if (!postId) return acc;
    if (!acc[postId]) {
      acc[postId] = { post: reply.post, replies: [] };
    }
    acc[postId].replies.push(reply);
    return acc;
  }, {});
  const groupedRepliesList = Object.values(groupedReplies);

  useEffect(() => {
    clearProfilePosts();
    if (username) getProfile(username);
  }, [username]);

  useEffect(() => {
    if (!username) return;
    clearProfilePosts();
    const filter = isOwnProfile ? profilePostsFilter : "active";
    fetchProfilePosts(username, filter);
  }, [username, isOwnProfile]);

  useEffect(() => {
    if (!username) return;
    if (!profilePostsHasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMoreProfilePosts) {
          fetchProfilePosts(username, profilePostsFilter);
        }
      },
      { threshold: 0.5 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [profilePostsHasMore, isFetchingMoreProfilePosts, username, profilePostsFilter]);

  useEffect(() => {
    if (activeTab === "Likes" && username && isOwnProfile) {
      fetchLikedPosts(username);
    }
  }, [activeTab, username, isOwnProfile]);

  useEffect(() => {
    if (activeTab === "Replies" && username) {
      fetchReplies(username);
    }
  }, [activeTab, username]);

  useEffect(() => {
    if (!profileUser) return;
    setEditData({
      firstName: profileUser.firstName || "",
      lastName: profileUser.lastName || "",
      username: profileUser.username || "",
      gender: profileUser.gender || "",
      bio: profileUser.bio || "",
      dob: profileUser.dob ? new Date(profileUser.dob).toISOString().split("T")[0] : "",
    });
  }, [profileUser]);

  if (profileNotFound) {
    return (
      <AppLayout>
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-white text-[32px] font-bold mb-3">
            This account doesn't exist
          </h1>
          <p className="text-[#71767b] text-[16px]">Try searching for another.</p>
        </div>
      </AppLayout>
    );
  }

  if (isLoading || !profileUser) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center text-[#71767b]">
          Loading profile...
        </div>
      </AppLayout>
    );
  }

const getLivePost = (post) => {
  return profilePosts.find(p => p._id === post._id) || post;
};

  return (
    <>
      <AppLayout>
        <div className="min-h-screen border-x border-[#2f3336]">
          {/* TOP BAR */}
          <div className="sticky top-0 z-30 backdrop-blur-md bg-black/70 px-4 py-3 flex items-center gap-5">
            <button
              onClick={() => navigate("/home")}
              className="w-10 h-10 rounded-full hover:bg-[#181818] transition flex items-center justify-center text-[24px] text-white"
            >
              ←
            </button>
            <div>
              <div className="text-[18px] font-bold text-white leading-tight">
                {profileUser?.firstName} {profileUser?.lastName}
              </div>
              <div className="text-[#71767b] text-[13px]">
                {profileUser?.posts?.length || 0} posts
              </div>
            </div>
          </div>

          {/* COVER */}
          <div className="relative">
            <img
              src="https://img.freepik.com/free-vector/realistic-spider-web-background_107791-26720.jpg?semt=ais_hybrid&w=740&q=80"
              alt="cover"
              className="w-full blur-[2px] h-[150px] sm:h-[210px] object-cover"
            />
            <img
              src={
                profileUser?.profileImageUrl ||
                "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png"
              }
              alt="profile"
              className="absolute left-4 bottom-[-60px] w-[130px] h-[130px] rounded-full border-4 border-black object-cover bg-black"
            />
          </div>

          {/* PROFILE INFO */}
          <div className="px-4 pt-[48px] pb-4">
            {/* ACTION BUTTON */}
            <div className="flex justify-end">
              {isOwnProfile ? (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="border border-[#536471] hover:bg-[#181818] transition px-4 h-[36px] rounded-full font-bold text-white"
                >
                  Edit profile
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (isFollowing) {
                      unfollowUser(profileUser._id);
                    } else {
                      followUser(profileUser._id);
                    }
                  }}
                  className={`px-5 h-[36px] rounded-full font-bold transition ${
                    isFollowing
                      ? "bg-transparent border border-[#536471] text-white hover:bg-red-950"
                      : "bg-white text-black hover:bg-[#d7dbdc]"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>

            {/* NAME */}
            <div className="mt-0.5">
              <h1 className="text-[28px] font-extrabold text-white leading-tight">
                {profileUser?.firstName} {profileUser?.lastName}
              </h1>
              <div className="text-[#71767b] text-[16px]">@{profileUser?.username}</div>
              {profileUser?.bio && (
                <div className="mt-1.5 text-white text-[16px] whitespace-pre-wrap break-words ml-1 leading-relaxed">
                  {profileUser.bio}
                </div>
              )}
            </div>

            {/* JOIN DATE */}
            <div className="mt-2 text-[#71767b] text-[14.5px]">
              Joined{" "}
              {profileUser?.createdAt
                ? new Date(profileUser.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                : "May 2026"}
            </div>

            {/* FOLLOW COUNTS */}
            <div className="flex gap-5 mt-3">
              <div
                onClick={async () => {
                  await fetchFollowing(profile.username);
                  setShowFollowing(true);
                }}
                className="cursor-pointer hover:underline"
              >
                <span className="font-bold text-white">{profileUser?.followingCount}</span>
                <span className="text-[#71767b] ml-1">Following</span>
              </div>
              <div
                onClick={async () => {
                  await fetchFollowers(profile.username);
                  setShowFollowers(true);
                }}
                className="cursor-pointer hover:underline"
              >
                <span className="font-bold text-white">{profileUser?.followerCount}</span>
                <span className="text-[#71767b] ml-1">Followers</span>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="border-t border-[#2f3336] flex relative">
            {["Posts", "Replies", ...(isOwnProfile ? ["Likes"] : [])].map((tab) => (
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

          {/* FILTER DROPDOWN */}
          {isOwnProfile && activeTab === "Posts" && (
            <div className="flex mt-2.5 px-2.5 mr-4 justify-end">
              <select
                value={profilePostsFilter}
                onChange={(e) => {
                  clearProfilePosts();
                  fetchProfilePosts(username, e.target.value);
                }}
                className="bg-black border border-[#2f3336] rounded-2xl px-3 py-2 text-[#c4cbd1] text-[14px] outline-none cursor-pointer w-fit max-w-[140px] hover:border-[#536471] transition"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="deleted">Archived</option>
              </select>
            </div>
          )}

          {/* TAB CONTENT */}
          <div className="pb-20">
            {/* POSTS TAB */}
            {activeTab === "Posts" && (
              <div>
                {isLoadingProfilePosts ? (
                  <ProfilePostsSkeleton />
                ) : posts.length === 0 ? (
                  <div className="py-16 text-center text-[#71767b]">No posts yet</div>
                ) : (
                  <div>
                    {posts.map((post) => (
                      <PostCard key={post._id} post={post} isProfileView={true} />
                    ))}
                    <div ref={observerRef} className="h-10" />
                    {isFetchingMoreProfilePosts && <ProfilePostsSkeleton />}
                  </div>
                )}
              </div>
            )}

            {/* REPLIES TAB */}
            {activeTab === "Replies" && (
              <div>
                {isLoadingReplies ? (
                  <ProfilePostsSkeleton />
                ) : groupedRepliesList.length === 0 ? (
                  <div className="py-16 text-center text-[#71767b]">No replies yet</div>
                ) : (
                  groupedRepliesList.map(({ post, replies: postReplies }) => (
                    <div key={post._id} className="border-b border-[#2f3336]">
                      {/* ORIGINAL POST */}
                      <PostCard post={getLivePost(post)} />
                      {/* ALL USER REPLIES TO THIS POST GROUPED */}
                      <div className="border-l-2 border-[#2f3336] ml-[52px] mr-4">
                        {postReplies.map((reply) => (
                          <div
                            key={reply._id}
                            className="px-4 py-3 border-b border-[#1e2124] last:border-b-0"
                          >
                            <div className="flex items-start gap-3">
                              <img
                                src={
                                  profileUser?.profileImageUrl ||
                                  "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png"
                                }
                                alt="avatar"
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-white font-semibold text-[14px]">
                                    {profileUser?.firstName} {profileUser?.lastName}
                                  </span>
                                  <span className="text-[#71767b] text-[13px]">
                                    @{profileUser?.username}
                                  </span>
                                  <span className="text-[#71767b] text-[12px]">·</span>
                                  <span className="text-[#71767b] text-[12px]">
                                    {dayjs(reply.createdAt).fromNow()}
                                  </span>
                                </div>
                                <div className="text-white text-[15px] mt-1 break-words leading-relaxed">
                                  {reply.comment}
                                </div>
                                {isOwnProfile && (
                                  <button
                                    onClick={async () => {
                                      await deleteComment(post._id, reply._id);
                                      fetchReplies(username);
                                    }}
                                    className="mt-2 text-[13px] text-[#71767b] hover:text-red-500 transition"
                                  >
                                    Delete Reply
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* LIKES TAB */}
            {activeTab === "Likes" && (
              <div>
                {isLoadingLikedPosts ? (
                  <ProfilePostsSkeleton />
                ) : likedPosts.length === 0 ? (
                  <div className="py-16 text-center text-[#71767b]">No liked posts yet</div>
                ) : (
                  likedPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </AppLayout>

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <EditProfileModal
          profileUser={profileUser}
          closeModal={() => setShowEditModal(false)}
        />
      )}

      {/* FOLLOWERS MODAL */}
      {showFollowers && (
        <FollowModal
          title="Followers"
          type="followers"
          isOwnProfile={isOwnProfile}
          closeModal={() => setShowFollowers(false)}
        />
      )}

      {/* FOLLOWING MODAL */}
      {showFollowing && (
        <FollowModal
          title="Following"
          type="following"
          isOwnProfile={isOwnProfile}
          closeModal={() => setShowFollowing(false)}
        />
      )}
    </>
  );
}

export default Profile;