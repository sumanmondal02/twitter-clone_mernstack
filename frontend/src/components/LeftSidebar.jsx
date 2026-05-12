import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../stores/authStore";
import ComposerModal from "./ComposerModal";
import * as s from "../styles/common";

import {
  RiTwitterXFill,
  RiSearchLine,
  RiSearchFill,
  RiNotification3Line,
  RiNotification3Fill,
  RiChat1Line,
  RiChat1Fill,
  RiBookmarkLine,
  RiBookmarkFill,
  RiUserLine,
  RiUserFill,
  RiQuillPenFill,

} from "react-icons/ri";

import { GoHome, GoHomeFill } from "react-icons/go";

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
      icon: (
      location.pathname === "/home"
      ? <GoHomeFill className="text-[32px] ml-[-1px] text-[#e7e9ea]" />
      : <GoHome className="text-[32px] ml-[-1px] text-[#e7e9ea]" />
      ),
      path: "/home",
    },
    {
      label: "Search",
      icon: <RiSearchLine className={s.navIcon} />,
      path: "/search",
    },
    {
      label: "Notifications",
      icon:
        location.pathname === "/notifications"
          ? <RiNotification3Fill className={s.navIcon} />
          : <RiNotification3Line className={s.navIcon} />,
      path: "/notifications",
    },
    {
      label: "Messages",
      icon:(
        location.pathname === "/messages"
          ? <RiChat1Fill className={s.navIcon} />
          : <RiChat1Line className={s.navIcon} />
      ),
      path: "/messages",
    },
    {
      label: "Bookmarks",
      icon: (
        location.pathname === "/bookmarks"
          ? <RiBookmarkFill className={s.navIcon} />
          : <RiBookmarkLine className={s.navIcon} />
      ),
      path: "/bookmarks",
    },
    {
      label: "Profile",
      icon: (
        location.pathname === `/profile/${currentUser?.username}`
          ? <RiUserFill className={s.navIcon} />
          : <RiUserLine className={s.navIcon} />
      ),
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
        <div className="text-[20px]">
          Post
        </div>
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

        <div className="hidden xl:block">
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