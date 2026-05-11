import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiTwitterXFill, RiCloseLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import toast from "react-hot-toast";
import * as s from "../styles/common";
import axios from "axios";
import { useAuth } from "../stores/authStore";

function Login() {
  const navigate = useNavigate();
  const { login, currentUser, isLoggingIn, error, clearError } = useAuth();
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [showReactivate, setShowReactivate] =
  useState(false);

const [isReactivating, setIsReactivating] =
  useState(false);
  const API = import.meta.env.VITE_URL;

  useEffect(() => {
    if (currentUser) {
      navigate("/home");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (error) setLocalError(error);
  }, [error]);

  const handleBack = () => {

  setStep(1);

  setPassword("");

  setLocalError("");

  setShowReactivate(false);

  clearError();

};

  // accepts email OR username (backend handles both)
  const handleNext = (e) => {
    e.preventDefault();
    const value = identifier.trim();

    if (!value) {
      setLocalError("Please enter your phone, email, or username.");
      return;
    }

    // Only validate email format if they typed an @
    if (value.includes("@") && !/\S+@\S+\.\S+/.test(value)) {
      setLocalError("Please enter a valid email address.");
      return;
    }
    clearError();
    setLocalError("");
    setStep(2);
  };

  const handleLogin = async (e) => {

  e.preventDefault();

  if (!password.trim()) {

    setLocalError(
      "Please enter your password."
    );

    return;
  }

  clearError();

  setLocalError("");

  const result = await login({
    identifier: identifier.trim(),
    password,
  });

  if (
    !result.success &&
    result.message
      ?.toLowerCase()
      .includes("deactivated")
  ) {

    setShowReactivate(true);

  } else {

    setShowReactivate(false);

  }

};

  const handleReactivate =
  async () => {

  try {

    setIsReactivating(true);

    const emailOrUsername =
      identifier.trim();

    let email = emailOrUsername;

    // if username entered instead of email
    if (!email.includes("@")) {

      return setLocalError(
        "Please use your email address to reactivate account."
      );

    }

    const res = await axios.post(
      `${API}/auth/reactivate`,
      {
        email,
        password,
      }
    );

    toast.success(
      res.data.message ||
      "Account reactivated"
    );

    setShowReactivate(false);

    // auto login after reactivation

    await login({
      identifier: email,
      password,
    });

  } catch (err) {

    setLocalError(
      err.response?.data?.message ||
      "Failed to reactivate account"
    );

  } finally {

    setIsReactivating(false);

  }

};

  return (
    <div className={s.modalOverlay}>
      <div className={s.modalBox}>
        <div className={s.modalHeader}>
          <button className={s.modalClose} onClick={() => navigate(-1)}>
            <RiCloseLine className="leading-none translate-y-1px" />
          </button>
          <div className="flex-1 flex justify-center -ml-9">
            <RiTwitterXFill className="text-white text-[28px]" />
          </div>
        </div>
        <div className="px-20 pb-10 max-md:px-8">
          {step === 1 && (
            <form onSubmit={handleNext}>
              <h1 className="text-[31px] font-bold text-[#e7e9ea] mb-8">
                Sign in to X
              </h1>
              <div className={s.authInputWrap}>
                <label className={s.authInputLabel}>
                  Phone, email, or username
                </label>
                <input
                  type="text"
                  autoFocus
                  autoComplete="username" // ✅ was "email", now "username" covers both
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setLocalError("");
                    clearError();
                  }}
                  className={s.authInputField}
                />
              </div>
              {localError && (
                <div className={`${s.errorAlert} mt-3`}>{localError}</div>
              )}
              <button
                type="submit"
                disabled={!identifier.trim()}
                className={s.authNextBtn}
              >
                Next
              </button>
              <button type="button" onClick={() => navigate("/forgot-password")} className={s.authForgotBtn}>
                Forgot password?
              </button>
              <p className={s.authSignUpLink}>
                Don't have an account?{" "}
                <span onClick={() => navigate("/register")} className={s.authSignUpLinkA}>
                  Sign up
                </span>
              </p>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleLogin}>
              <h1 className="text-[31px] font-bold text-[#e7e9ea] mb-8">
                Enter your password
              </h1>

              <div className={`${s.authInputWrap} opacity-70 mb-5`}>
                <label className={s.authInputLabel}>
                  Phone, email, or username
                </label>
                <input
                  type="text"
                  readOnly
                  value={identifier}
                  className={`${s.authInputField} cursor-not-allowed`}
                />
              </div>
              <div className={s.authInputWrap}>
                <label className={s.authInputLabel}>Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  autoFocus
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLocalError("");
                    clearError();
                  }}
                  className={`${s.authInputField} pr-12`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71767b] text-[18px]"
                >
                  {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
              {localError && (
                <div className={`${s.errorAlert} mt-3`}>{localError}</div>
              )}
              {
  showReactivate && (

    <div
      className="
        mt-4
        border
        border-[#2f3336]
        rounded-2xl
        p-4
        bg-[#0f0f0f]
      "
    >

      <h3
        className="
          text-white
          font-bold
          text-[17px]
          mb-2
        "
      >
        Account Deactivated
      </h3>

      <p
        className="
          text-[#71767b]
          text-sm
          leading-relaxed
          mb-4
        "
      >
        Your account is currently
        deactivated. Reactivate it
        to continue using X.
      </p>

      <button
        type="button"
        onClick={handleReactivate}
        disabled={isReactivating}
        className="
          w-full
          h-[46px]
          rounded-full
          bg-white
          text-black
          font-bold
          hover:bg-[#d7dbdc]
          transition
        "
      >

        {
          isReactivating
            ? "Reactivating..."
            : "Reactivate Account"
        }

      </button>

    </div>

  )
}
              <button
                type="submit"
                disabled={isLoggingIn || !password.trim()}
                className={s.authNextBtn}
              >
                {isLoggingIn ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className={s.loadingSpinner}></div>
                    Signing in...
                  </div>
                ) : (
                  "Log in"
                )}
              </button>

              <button type="button" className={s.authForgotBtn} onClick={() => navigate("/forgot-password")}>
                  Forgot password?
              </button>
              <p className={s.authSignUpLink}>
                <span onClick={handleBack} className={s.authSignUpLinkA}>
                  ← Use a different account
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;