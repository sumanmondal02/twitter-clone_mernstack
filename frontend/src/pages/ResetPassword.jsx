import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
    RiTwitterXFill,
    RiCloseLine,
    RiEyeLine,
    RiEyeOffLine
} from "react-icons/ri";

import * as s from "../styles/common";

const API = import.meta.env.VITE_URL;

function ResetPassword() {
    const navigate = useNavigate();
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");
            setMessage("");
            const res = await axios.put(
                `${API}/auth/reset-password/${token}`,
                { newPassword }
            );
            setMessage(res.data.message);
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Reset failed"
            );
        } finally {
            setLoading(false);
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
                    <h1 className="text-[31px] font-bold text-[#e7e9ea] mb-8">
                        Reset your password
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <div className={s.authInputWrap}>
                            <label className={s.authInputLabel}>
                                New Password
                            </label>
                            <input
                                type={
                                    showPassword
                                    ? "text"
                                    : "password"
                                }
                                autoFocus
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    setError("");
                                }}
                                className={`${s.authInputField} pr-12`}
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
                                    showPassword
                                    ? <RiEyeOffLine />
                                    : <RiEyeLine />
                                }
                            </button>
                        </div>
                        {error && (
                            <div className={`${s.errorAlert} mt-4`}>
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className={`${s.successAlert} mt-4`}>
                                {message}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={!newPassword.trim() || loading}
                            className={s.authNextBtn}
                        >
                            {
                                loading
                                ? "Updating..."
                                : "Update password"
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;