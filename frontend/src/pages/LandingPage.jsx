import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiTwitterXFill } from "react-icons/ri";
import * as s from "../styles/common";
import { useAuth } from "../stores/authStore";

function LandingPage() {
  const navigate = useNavigate();
  const { currentUser, isCheckingAuth, checkAuth } = useAuth();
  
  // if logged in → redirect
  useEffect(() => {
    if (currentUser) {
      navigate("/home");
    }
  }, [currentUser, navigate]);

  // wait until auth check finishes
  if (isCheckingAuth) {
    return (
      <div className={s.loadingCenter}>
            <div className={s.loadingSpinner}></div>
      </div>
    );
  }
  
  return (
    <div className={s.landingPage}>
      {/* LEFT SIDE LOGO */}
      <div className={s.landingLogo}>
        <RiTwitterXFill />
      </div>
      {/* RIGHT SIDE */}
      <div className={s.landingRight}>
        <h1 className={s.landingTitle}>
          Happening now
        </h1>
        <h2 className={s.landingSubtitle}>
          Join today.
        </h2>
        {/* REGISTER BUTTON */}
        <button className={s.landingCreateBtn} onClick={() => navigate("/register")}>
          Create account
        </button>
         <p className={s.landingDisclaimer}>
          By signing up, you agree to the Terms of Service and Privacy Policy.
        </p>
        <p className={s.landingDivider}>
          <span className={s.landingDividerLine}></span>
          <span>or</span>
          <span className={s.landingDividerLine}></span>
        </p>
        <p className={s.landingAlreadyHave}>
          Already have an account?
        </p>
        {/* LOGIN BUTTON */}
        <button className={s.landingSignInBtn} onClick={() => navigate("/login")}>
          Sign in
        </button>
      </div>
    </div>
  );
}

export default LandingPage;