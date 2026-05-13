import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../stores/authStore";
import NotificationPanel from "./NotificationPanel";
import { useNotificationStore } from "../stores/notificationStore";
import ComposerModal from "./ComposerModal";
import SearchPanel from "./SearchPanel";
import * as s from "../styles/common";

import {
  RiTwitterXFill,
  RiSearchLine,
  RiSearchFill,
  RiNotification3Line,
  RiNotification3Fill,
  RiDashboardLine,
  RiQuillPenFill,
  RiChat1Line,
  RiChat1Fill,
  RiBookmarkLine,
  RiBookmarkFill,
  RiUserLine,
  RiUserFill,
  RiShieldUserLine,
} from "react-icons/ri";

import { GoHome, GoHomeFill } from "react-icons/go";

function LeftSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const { unreadCount, fetchUnreadCount } = useNotificationStore();
  const isAdmin = currentUser?.isAdmin;

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userNavItems = [
    {
      label: "Home",
      icon: location.pathname === "/home"
        ? <GoHomeFill className="text-[32px] ml-[-1px] text-[#e7e9ea]" />
        : <GoHome className="text-[32px] ml-[-1px] text-[#e7e9ea]" />,
      path: "/home",
      onClick: () => navigate("/home"),
    },
    {
      label: "Search",
      icon: searchOpen ? <RiSearchFill className={s.navIcon} /> : <RiSearchLine className={s.navIcon} />,
      path: null,
      onClick: () => setSearchOpen(true),
    },
    {
      label: "Notifications",
      icon: (
        <div className="relative">
          {notifOpen ? <RiNotification3Fill className={s.navIcon} /> : <RiNotification3Line className={s.navIcon} />}
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-[#1d9bf0] rounded-full flex items-center justify-center
            text-white text-[10px] font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </div>
          )}
        </div>
      ),
      path: null,
      onClick: () => setNotifOpen(true),
    },
    {
      label: "Messages",
      icon: location.pathname === "/messages" ? <RiChat1Fill className={s.navIcon} /> : <RiChat1Line className={s.navIcon} />,
      path: "/messages",
      onClick: () => navigate("/messages"),
    },
    {
      label: "Bookmarks",
      icon: location.pathname === "/bookmarks" ? <RiBookmarkFill className={s.navIcon} /> : <RiBookmarkLine className={s.navIcon} />,
      path: "/bookmarks",
      onClick: () => navigate("/bookmarks"),
    },
    {
      label: "Profile",
      icon: location.pathname === `/profile/${currentUser?.username}` ? <RiUserFill className={s.navIcon} /> : <RiUserLine className={s.navIcon} />,
      path: `/profile/${currentUser?.username}`,
      onClick: () => navigate(`/profile/${currentUser?.username}`),
    },
  ];

  const adminNavItems = [
    {
      label: "Home",
      icon: location.pathname === "/home"
        ? <GoHomeFill className="text-[32px] ml-[-1px] text-[#e7e9ea]" />
        : <GoHome className="text-[32px] ml-[-1px] text-[#e7e9ea]" />,
      path: "/home",
      onClick: () => navigate("/home"),
    },
    {
      label: "Search",
      icon: searchOpen ? <RiSearchFill className={s.navIcon} /> : <RiSearchLine className={s.navIcon} />,
      path: null,
      onClick: () => setSearchOpen(true),
    },
    {
      label: "Notifications",
      icon: (
        <div className="relative">
          {notifOpen ? <RiNotification3Fill className={s.navIcon} /> : <RiNotification3Line className={s.navIcon} />}
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-[#1d9bf0] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </div>
          )}
        </div>
      ),
      path: null,
      onClick: () => setNotifOpen(true),
    },
    {
      label: "Dashboard",
      icon: <RiShieldUserLine className={s.navIcon} style={{ color: location.pathname === "/admin" ? "#1d9bf0" : undefined }} />,
      path: "/admin",
      onClick: () => navigate("/admin"),
    },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <aside className={s.leftSidebar}>
      <div className={s.leftSidebarInner}>
        <div className={s.sidebarXLogo} onClick={() => navigate("/home")}>
          <RiTwitterXFill className="text-[48px]" />
        </div>

        <nav className={s.sidebarNav}>
          {navItems.map((item) => {
            const active = item.path && location.pathname === item.path;
            return (
              <div
                key={item.label}
                className={active ? s.navItemActive : s.navItem}
                onClick={item.onClick}
              >
                {item.icon}
                <span className={active ? s.navLabelActive : s.navLabel}>{item.label}</span>
              </div>
            );
          })}
        </nav>

        {/* Post button — users only */}
        {!isAdmin && (
          <>
            <button className={s.postBtnWide} onClick={() => setShowComposer(true)}>
              <div className="text-[20px]">Post</div>
            </button>
            <button className={s.postBtnCircle} onClick={() => setShowComposer(true)}>
              <RiQuillPenFill />
            </button>
          </>
        )}

        {showComposer && createPortal(
          <ComposerModal closeModal={() => setShowComposer(false)} />,
          document.body
        )}

        {createPortal(
          <SearchPanel isOpen={searchOpen} onClose={() => setSearchOpen(false)} />,
          document.body
        )}

        {createPortal(
          <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />,
          document.body
        )}

        <div ref={menuRef} className={s.sidebarUserCard} onClick={() => setShowMenu(!showMenu)}>
          {showMenu && (
            <div className={s.logoutPopup}>
              <button
                className={s.logoutBtn}
                onClick={async () => {
                  try { await logout(); navigate("/login"); } catch (e) { console.log(e); }
                }}
              >
                Logout
              </button>
            </div>
          )}
          <img
            src={currentUser?.profileImageUrl || "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png"}
            alt="profile"
            className={s.avatarMd}
          />
          <div className="hidden xl:block">
            <div className={s.sidebarUserName}>
              {currentUser?.firstName} {currentUser?.lastName}
              {isAdmin && <span className="ml-2 text-[10px] bg-[#1d9bf0] text-white px-2 py-0.5 rounded-full font-bold">ADMIN</span>}
            </div>
            <div className={s.sidebarUserHandle}>@{currentUser?.username}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default LeftSidebar;