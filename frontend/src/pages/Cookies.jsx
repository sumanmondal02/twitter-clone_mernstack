import { useNavigate } from "react-router-dom";
import { RiTwitterXFill, RiCloseLine } from "react-icons/ri";

function Cookies() {
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
        <h1 className="text-[32px] font-extrabold mb-2">Cookie Policy</h1>
        <p className="text-[#71767b] text-[14px] mb-8">Effective: May 2026</p>

        <section className="mb-8">
            <h2 className="text-[20px] font-bold mb-3">What Is a Cookie</h2>
            <p className="text-[#e7e9ea] text-[15px] leading-relaxed">
            A cookie is a small piece of data stored in your browser. Websites use them to remember who you are between visits so you don't have to log in every time.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-[20px] font-bold mb-3">What We Use</h2>
            <p className="text-[#e7e9ea] text-[15px] leading-relaxed">
            X Clone uses exactly one cookie — an HTTP-only authentication cookie containing your JWT token. This is set when you log in and cleared when you log out. It's essential for the platform to work — without it, you'd be logged out on every page refresh.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-[20px] font-bold mb-3">What We Don't Use</h2>
            <p className="text-[#e7e9ea] text-[15px] leading-relaxed">
            No analytics cookies. No advertising cookies. No tracking pixels. No third-party cookies of any kind. We don't use Google Analytics, Meta Pixel, or any similar service. What you do on X Clone stays on X Clone.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-[20px] font-bold mb-3">Controlling Cookies</h2>
            <p className="text-[#e7e9ea] text-[15px] leading-relaxed">
            You can clear cookies from your browser settings at any time — this will log you out of X Clone. Since our auth cookie is HTTP-only, it cannot be accessed or modified by JavaScript, which keeps your session secure.
            </p>
        </section>

        <p className="text-[#71767b] text-[13px] mt-12">© 2026 X Clone. Built with React, Node.js, and MongoDB.</p>
        </div>
    </div>
  );
}

export default Cookies;