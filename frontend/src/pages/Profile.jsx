import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import EditProfileModal from "../components/EditProfileModal";
import { useAuth } from "../stores/authStore";
import { useProfile } from "../stores/profileStore";

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

  // const profileUser = username === currentUser?.username ? currentUser : profile;
  const profileUser = profile;

  const posts = [];

  const [activeTab, setActiveTab] =
    useState("Posts");

  const [
    showFollowers,
    setShowFollowers,
  ] = useState(false);

  const [
    showFollowing,
    setShowFollowing,
  ] = useState(false);

  const [searchText, setSearchText] =
    useState("");

  const [
    showEditModal,
    setShowEditModal,
  ] = useState(false);

  const [editData, setEditData] =
    useState({
      firstName: "",
      lastName: "",
      username: "",
      gender: "",
      dob: "",
      bio: ""
    });

    const originalData = {
      firstName: profileUser?.firstName || "",
      lastName: profileUser?.lastName || "",
      username: profileUser?.username || "",
      gender: profileUser?.gender || "",
      bio: profileUser?.bio || "",
      dob: profileUser?.dob
        ? profileUser.dob.split("T")[0]
        : "",
    };

  const hasChanges = JSON.stringify(editData) !== JSON.stringify(originalData);

  useEffect(() => {
    if (username) getProfile(username);
  }, [username]);

  useEffect(() => {

  if (!profileUser) return;

  setEditData({
    firstName:
      profileUser.firstName || "",

    lastName:
      profileUser.lastName || "",

    username:
      profileUser.username || "",

    gender:
      profileUser.gender || "",

    bio:
      profileUser.bio || "",

    dob:
      profileUser.dob
        ? new Date(profileUser.dob)
            .toISOString()
            .split("T")[0]
        : "",
  });

}, [profileUser]);

  if (profileNotFound) {
    return (
      <AppLayout>
        <div
          className="
            min-h-screen
            flex
            flex-col
            items-center
            justify-center
            text-center
            px-6
          "
        >
          <h1
            className="
              text-white
              text-[32px]
              font-bold
              mb-3
            "
          >
            This account doesn’t exist
          </h1>
          <p
            className="
              text-[#71767b]
              text-[16px]
            "
          >
            Try searching for another.
          </p>

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

  return (
    <>
      <AppLayout>

        <div className="min-h-screen border-x border-[#2f3336]">

          {/* TOP BAR */}
          <div className="sticky top-0 z-30 backdrop-blur-md bg-black/70 px-4 py-3 flex items-center gap-5">

            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full hover:bg-[#181818] transition flex items-center justify-center text-[24px] text-white"
            >
              ←
            </button>

            <div>

              <div className="text-[18px] font-bold text-white leading-tight">
                {profileUser?.firstName}{" "}
                {profileUser?.lastName}
              </div>

              <div className="text-[#71767b] text-[13px]">
                {posts?.length || 0} posts
              </div>

            </div>

          </div>

          {/* COVER */}
          <div className="relative">

            <img
              src="https://img.freepik.com/free-vector/realistic-spider-web-background_107791-26720.jpg?semt=ais_hybrid&w=740&q=80"
              alt="cover"
              className="w-full h-[210px] object-cover"
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
            <div className="mt-1">

              <h1 className="text-[28px] font-extrabold text-white leading-tight">
                {profileUser?.firstName}{" "}
                {profileUser?.lastName}
              </h1>

              <div className="text-[#71767b] text-[16px]">
                @{profileUser?.username}
              </div>
              { profileUser?.bio && (
                <div
                  className="
                    mt-3
                    text-white
                    text-[15px]
                    whitespace-pre-wrap
                    break-words
                    leading-relaxed
                  "
                >
                  {profileUser.bio}
                </div>
              ) }

            </div>

            {/* JOIN DATE */}
            <div className="mt-4 text-[#71767b] text-[15px]">

              Joined{" "}

              {profileUser?.createdAt
                ? new Date(
                    profileUser.createdAt
                  ).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        year: "numeric",
                      }
                  )
                : "May 2026"}

            </div>

            {/* FOLLOWS */}
            <div className="flex gap-5 mt-4">

              <button
                onClick={() =>
                  setShowFollowing(true)
                }
                className="hover:underline"
              >

                <span className="font-bold text-white">
                  {
                    profileUser?.followingCount || 0
                  }
                </span>

                <span className="text-[#71767b] ml-1">
                  Following
                </span>

              </button>

              <button
                onClick={() =>
                  setShowFollowers(true)
                }
                className="hover:underline"
              >

                <span className="font-bold text-white">
                  {
                    profileUser?.followerCount || 0
                  }
                </span>

                <span className="text-[#71767b] ml-1">
                  Followers
                </span>

              </button>

            </div>

          </div>

          {/* TABS */}
          <div className="border-t border-b border-[#2f3336] flex">

            {[
              "Posts",
              "Replies",
              ...(isOwnProfile
                ? ["Likes"]
                : []),
            ].map((tab) => (

              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab)
                }
                className="flex-1 h-[53px] hover:bg-[#16181c] transition font-medium text-[15px] text-white relative"
              >

                {tab}

                {activeTab === tab && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[56px] h-1 rounded-full bg-[#1d9bf0]" />
                )}

              </button>

            ))}

          </div>

          {/* TAB CONTENT */}
          <div className="pb-20">

            {activeTab === "Posts" && (
              <div className="text-center py-16 text-[#71767b]">
                No posts yet
              </div>
            )}

            {activeTab === "Replies" && (
              <div className="text-center py-16 text-[#71767b]">
                No replies yet
              </div>
            )}

            {activeTab === "Likes" && (
              <div className="text-center py-16 text-[#71767b]">
                No liked posts yet
              </div>
            )}

          </div>

        </div>

      </AppLayout>

      {/* FOLLOWERS MODAL */}
      {showFollowers && (
        <div
          onClick={() =>
            setShowFollowers(false)
          }
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
        >

          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            className="w-full max-w-[600px] bg-black border border-[#2f3336] rounded-2xl overflow-hidden"
          >

            <div className="p-4 border-b border-[#2f3336]">

              <div className="text-[20px] font-bold">
                Followers
              </div>

              <input
                type="text"
                value={searchText}
                onChange={(e) =>
                  setSearchText(
                    e.target.value
                  )
                }
                placeholder="Search followers"
                className="mt-4 w-full bg-[#16181c] border border-[#2f3336] rounded-full px-4 h-[42px] outline-none"
              />

            </div>

            <div className="py-16 text-center text-[#71767b]">
              No followers yet
            </div>

          </div>

        </div>
      )}

      {/* FOLLOWING MODAL */}
      {showFollowing && (
        <div
          onClick={() =>
            setShowFollowing(false)
          }
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
        >

          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            className="w-full max-w-[600px] bg-black border border-[#2f3336] rounded-2xl overflow-hidden"
          >

            <div className="p-4 border-b border-[#2f3336]">

              <div className="text-[20px] font-bold">
                Following
              </div>

              <input
                type="text"
                value={searchText}
                onChange={(e) =>
                  setSearchText(
                    e.target.value
                  )
                }
                placeholder="Search following"
                className="mt-4 w-full bg-[#16181c] border border-[#2f3336] rounded-full px-4 h-[42px] outline-none"
              />

            </div>

            <div className="py-16 text-center text-[#71767b]">
              Not following anyone yet
            </div>

          </div>

        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {
        showEditModal && (

          <EditProfileModal
            profileUser={profileUser}
            closeModal={() =>
              setShowEditModal(false)
            }
          />

        )
      }

    </>
  );
}

export default Profile;