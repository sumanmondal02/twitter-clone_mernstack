import { useEffect, useState } from "react";

import {
  RiCloseLine,
  RiEyeLine,
  RiEyeOffLine,
} from "react-icons/ri";

import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../stores/authStore";
import { useProfile } from "../stores/profileStore";
import * as s from "../styles/common";
import { useNavigate } from "react-router-dom";

import CustomDatePicker from "./CustomDatePicker";

function EditProfileModal({
  profileUser,
  closeModal,
}) {

  const API = import.meta.env.VITE_URL;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] =
    useState("basic");

  const [isSaving, setIsSaving] =
    useState(false);

    const [showCurrentPassword,
setShowCurrentPassword] =
useState(false);

const [showNewPassword,
setShowNewPassword] =
useState(false);

  const [preview, setPreview] =
    useState("");

  const [profileImageFile, setProfileImageFile] =
    useState(null);

  const [editData, setEditData] =
    useState({
      firstName: "",
      lastName: "",
      username: "",
      bio: "",
      gender: "",
      dob: "",
      email: "",
      removeProfileImage: false,
    });

  const [passwordData, setPasswordData] =
    useState({
      currentPassword: "",
      newPassword: "",
    });

  const { updateCurrentUser } = useAuth();
  const { setProfile } = useProfile();

  useEffect(() => {

    if (!profileUser) return;

    setPreview(
      profileUser.profileImageUrl || ""
    );

    setEditData({
      firstName:
        profileUser.firstName || "",

      lastName:
        profileUser.lastName || "",

      username:
        profileUser.username || "",

      bio:
        profileUser.bio || "",

      gender:
        profileUser.gender || "",

      dob:
        profileUser.dob || "",

      email:
        profileUser.email || "",

      removeProfileImage: false,
    });

  }, [profileUser]);

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setProfileImageFile(file);

    const imageUrl =
      URL.createObjectURL(file);

    setPreview(imageUrl);

    setEditData({
      ...editData,
      removeProfileImage: false,
    });

  };

  const removeProfileImage = () => {

    setPreview("");

    setProfileImageFile(null);

    setEditData({
      ...editData,
      removeProfileImage: true,
    });

  };

  const handleSaveProfile = async () => {

    try {

      setIsSaving(true);

      const formData = new FormData();

      formData.append(
        "firstName",
        editData.firstName
      );

      formData.append(
        "lastName",
        editData.lastName
      );

      formData.append(
        "username",
        editData.username
      );

      formData.append(
        "bio",
        editData.bio
      );

      formData.append(
        "gender",
        editData.gender
      );

      formData.append(
        "dob",
        editData.dob
      );

      formData.append(
        "removeProfileImage",
        editData.removeProfileImage
      );

      if (profileImageFile) {

        formData.append(
          "profileImageUrl",
          profileImageFile
        );

      }

      const res = await axios.put(
        `${API}/user-api/updateProfile`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      updateCurrentUser(res.data.payload);

      setProfile(res.data.payload);
      navigate(`/profile/${res.data.payload.username}`);

      toast.success(
        res.data.message ||
        "Profile updated successfully"
      );

      closeModal();

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Failed to update profile"
      );

    } finally {

      setIsSaving(false);

    }

  };

  const handlePasswordChange =
    async () => {

    try {

      if (
        !passwordData.currentPassword ||
        !passwordData.newPassword
      ) {

        return toast.error(
          "Please fill all password fields"
        );

      }

      const res = await axios.put(
        `${API}/auth/change-password`,
        passwordData,
        {
          withCredentials: true,
        }
      );

      toast.success(
        res.data.message ||
        "Password updated successfully"
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
      });

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Failed to update password"
      );

    }

  };

  const handleDeactivate = async () => {

  const confirmDeactivate =
    window.confirm(
      "Are you sure you want to deactivate your account?"
    );

  if (!confirmDeactivate) return;

  const password = prompt(
    "Enter your password to deactivate account"
  );

  if (!password) return;

  try {

    const res = await axios.put(
      `${API}/user-api/deactivate`,
      { password },
      {
        withCredentials: true,
      }
    );

    toast.success(
      res.data.message ||
      "Account deactivated"
    );

    localStorage.removeItem(
      "currentUser"
    );

    window.location.href = "/login";

  } catch (err) {

    toast.error(
      err.response?.data?.message ||
      "Failed to deactivate account"
    );

  }

};

  return (

    <div
      onClick={closeModal}
      className={s.editModalOverlay}
    >

      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className="
          bg-black
          border
          border-[#2f3336]
          rounded-2xl
          w-full
          max-w-[920px]
          h-[90vh]
          overflow-hidden
          flex
          flex-col
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            px-4
            py-3
            border-b
            border-[#2f3336]
          "
        >

          <button
            type="button"
            onClick={closeModal}
            className={s.modalClose}
          >

            <RiCloseLine
              className="
                text-white
                text-[24px]
              "
            />

          </button>

          <button
            onClick={
              activeTab === "basic"
                ? handleSaveProfile
                : handlePasswordChange
            }
            disabled={isSaving}
            className="
              bg-white
              text-black
              px-5
              h-[36px]
              rounded-full
              font-bold
              hover:bg-[#d7dbdc]
              transition
            "
          >
            {
              isSaving
                ? "Saving..."
                : "Save"
            }
          </button>

        </div>

        {/* BODY */}

        <div
          className="
            flex
            flex-1
            overflow-hidden
          "
        >

          {/* LEFT TABS */}

          <div
            className="
              w-[220px]
              border-r
              border-[#2f3336]
              shrink-0
              hidden
              md:block
            "
          >

            <button
              onClick={() =>
                setActiveTab("basic")
              }
              className={`
                w-full
                text-left
                px-6
                py-5
                text-[18px]
                transition
                border-b
                border-[#2f3336]

                ${
                  activeTab === "basic"
                  ? "bg-[#16181c] font-bold text-white"
                  : "hover:bg-[#0f0f0f] text-[#71767b]"
                }
              `}
            >
              Basic details
            </button>

            <button
              onClick={() =>
                setActiveTab("password")
              }
              className={`
                w-full
                text-left
                px-6
                py-5
                text-[18px]
                transition

                ${
                  activeTab === "password"
                    ? "bg-[#16181c] font-bold text-white"
                    : "hover:bg-[#0f0f0f] text-[#71767b]"
                }
              `}
            >
              Change password
            </button>

          </div>

          {/* RIGHT CONTENT */}

          <div
            className="
              flex-1
              overflow-y-auto
              p-5
            "
          >

            {/* MOBILE TABS */}

            <div className="flex md:hidden mb-5">

              <button
                onClick={() =>
                  setActiveTab("basic")
                }
                className={`
                  flex-1
                  h-[44px]
                  rounded-l-full
                  border
                  border-[#2f3336]

                  ${
                    activeTab === "basic"
                      ? "bg-white text-black font-bold"
                      : "bg-black text-white"
                  }
                `}
              >
                Basic
              </button>

              <button
                onClick={() =>
                  setActiveTab("password")
                }
                className={`
                  flex-1
                  h-[44px]
                  rounded-r-full
                  border
                  border-[#2f3336]

                  ${
                    activeTab === "password"
                      ? "bg-white text-black font-bold"
                      : "bg-black text-white"
                  }
                `}
              >
                Password
              </button>

            </div>

            {/* BASIC DETAILS */}

            {
              activeTab === "basic" && (

                <div className="space-y-5">

                  {/* PROFILE IMAGE */}

                  <div className="flex flex-col items-center gap-4">

                    <img
                      src={
                        preview ||

                        "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png"
                      }
                      alt="profile"
                      className="
                        w-[110px]
                        h-[110px]
                        rounded-full
                        object-cover
                        border-4
                        border-black
                      "
                    />

                    <div className="
                      flex
                      items-center
                      gap-4
                      flex-wrap
                      justify-center
                    ">

                      <label
                        className="
                          bg-[#1d9bf0]
                          hover:bg-[#1a8cd8]
                          text-white
                          px-5
                          py-2
                          rounded-full
                          cursor-pointer
                          transition
                          text-sm
                          font-medium
                        "
                      >

                        Change Photo

                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />

                      </label>

                      {
                        preview && (

                          <button
                            type="button"
                            onClick={
                              removeProfileImage
                            }
                            className="
                              text-red-500
                              hover:underline
                              text-sm
                            "
                          >
                            Remove Photo
                          </button>

                        )
                      }

                    </div>

                  </div>

                  {/* FIRST + LAST */}

                  <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-5
                  ">

                    <div className={s.authInputWrap}>

                      <label className={s.authInputLabel}>
                        First Name
                      </label>

                      <input
                        value={editData.firstName}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            firstName:
                              e.target.value,
                          })
                        }
                        className={s.authInputField}
                      />

                    </div>

                    <div className={s.authInputWrap}>

                      <label className={s.authInputLabel}>
                        Last Name
                      </label>

                      <input
                        value={editData.lastName}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            lastName:
                              e.target.value,
                          })
                        }
                        className={s.authInputField}
                      />

                    </div>

                  </div>

                  {/* USERNAME */}

                  <div className={s.authInputWrap}>

                    <label className={s.authInputLabel}>
                      Username
                    </label>

                    <input
                      value={editData.username}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          username:
                            e.target.value,
                        })
                      }
                      className={s.authInputField}
                    />

                  </div>

                  {/* EMAIL */}

                  <div className={s.authInputWrap}>

                    <label className={s.authInputLabel}>
                      Email
                    </label>

                    <input
                      disabled
                      value={editData.email}
                      className={`${s.authInputField} opacity-60 cursor-not-allowed`}
                    />

                  </div>

                  {/* BIO */}

                  <div className={s.authInputWrap}>

                    <label className={s.authInputLabel}>
                      Bio
                    </label>

                    <textarea
                      value={editData.bio}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          bio:
                            e.target.value,
                        })
                      }
                      placeholder="Tell the world about yourself..."
                      className="
                        w-full
                        bg-black
                        border
                        border-[#2f3336]
                        rounded-xl
                        px-4
                        pt-6
                        pb-4
                        min-h-[120px]
                        outline-none
                        text-white
                        focus:border-[#1d9bf0]
                        resize-none
                      "
                    />

                  </div>

                  {/* GENDER + DOB */}

                  <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-5
                  ">

                    <div className={s.authInputWrap}>

                      <label className={s.authInputLabel}>
                        Gender
                      </label>

                      <select
                        value={editData.gender}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            gender:
                              e.target.value,
                          })
                        }
                        className={`${s.authInputField} appearance-none`}
                      >

                        <option
                          value=""
                          disabled
                          hidden
                        >
                          Select Gender
                        </option>

                        <option value="male">
                          Male
                        </option>

                        <option value="female">
                          Female
                        </option>

                      </select>

                    </div>

                    <CustomDatePicker
                      value={editData.dob}
                      onChange={(date) =>
                        setEditData({
                          ...editData,
                          dob: date,
                        })
                      }
                    />

                  </div>

                </div>

              )
            }

            {/* PASSWORD TAB */}

