import { useNavigate } from "react-router-dom";
import { RiTwitterXFill, RiCloseLine } from "react-icons/ri";

function Privacy() {
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
        <div className="flex justify-center mb-8">
            <RiTwitterXFill className="text-[42px]" />
        </div>
        <h1 className="text-[32px] font-extrabold mb-2">Privacy Policy</h1>
        <p className="text-[#71767b] text-[14px] mb-8">Effective: May 2026</p>

        <section className="mb-8">
            <h2 className="text-[20px] font-bold mb-3">What We Collect</h2>
            <p className="text-[#e7e9ea] text-[15px] leading-relaxed">
            When you register, we collect your name, username, email, and password (hashed — never stored as plain text). When you use the platform, we store your posts, comments, likes, follows, and profile image. That's it. We don't sell your data or run ads.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-[20px] font-bold mb-3">How We Use It</h2>
            <p className="text-[#e7e9ea] text-[15px] leading-relaxed">
            Your data is used to run the platform — showing your feed, profile, notifications, and letting others find and follow you. Profile images are stored on Cloudinary. We use JWT tokens stored in HTTP-only cookies to keep you logged in securely.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-[20px] font-bold mb-3">Who Sees Your Data</h2>
            <p className="text-[#e7e9ea] text-[15px] leading-relaxed">
            Your posts and profile are visible to other logged-in users. Your email is never shown publicly. Deleted (archived) posts are only visible to you when you filter by "Archived" on your profile. Other users cannot see them.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-[20px] font-bold mb-3">Your Control</h2>
            <p className="text-[#e7e9ea] text-[15px] leading-relaxed">
            You can update your profile, change your username, remove your profile picture, or deactivate your account at any time from your profile settings. Deactivating your account makes it invisible to others immediately.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-[20px] font-bold mb-3">Cookies</h2>
            <p className="text-[#e7e9ea] text-[15px] leading-relaxed">
            We use one cookie — an HTTP-only JWT auth token — to keep you logged in. No tracking cookies, no ad cookies, nothing third-party beyond Cloudinary for image storage.
            </p>
        </section>

        <p className="text-[#71767b] text-[13px] mt-12">© 2026 X Clone. Built with React, Node.js, and MongoDB.</p>
        </div>
    </div>
  );
}

export default Privacy;