import * as s from "../styles/common";
import { RiSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

function RightSidebar() {
  const navigate = useNavigate();
  return (
    <aside className={s.rightPanel}>
      {/* Search
      <div className={s.searchWrapper}>
        <div className={s.searchIconWrap}>
          <RiSearchLine />
        </div>

        <input
          type="text"
          placeholder="Search"
          className={s.searchInput}
        />
      </div> */}

      <div className={s.widgetCard}>
        <h2 className={s.widgetCardTitle}>
          Trending
        </h2>
      </div>

      {/* Suggested Users */}
      <div className={s.widgetCard}>
        <h2 className={s.widgetCardTitle}>
          Who to follow
        </h2>

        {/* Dynamic users later */}
      </div>

      {/* Footer */}  
      <div className="text-[#71767b] text-[13px] leading-5 px-3 pt-4 pb-1 flex flex-wrap gap-x-3 gap-y-1">
        <span className="hover:underline cursor-pointer" onClick={() => navigate("/terms")}>
          Terms
        </span>

        <span className="hover:underline cursor-pointer" onClick={() => navigate("/privacy")}>
          Privacy
        </span>

        <span className="hover:underline cursor-pointer" onClick={() => navigate("/cookies")}>
          Cookies
        </span>

        
      </div>
      <span className="text-[#71767b] text-[12px] px-3">
          © 2026 X Clone. Built with React, Node.js, and MongoDB.
        </span>
    </aside>
  );
}

export default RightSidebar;