{
  activeTab === "password" && (

    <div className="space-y-5">

      {/* CURRENT PASSWORD */}

      <div className={s.authInputWrap}>

        <label className={s.authInputLabel}>
          Current Password
        </label>

        <div className="relative">

          <input
            type={
              showCurrentPassword
                ? "text"
                : "password"
            }
            value={
              passwordData.currentPassword
            }
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                currentPassword:
                  e.target.value,
              })
            }
            className={`${s.authInputField} pr-12`}
          />

          <button
            type="button"
            onClick={() =>
              setShowCurrentPassword(
                !showCurrentPassword
              )
            }
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-[#71767b]
              text-[18px]
            "
          >

            {
              showCurrentPassword
                ? <RiEyeOffLine />
                : <RiEyeLine />
            }

          </button>

        </div>

      </div>

      {/* NEW PASSWORD */}

      <div className={s.authInputWrap}>

        <label className={s.authInputLabel}>
          New Password
        </label>

        <div className="relative">

          <input
            type={
              showNewPassword
                ? "text"
                : "password"
            }
            value={
              passwordData.newPassword
            }
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                newPassword:
                  e.target.value,
              })
            }
            className={`${s.authInputField} pr-12`}
          />

          <button
            type="button"
            onClick={() =>
              setShowNewPassword(
                !showNewPassword
              )
            }
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-[#71767b]
              text-[18px]
            "
          >

            {
              showNewPassword
                ? <RiEyeOffLine />
                : <RiEyeLine />
            }

          </button>

        </div>

      </div>

      {/* DEACTIVATE ACCOUNT */}

      <div
        className="
          mt-10
          border-t
          border-[#2f3336]
          pt-8
        "
      >

        <h2
          className="
            text-red-500
            font-bold
            text-[20px]
            mb-3
          "
        >
          Deactivate account
        </h2>

        <p
          className="
            text-[#71767b]
            text-sm
            leading-relaxed
            mb-5
          "
        >
          If you deactivate your account,
          your profile will not be visible
          to anyone until you log in again
          and reactivate it.
        </p>

        <button
          type="button"
          onClick={handleDeactivate}
          className="
            bg-red-500
            hover:bg-red-600
            transition
            text-white
            px-5
            py-3
            rounded-full
            font-bold
          "
        >
          Deactivate Account
        </button>

      </div>

    </div>

  )
}

          </div>

        </div>

      </div>

    </div>

  );
}

export default EditProfileModal;