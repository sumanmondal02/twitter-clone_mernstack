import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import EditProfileModal from "../components/EditProfileModal";
import { useAuth } from "../stores/authStore";
import { useProfile } from "../stores/profileStore";
import FollowModal from "../components/FollowModal";
import { useFollowStore } from "../stores/followStore"

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

  const {
    fetchFollowers,
    fetchFollowing,
  } = useFollowStore();

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
              onClick={() => navigate("/home")}
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
                {profileUser?.firstName}{" "}
                {profileUser?.lastName}
              </h1>

              <div className="text-[#71767b] text-[16px]">
                @{profileUser?.username}
              </div>
              { profileUser?.bio && (
                <div
                  className="
                    mt-1.5
                    text-white
                    text-[16px]
                    whitespace-pre-wrap
                    break-words
                    ml-1
                    leading-relaxed
                  "
                >
                  {profileUser.bio}
                </div>
              ) }

            </div>

            {/* JOIN DATE */}
            <div className="mt-2 text-[#71767b] text-[14.5px]">

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
            <div className="flex gap-5 mt-3">
                <div
                  onClick={async () => {

                    await fetchFollowing(
                      profile.username
                    );

                    setShowFollowing(true);

                  }}
                  className="
                    cursor-pointer
                    hover:underline
                  "
                >
                  <span className="font-bold text-white">
                    {profile.followingCount}
                  </span>

                  <span className="text-[#71767b] ml-1">
                    Following
                  </span>
                </div>

              <div
                onClick={async () => {

                  await fetchFollowers(
                    profile.username
                  );

                  setShowFollowers(true);

                }}
                className="
                  cursor-pointer
                  hover:underline
                "
              >
                <span className="font-bold text-white">
                  {profile.followerCount}
                </span>

                <span className="text-[#71767b] ml-1">
                  Followers
                </span>
              </div>

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
      {
        showFollowers && (

          <FollowModal
            title="Followers"
            type="followers"
            isOwnProfile={isOwnProfile}
            closeModal={() => setShowFollowers(false)
            }
          />

        )
      }

      {
        showFollowing && (

          <FollowModal
            title="Following"
            type="following"
            isOwnProfile={isOwnProfile}
            closeModal={() => setShowFollowing(false)
            }
          />

        )
      }

    </>
  );
}

export default Profile;