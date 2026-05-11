import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../stores/authStore";
import ComposerModal from "./ComposerModal";
import * as s from "../styles/common";

import {
  RiTwitterXFill,
  RiSearchLine,
  RiNotification3Line,
  RiChat1Line,
  RiBookmarkLine,
  RiUserLine,
  RiQuillPenFill,
} from "react-icons/ri";

import { GrHomeRounded } from "react-icons/gr";

function LeftSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    {
      label: "Home",
      icon: <GrHomeRounded className="text-[26px] ml-0.5 text-[#e7e9ea]" />,
      path: "/home",
    },
    {
      label: "Search",
      icon: <RiSearchLine className={s.navIcon} />,
      path: "/search",
    },
    {
      label: "Notifications",
      icon: <RiNotification3Line className={s.navIcon} />,
      path: "/notifications",
    },
    {
      label: "Messages",
      icon: <RiChat1Line className={s.navIcon} />,
      path: "/messages",
    },
    {
      label: "Bookmarks",
      icon: <RiBookmarkLine className={s.navIcon} />,
      path: "/bookmarks",
    },
    {
      label: "Profile",
      icon: <RiUserLine className={s.navIcon} />,
      path: `/profile/${currentUser?.username}`,
    },
  ];

  return (
    <aside className={s.leftSidebar}>
      <div className={s.leftSidebarInner}>
      {/* X Logo */}
      <div className={s.sidebarXLogo} onClick={() => navigate("/home")}>
        <RiTwitterXFill className="text-[48px]" />
      </div>

      {/* Nav Items */}
      <nav className={s.sidebarNav}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <div
              key={item.label}
              className={active ? s.navItemActive : s.navItem}
              onClick={() => navigate(item.path)}
            >
              {item.icon}

              <span className={active ? s.navLabelActive : s.navLabel}>
                {item.label}
              </span>
            </div>
          );
        })}
      </nav>

      {/* Post Button Desktop */}
      <button className={s.postBtnWide} onClick={() => setShowComposer(true)}>
        Post
      </button>

      {/* Post Button Mobile */}
      <button className={s.postBtnCircle} onClick={() => setShowComposer(true)}>
        <RiQuillPenFill />
      </button>

      {
        showComposer && createPortal(
          <ComposerModal
            closeModal={() =>
              setShowComposer(false)
            }
          />, document.body
        )
      }

      {/* Bottom User Card */}
      <div ref={menuRef} className={s.sidebarUserCard} onClick={() => setShowMenu(!showMenu)}>
        {
          showMenu && (
            <div className={s.logoutPopup}>
              <button
                className={s.logoutBtn}
                onClick={async () => {
                  try {
                    await logout();
                    navigate("/login");
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                Logout
              </button>
            </div>
          )
        }
        <img
          src={
            currentUser?.profileImageUrl || "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail_unscaled&_=20240121032759"
          }
          alt="profile"
          className={s.avatarMd}
        />

        <div className="hidden xl:block overflow-hidden">
          <div className={s.sidebarUserName}>
            {currentUser?.firstName} {currentUser?.lastName}
          </div>

          <div className={s.sidebarUserHandle}>
            @{currentUser?.username}
          </div>
        </div>
      </div>
      </div>
    </aside>
  );
}

export default LeftSidebar;