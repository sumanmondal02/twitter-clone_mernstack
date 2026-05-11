import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiTwitterXFill, RiCloseLine, RiEyeLine, RiEyeOffLine, } from "react-icons/ri";
import * as s from "../styles/common";
import { useAuth } from "../stores/authStore";
import CustomDatePicker from "../components/CustomDatePicker";
import ImageCropModal from "../components/ImageCropModal";
import getCroppedImg from "../lib/cropImage";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();
  const {
    register,
    isRegistering,
    error,
    clearError,
  } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    gender: "",
    dob: "",
    profileImageUrl: null,
  });

  const [croppedAreaPixels,setCroppedAreaPixels] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    clearError();
    if (name === "profileImageUrl") {
      setFormData({ ...formData, profileImageUrl: files[0] });
      const imageUrl = URL.createObjectURL(files[0]);
      setPreview(imageUrl);
      return;
    }
    setFormData({ ...formData, [name]: value,});
  };

  const removeImage = () => {
    setFormData({ ...formData, profileImageUrl: null });
    setPreview(null);
    setCroppedAreaPixels(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let croppedFile = formData.profileImageUrl;
    if (preview && croppedAreaPixels) {
      const croppedBlob =
        await getCroppedImg(
          preview,
          croppedAreaPixels
        );
      croppedFile = new File(
        [croppedBlob],
        "cropped.jpg",
        {
          type: "image/jpeg",
        }
      );
    }
    const data = new FormData();
    Object.entries(formData).forEach(
  ([key, value]) => {

    if (
      key !== "profileImageUrl" &&
      value !== null &&
      value !== ""
    ) {

      data.append(key, value);

    }

  }
);

if (croppedFile) {

  data.append(
    "profileImageUrl",
    croppedFile
  );

}
    
    const res = await register(data);
    if (res.success) {
        toast.success("Account created successfully!\nRedirecting to login page in 3 seconds...");
        clearError();
        setTimeout(() => { window.location.href = "/login"; }, 1870);
      } else {
        toast.error(res.message);
      }};

  return (
    <div className={s.modalOverlay}>
      <div className={s.modalBox}>
        <div className={s.modalHeader}>
          <button className={s.modalClose} onClick={() => navigate("/")}>
            <RiCloseLine className="leading-none translate-y-1px" />
          </button>
          <div className="flex-1 flex justify-center -ml-9">
            <RiTwitterXFill className="text-white text-[28px]" />
          </div>
        </div>
        <div className="px-20 pt-4 pb-10 max-md:px-8">
          <h1 className="text-[31px] font-bold text-[#e7e9ea] mb-8">
            Create your account
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              <div className={s.authInputWrap}>
                <label className={s.authInputLabel}>
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={s.authInputField}
                  required
                />
              </div>
              <div className={s.authInputWrap}>
                <label className={s.authInputLabel}>
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={s.authInputField}
                />
              </div>
            </div>
            <div className={s.authInputWrap}>
              <label className={s.authInputLabel}>
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={s.authInputField}
                required
              />
            </div>
            <div className={s.authInputWrap}>
              <label className={s.authInputLabel}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={s.authInputField}
                required
              />
            </div>
            <div className={s.authInputWrap}>
              <label className={s.authInputLabel}>
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`${s.authInputField} pr-12`}
                required
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71767b] text-[18px]"
              >
                {
                  showPassword? <RiEyeOffLine /> : <RiEyeLine />
                }
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              <div className={s.authInputWrap}>
                <label className={s.authInputLabel}>
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`${s.authInputField} appearance-none`}
                >
                  <option value="" disabled hidden>
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
                value={formData.dob}
                onChange={(date) => {
                  setFormData({ ...formData, dob: date });
                }}/>
            </div>
            <div className="space-y-4">
              <label className="text-[#71767b] text-[15px] block">
                Profile Image
              </label>
              <div className="flex items-center gap-5 mt-2 flex-wrap">
                <label className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white px-5 py-2 rounded-full cursor-pointer transition font-medium text-sm whitespace-nowrap">
                  Choose Image
                  <input
                    type="file"
                    name="profileImageUrl"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
                {
                  formData.profileImageUrl && (
                    <div className="flex items-center gap-3">
                      <span className="text-[#e7e9ea] text-sm truncate max-w-45">
                        {formData.profileImageUrl.name}
                      </span>
                      <button type="button" onClick={removeImage} className="text-red-500 text-sm hover:underline">
                        Remove
                      </button>
                    </div>
                  )
                }
              </div>
              {
                preview && (
                  <ImageCropModal image={preview} setCroppedAreaPixels={
                    setCroppedAreaPixels
                  } />
                )}
            </div>
            {error && (
              <div className={s.errorAlert}>
                {error}
              </div>
            )}
            <button type="submit" disabled={isRegistering} className={s.authNextBtn}>
              {
                isRegistering? "Creating account...": "Create account"
              }
            </button>
          </form>
          <div className="mt-8 text-center text-[#71767b] text-[15px]">
            Already have an account?
            <button onClick={() => navigate("/login")} className="text-[#1d9bf0] ml-2 hover:underline">
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Register;