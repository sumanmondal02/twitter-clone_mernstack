import { useNavigate } from "react-router-dom";
import { RiTwitterXFill, RiCloseLine } from "react-icons/ri";

function Terms() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black text-white">
        <div className="px-6 pt-5">
            <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full hover:bg-[#16181c] flex items-center justify-center transition"
            >
                <RiCloseLine className="text-[27px] text-white" />
            </button>
        </div>
        <div className="max-w-[700px] mx-auto px-6 pb-10">
        <div className="mb-8 flex justify-center">
            <RiTwitterXFill className="text-[42px]" />
        </div>
        <h1 className="text-[32px] font-extrabold mb-2">Terms of Service</h1>
        <p className="text-[#71767b] text-[14px] mb-8">Effective: May 2026</p>

        <section className="mb-8">
            <h2 className="text-[20px] font-bold mb-3">Welcome to X Clone</h2>
            <p className="text-[#e7e9ea] text-[15px] leading-relaxed">
            X Clone is a social media platform built for sharing thoughts, connecting with people, and exploring content. 
            By using this platform, you agree to these terms. This is a personal project — not a commercial product — built to demonstrate full-stack development skills.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-[20px] font-bold mb-3">Your Account</h2>
            <p className="text-[#e7e9ea] text-[15px] leading-relaxed">
            You are responsible for your account and everything that happens under it. Keep your password safe. 
            You must be a real person — bots and automated accounts are not allowed. 
            We reserve the right to suspend accounts that violate community standards or disrupt the platform.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-[20px] font-bold mb-3">What You Post</h2>
            <p className="text-[#e7e9ea] text-[15px] leading-relaxed">
            You own what you post. By posting on X Clone, you give us permission to display it on the platform. 
            Don't post anything illegal, hateful, or harmful. Posts can be soft-deleted (archived) — 
            they stay in our system but won't be visible publicly.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-[20px] font-bold mb-3">Platform Rules</h2>
            <p className="text-[#e7e9ea] text-[15px] leading-relaxed">
            Be respectful. Don't spam, harass, or impersonate others. Scheduled posts, likes, comments, and follows are features — 
            don't abuse them. Admins can block or deactivate accounts that break these rules.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-[20px] font-bold mb-3">Changes</h2>
            <p className="text-[#e7e9ea] text-[15px] leading-relaxed">
            This is a living project. Features and terms may change. We'll try to keep things transparent when they do.
            </p>
        </section>

        <p className="text-[#71767b] text-[13px] mt-12">© 2026 X Clone. Built with React, Node.js, and MongoDB.</p>
        </div>
    </div>
  );
}

export default Terms;