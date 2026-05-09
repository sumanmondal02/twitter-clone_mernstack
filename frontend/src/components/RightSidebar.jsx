import * as s from "../styles/common";
import { RiSearchLine } from "react-icons/ri";

function RightSidebar() {
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
      <div className="text-[#71767b] text-[13px] leading-5 px-3 py-4 flex flex-wrap gap-x-3 gap-y-1">
        <span className="hover:underline cursor-pointer">
          Terms
        </span>

        <span className="hover:underline cursor-pointer">
          Privacy
        </span>

        <span className="hover:underline cursor-pointer">
          Cookies
        </span>

        <span className="hover:underline cursor-pointer">
          Accessibility
        </span>

        <span className="hover:underline cursor-pointer">
          Ads info
        </span>

        <span>
          © 2026 X Corp.
        </span>
      </div>
    </aside>
  );
}

export default RightSidebar;