import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RiTwitterXFill, RiCloseLine } from "react-icons/ri";
import * as s from "../styles/common";

const API = import.meta.env.VITE_URL;

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");
            setMessage("");
            const res = await axios.post(
                `${API}/auth/forgot-password`,
                { email },
                { withCredentials: true }
            ); setMessage(res.data.message);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Something went wrong"
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
                        Find your account
                    </h1>
                    <p className="text-[#71767b] text-[15px] mb-6 leading-relaxed">
                        Enter your email address and we’ll send you a password reset link.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className={s.authInputWrap}>
                            <label className={s.authInputLabel}>
                                Email
                            </label>
                            <input
                                type="email"
                                autoFocus
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                                className={s.authInputField}
                            />
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
                            disabled={!email.trim() || loading}
                            className={s.authNextBtn}
                        >
                            {
                                loading
                                ? "Sending..."
                                : "Send reset link"
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;