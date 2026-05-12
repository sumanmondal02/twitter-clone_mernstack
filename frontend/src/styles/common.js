// Landing, Login, Register, Home, Explore, Notifications, Follow, Chat, Profile, Edit Profile, Settings
// All icons use react-icons/ri (Remix Icons) — closest match to X's SVG icon set

// ─── COLORS (reference — use in JS logic e.g. char count ring color) ────────
export const colors = {
  black:          "#000000",   // true page background
  surface:        "#16181c",   // cards, panels, right sidebar widgets
  surfaceHover:   "#1e2126",   // hover state on surface items
  surfaceDark:    "#202327",   // search input background
  border:         "#2f3336",   // primary border everywhere
  borderHover:    "#536471",   // secondary border, input default stroke
  accent:         "#1d9bf0",   // X Blue — primary CTA, active states, links
  accentHover:    "#1a8cd8",   // blue on hover
  text:           "#e7e9ea",   // primary text
  textMuted:      "#71767b",   // secondary / placeholder text
  textSecondary:  "#8b98a5",   // tertiary hints
  like:           "#d40b29",   // heart / like — X uses pink NOT red
  likeHover:      "#d40b29",
  repost:         "#00ba7c",   // repost / green
  danger:         "#f4212e",   // delete, block, danger actions
  dangerHover:    "#d92838",
  views:          "#71767b",   // views icon color (bar chart)
  bookmark:       "#71767b",
  share:          "#71767b",
  white:          "#ffffff",
  landingBg:      "#000000",
};

// ─── LANDING PAGE (Image 1 — x.com) ─────────────────────────────────────────
// Full black screen split: left = X logo centered, right = CTA stack
export const landingPage        = "min-h-screen bg-black flex flex-col lg:flex-row items-center justify-center lg:justify-between px-18 lg:px-36 lg:gap-48 py-8 md:gap-18 sm: gap-12";
export const landingLogo        = "text-white text-[160px] sm:text-[180px] md:text-[270px] lg:text-[clamp(380px,24vw,420px)] flex items-center justify-center lg:flex-1";
export const landingRight       = "flex flex-col gap-4 w-full max-w-[380px]";
export const landingTitle       = "text-white font-extrabold text-[clamp(28px,5vw,64px)] leading-tight mb-2";
export const landingSubtitle    = "text-white font-bold text-[23px] mb-6";
// Buttons on landing — Google / Apple buttons are white pill with border
export const landingOAuthBtn    = "w-full flex items-center justify-center gap-3 bg-white hover:bg-[#e6e6e6] text-black font-bold py-2.5 rounded-full text-[15px] transition-colors cursor-pointer border border-[#ccc]";
export const landingDivider     = "flex items-center gap-3 text-[#71767b] text-[15px] my-1";
export const landingDividerLine = "flex-1 border-t border-[#2f3336]";
export const landingCreateBtn   = "w-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold py-2.5 rounded-full text-[16px] transition-colors cursor-pointer";
export const landingSignInBtn   = "w-full bg-transparent border border-[#536471] hover:bg-[#1e2126] text-[#e7e9ea] font-bold py-2.5 rounded-full text-[15px] transition-colors cursor-pointer";
export const landingDisclaimer  = "text-[#71767b] text-[11px] leading-relaxed";
export const landingAlreadyHave = "text-white font-bold text-[17px] lg:mt-1 lg:mb-3";

// ─── AUTH MODALS (Images 2, 3 — login/register are centered MODALS, not pages)
// X opens these as a modal over the landing, not a separate route
// Use modalOverlay + modalBox below, with these inner styles
export const authModalLogo      = "flex justify-center mb-5 text-white text-[28px]";
export const authModalTitle     = "text-[#e7e9ea] font-bold text-[23px] mb-6";

// Input — X style: transparent bg, bottom-border-only on focus, label floats up
// Use this for Name, Email, Password fields in register/login
export const authInputWrap      = "relative border border-[#333639] rounded-md hover:border-[#71767b] focus-within:border-[#1d9bf0] transition-colors bg-transparent";
export const authInputLabel     = "absolute left-3 top-2 text-[#71767b] text-[13px] z-10 pointer-events-none";
export const authInputField     = "w-full bg-black border border-[#2f3336] rounded-md px-4 pt-6 pb-2 text-white text-[17px] h-[68px] outline-none focus:border-[#1d9bf0] transition";
export const authCharCount      = "absolute top-2 right-3 text-[#71767b] text-[11px]"; // e.g. "0 / 50" on Name field

// DOB selects (Month / Day / Year dropdowns on register)
export const dobRow             = "flex gap-3";
export const dobSelect          = "flex-1 bg-transparent border border-[#333639] hover:border-[#71767b] focus:border-[#1d9bf0] text-[#e7e9ea] rounded-md px-3 py-3 text-[15px] outline-none cursor-pointer";
export const dobLabel           = "text-[#e7e9ea] font-bold text-[17px] mb-1";
export const dobSubtext         = "text-[#71767b] text-[14px] mb-4 leading-relaxed";

// Auth action buttons
export const authNextBtn        = "w-full bg-[#eff3f4] hover:bg-[#d7dbdc] text-black font-bold py-3 rounded-full text-[17px] transition-colors cursor-pointer mt-6 disabled:opacity-40 disabled:cursor-not-allowed";
export const authNextBtnBlue    = "w-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold py-3 rounded-full text-[17px] transition-colors cursor-pointer mt-6 disabled:opacity-40 disabled:cursor-not-allowed";
export const authForgotBtn      = "w-full border border-[#536471] hover:bg-[#1e2126] text-[#e7e9ea] font-bold py-3 rounded-full text-[15px] transition-colors cursor-pointer mt-2";
export const authSignUpLink     = "text-[#71767b] text-[15px] mt-6 text-center";
export const authSignUpLinkA    = "text-[#1d9bf0] hover:underline cursor-pointer";

// ─── PAGE BACKGROUND & WRAPPER ────────────────────────────────────────────────
export const pageRoot           = "bg-black min-h-screen text-[#e7e9ea] font-[-apple-system,BlinkMacSystemFont,sans-serif]";
export const pageWrapper        = "max-w-[1500px] mx-auto flex min-h-screen overflow-x-hidden";

// ─── THREE-COLUMN LAYOUT ─────────────────────────────────────────────────────
// Left sidebar — fixed, 275px (88px on medium, icons only)
export const leftSidebar        = "fixed top-0 left-0 h-screen w-[63px] xl:w-[275px] border-r border-[#2f3336] flex justify-center xl:justify-end";
// export const leftSidebarInner   = "h-screen flex flex-col items-center xl:items-start px-4 py-5 gap-2";
export const leftSidebarInner   = "h-screen w-full max-w-[250px] flex flex-col items-center xl:items-start px-3 py-5 gap-2";
// Main feed column — ml offset matches sidebar, mr offset matches right panel
// export const feedColumn         = "flex-1 min-h-screen border-x border-[#2f3336] ml-[82px] xl:ml-[260px] lg:mr-[300px]";
export const feedColumn         = "flex-1 min-h-screen border-x border-[#2f3336] ml-[62px] xl:ml-[275px] lg:mr-[425px] mr-0 w-full overflow-x-hidden"; // add horizontal padding to feed
// Right panel — fixed, 350px, hidden below xl
export const rightPanel         = "hidden lg:block fixed top-0 right-3 w-[410px] h-screen overflow-y-auto px-4 py-4 xl:px-6";
export const logoutPopup        = "absolute bottom-20 left-1 bg-black border border-[#2f3336] rounded-3xl shadow-2xl overflow-hidden w-[220px] transition-colors";
export const logoutBtn          = "w-full text-left px-4 py-4 hover:bg-[#16181c] text-[#e7e9ea] font-bold transition-colors hover:text-red-500 cursor-pointer";

// ─── SIDEBAR NAV (Image 4, 14) ────────────────────────────────────────────────
// X Logo at top — just the X icon, 50px hit target
// export const sidebarXLogo       = "w-[56px] h-[56px] rounded-full flex items-center justify-center hover:bg-[#181818] transition cursor-pointer mb-3 self-center xl:self-start";
export const sidebarXLogo       = "w-full h-[72px] flex items-center justify-center hover:bg-[#181818] transition cursor-pointer mt-3 mb-5 rounded-full";
export const sidebarNav         = "flex flex-col gap-1 mt-5 xl:mt-0.5 flex-1 w-full items-center xl:items-start";

// Nav item — icon always shows, label only on xl screens
// X uses no emoji — icons are SVG stroke icons (react-icons/ri or similar)
// export const navItem            = "group flex items-center justify-center lg:justify-start gap-5 px-3 w-fit min-w-[220px] h-[58px] rounded-full transition-colors duration-200 cursor-pointer mx-auto lg:mx-0 hover:bg-[#16181c]";
export const navItem            = "group flex items-center justify-center xl:justify-start gap-5 xl:px-3 w-full lg:w-[220px] h-[58px] rounded-full transition-colors duration-200 cursor-pointer hover:bg-[#16181c]";
// export const navItemActive      = "group flex items-center justify-center lg:justify-start gap-5 px-3 w-fit min-w-[220px] h-[58px] rounded-full transition-colors duration-200 cursor-pointer mx-auto lg:mx-0";
export const navItemActive      = "group flex items-center justify-center xl:justify-start gap-5 xl:px-3 w-full lg:w-[220px] h-[58px] rounded-full transition-colors duration-200 cursor-pointer";
export const navIcon            = "text-[28px] text-[#e7e9ea]"; // size for react-icon
export const navLabel           = "hidden xl:block text-[20px] text-[#e7e9ea] font-normal"; // hidden on small
export const navLabelActive     = "hidden xl:block text-[20px] text-[#e7e9ea] font-bold";
// Notification badge dot on nav icon
export const navBadge           = "absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#1d9bf0] text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1";

// Post button — wide on xl, circle icon only on small
export const postBtnWide        = "hidden xl:flex items-center justify-center w-[95%] h-[54px] rounded-full bg-[#1d9bf0] hover:bg-[#1a8cd8] transition font-bold text-[17px] text-white mt-2.5";
export const postBtnCircle      = "xl:hidden w-[45px] h-[48px] rounded-full bg-[#1d9bf0] hover:bg-[#1a8cd8] flex items-center justify-center text-white mt-2.5 transition";

// Sidebar bottom user card — avatar + name + handle + ⋯
export const sidebarUserCard    = "relative flex items-center justify-center xl:justify-start gap-4 p-2 xl:p-3 rounded-full hover:bg-[#16181c] cursor-pointer transition mt-7 w-[75px] xl:w-full";
export const sidebarAvatar      = "w-10 h-10 rounded-full object-cover flex-shrink-0";
export const sidebarUserName    = "text-[16px] font-bold text-[#e7e9ea] leading-tight";
export const sidebarUserHandle  = "text-[#71767b] text-[16px] leading-tight";
// export const sidebarUserMore    = "ml-auto text-[#e7e9ea] hidden lg:block";

// ─── TOP BAR / HEADER (sticky, blurred) ──────────────────────────────────────
export const topBar             = "sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-[#2f3336] px-4 h-[53px] flex items-center gap-4";
export const topBarTitle        = "font-bold text-[20px] text-[#e7e9ea] flex-1";
export const topBarSubtitle     = "text-[#71767b] text-[13px]"; // e.g. "1,234 posts" under name on profile
export const topBarBackBtn      = "w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#181818] transition-colors cursor-pointer text-[#e7e9ea] text-[18px] flex-shrink-0";
export const topBarIconBtn      = "w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#181818] transition-colors cursor-pointer text-[#e7e9ea] text-[18px] ml-auto";

// ─── FEED TABS (For you / Following / All / Mentions etc.) ───────────────────
export const tabBar             = "sticky top-0 z-20 backdrop-blur-md bg-black/80 border-b border-[#2f3336] flex";
export const tab                = "flex-1 h-[53px] flex items-center justify-center text-[#71767b] font-bold hover:bg-[#181818] transition-colors cursor-pointer relative";
export const tabActive          = "flex-1 h-[53px] flex items-center justify-center text-[#e7e9ea] font-bold hover:bg-[#181818] transition-colors cursor-pointer relative";
export const tabIndicator       = "absolute bottom-0 h-[4px] rounded-full bg-[#1d9bf0] w-[56px]"; // blue underline pill

// ─── TWEET COMPOSER (Image 4 — "What's happening?") ─────────────────────────
export const composerWrapper    = "flex gap-5 px-4 md:px-9 pt-4 md:pt-5.5 border-b pb-0.5 md:pb-1 border-[#2f3336]";
export const composerAvatar     = "mt-1.5 w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-1 cursor-pointer";
export const composerRight      = "flex-1 flex flex-col min-w-0";
export const composerAudienceBtn= "text-[#1d9bf0] font-bold text-[13px] border border-[#1d9bf0] rounded-full px-3 py-0.5 w-fit mb-3 hover:bg-[#1d9bf0]/10 transition-colors cursor-pointer";
export const composerTextarea   = "w-full bg-transparent text-[17px] text-[#e7e9ea] outline-none resize-none placeholder:text-[#71767b] min-h-[52px] max-h-[320px] leading-7 pt-1.5 scrollbar-thin scrollbar-thumb-[#2f3336]"; // auto-resize with JS, min height to show 2 lines
export const composerToolbar    = "flex items-center justify-between border-t border-[#2f3336] py-2 md:pt-3 md:pb-2 px-0.5";
export const composerActions    = "flex items-center gap-0.5";
// Each icon in the toolbar row (📷 GIF 📊 😊 📍 🚩)
export const composerIconBtn    = "w-9 h-9 rounded-full flex items-center justify-center text-[#1d9bf0] hover:bg-[#0a171f] transition-colors text-[21px]";
export const composerRight2     = "flex items-center gap-3";
export const composerCharRing   = "w-5 h-5"; // SVG circle ring — color via JS
export const composerDivider    = "w-px h-6 bg-[#2f3336]";
export const composerPostBtn    = "bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold px-4 h-[30px] md:px-6 md:h-[37px] rounded-full text-[16px] transition-colors cursor-pointer";
// Char count ring color logic (use in component JS):
// >0 && <=320: stroke #1d9bf0
// 321-360:     stroke #ffd400
// >360:        stroke #f4212e  + show negative count in red

// ─── TWEET / POST CARD (Images 4, 5) ─────────────────────────────────────────
export const tweetCard          = "flex gap-3 px-4 py-3 border-b border-[#2f3336] hover:bg-[#080808] transition-colors cursor-pointer relative";
export const tweetCardFocused   = "flex gap-3 px-4 py-3 border-b border-[#2f3336]"; // single post — no hover

// Avatar sizes
export const avatarXs           = "w-6 h-6 rounded-full object-cover flex-shrink-0";
export const avatarSm           = "w-8 h-8 rounded-full object-cover flex-shrink-0";
export const avatarMd           = "w-10 h-10 rounded-full object-cover flex-shrink-0 cursor-pointer";
export const avatarLg           = "w-16 h-16 rounded-full object-cover";
export const avatarXl           = "w-[133px] h-[133px] rounded-full object-cover border-4 border-black"; // profile page
// Fallback initials avatar (when no profileImageUrl)
export const avatarFallback     = (size = "w-10 h-10") => `${size} rounded-full bg-[#333639] flex items-center justify-center text-white font-bold flex-shrink-0 cursor-pointer`;

// Tweet content
export const tweetHeader        = "flex items-center flex-wrap gap-x-1 gap-y-0";
export const tweetName          = "font-bold text-[#e7e9ea] text-[15px] hover:underline cursor-pointer leading-snug";
export const tweetHandle        = "text-[#71767b] text-[15px] leading-snug";
export const tweetDot           = "text-[#71767b] text-[15px] leading-snug";
export const tweetTime          = "text-[#71767b] text-[15px] hover:underline cursor-pointer leading-snug";
export const tweetBody          = "text-[#e7e9ea] text-[15px] leading-relaxed mt-1 break-words whitespace-pre-wrap";
export const tweetEditedBadge   = "text-[#71767b] text-[13px] mt-1 italic"; // "· Edited"
export const tweetMedia         = "mt-3 rounded-2xl overflow-hidden border border-[#2f3336] max-h-[510px] w-full object-cover block";

// ─── TWEET ACTION BAR (Image 15 — the real X action bar) ─────────────────────
// 5 actions: Comment | Repost | Like | Views | Bookmark | Share
// ALL use react-icons — NOT emoji
// Layout: spread across bottom of card, -ml-2 to align with text
export const tweetActions       = "flex items-center justify-between mt-2 -ml-2 max-w-[440px]";

// Each action group: icon button + count
export const tweetActionGroup   = "flex items-center group cursor-pointer";
export const tweetActionIconWrap= "w-8 h-8 flex items-center justify-center rounded-full transition-colors text-current text-[18px]";
export const tweetActionCount   = "text-[13px] text-[#71767b] tabular-nums group-hover:text-inherit transition-colors -ml-0.5";

// Action-specific HOVER colors (apply via group-hover on parent group)
// Comment  → blue
export const commentHover       = "group-hover:text-[#1d9bf0] group-hover:[&_div]:bg-[#1d9bf0]/10";
export const commentActive      = "text-[#1d9bf0]";
// Repost   → green
export const repostHover        = "group-hover:text-[#00ba7c] group-hover:[&_div]:bg-[#00ba7c]/10";
// Like     → pink (X uses #f91880, NOT red)
export const likeHover          = "group-hover:text-[#d40b29]";
export const likeActive         = "text-[#d40b29]"; // already liked state
// Views    → blue
export const viewsHover         = "group-hover:text-[#1d9bf0] group-hover:[&_div]:bg-[#1d9bf0]/10";
// Bookmark → blue
export const bookmarkHover      = "group-hover:text-[#1d9bf0] group-hover:[&_div]:bg-[#1d9bf0]/10";
export const bookmarkActive     = "text-[#1d9bf0]";
// Share    → blue
export const shareHover         = "group-hover:text-[#1d9bf0] group-hover:[&_div]:bg-[#1d9bf0]/10";

// react-icons to use for tweet actions:
// Comment  → RiChat1Line       (speech bubble)
// Repost   → RiRepeat2Line     (two arrows)
// Like     → RiHeartLine / RiHeartFill (when liked)
// Views    → RiBarChartLine    (bar chart icon — exactly like X)
// Bookmark → RiBookmarkLine / RiBookmarkFill
// Share    → RiUploadLine      (arrow up from box)

// ─── MORE (⋯) MENU ───────────────────────────────────────────────────────────
export const moreBtn            = "w-[34px] h-[34px] flex items-center justify-center rounded-full text-[#71767b] hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0] transition-colors cursor-pointer ml-auto flex-shrink-0";
export const dropdownMenu       = "absolute right-0 top-8 bg-[#16181c] border border-[#2f3336] rounded-2xl shadow-[0_8px_28px_rgba(255,255,255,0.06)] z-20 min-w-[220px] py-1 overflow-hidden";
export const dropdownItem       = "flex items-center gap-3 px-4 py-3 hover:bg-[#1e2126] cursor-pointer text-[15px] text-[#e7e9ea] transition-colors w-full text-left";
export const dropdownItemDanger = "flex items-center gap-3 px-4 py-3 hover:bg-[#1e2126] cursor-pointer text-[15px] text-[#f4212e] font-bold transition-colors w-full text-left";

// ─── RIGHT PANEL (Images 4, 5, 6) ────────────────────────────────────────────
// Search bar (top of right panel, also used on Explore page header)
export const searchWrapper      = "relative mb-4 mt-1";
export const searchInput        = "w-full bg-[#202327] border border-transparent rounded-full pl-11 pr-4 py-2.5 text-[#e7e9ea] text-[15px] placeholder:text-[#71767b] focus:outline-none focus:bg-black focus:border-[#1d9bf0] transition-colors";
export const searchIconWrap     = "absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71767b] text-[18px] pointer-events-none";

// Right panel widget card (rounded-2xl surface card)
export const widgetCard         = "bg-[#16181c] rounded-2xl mb-4 overflow-hidden";
export const widgetCardTitle    = "font-bold text-[20px] text-[#e7e9ea] px-4 pt-3 pb-1";

// Trending item (What's happening / Explore trending)
export const trendItem          = "px-4 py-3 hover:bg-[#1e2126] transition-colors cursor-pointer border-t border-[#2f3336] relative";
export const trendCategory      = "text-[#71767b] text-[13px]";
export const trendTitle         = "font-bold text-[#e7e9ea] text-[15px] mt-0.5";
export const trendCount         = "text-[#71767b] text-[13px] mt-0.5";
export const trendMoreBtn       = "absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-[#71767b] hover:bg-[#2f3336]/60 hover:text-[#e7e9ea] transition-colors cursor-pointer text-[16px]";

// Who to follow widget item
export const suggestionItem     = "flex items-center justify-between px-4 py-3 hover:bg-[#1e2126] transition-colors cursor-pointer";
export const suggestionLeft     = "flex items-center gap-3 flex-1 min-w-0";
export const suggestionInfo     = "flex flex-col min-w-0";
export const suggestionName     = "font-bold text-[#e7e9ea] text-[15px] truncate leading-snug hover:underline";
export const suggestionHandle   = "text-[#71767b] text-[14px] truncate leading-snug";
export const suggestionBio      = "text-[#e7e9ea] text-[13px] truncate"; // shown in Follow page, not widget
export const widgetShowMore     = "px-4 py-3 text-[#1d9bf0] hover:bg-[#1e2126] transition-colors cursor-pointer text-[15px] w-full text-left border-t border-[#2f3336]";

// ─── EXPLORE PAGE (Image 6) ───────────────────────────────────────────────────
// Explore has search bar IN the top bar area, then tabs below
export const exploreTopBar      = "sticky top-0 z-10 bg-black/80 backdrop-blur-md px-4 pt-2 pb-0 border-b border-[#2f3336]";
export const exploreSearchWrap  = "relative mb-2";
export const exploreSettingsBtn = "absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full text-[#1d9bf0] hover:bg-[#1d9bf0]/10 transition-colors cursor-pointer text-[20px]";
// Explore tabs: For You / Trending / News / Sports / Entertainment
export const exploreTabs        = "flex border-b border-[#2f3336] overflow-x-auto [&::-webkit-scrollbar]:hidden";
export const exploreTab         = "px-4 py-4 text-[#71767b] hover:bg-[#080808] transition-colors cursor-pointer text-[15px] font-medium whitespace-nowrap relative flex-shrink-0";
export const exploreTabActive   = "px-4 py-4 text-[#e7e9ea] font-bold text-[15px] whitespace-nowrap relative flex-shrink-0 cursor-pointer";

// News / trending item in explore feed (bigger than right panel version)
export const newsItem           = "px-4 py-4 border-b border-[#2f3336] hover:bg-[#080808] transition-colors cursor-pointer";
export const newsTitle          = "font-bold text-[#e7e9ea] text-[15px] mb-1";
export const newsMeta           = "text-[#71767b] text-[13px] flex items-center gap-1.5";
export const newsAvatarGroup    = "flex -space-x-1.5 mr-1";

// ─── NOTIFICATIONS PAGE (Image 7) ────────────────────────────────────────────
export const notifItem          = "flex gap-4 px-4 py-3 border-b border-[#2f3336] hover:bg-[#080808] transition-colors cursor-pointer";
export const notifIconCol       = "w-10 flex-shrink-0 flex justify-end pt-1";
// Icon colors per type:
export const notifLikeIcon      = "text-[#f91880] text-[22px]";   // RiHeartFill
export const notifFollowIcon    = "text-[#1d9bf0] text-[22px]";   // RiUserFollowLine
export const notifCommentIcon   = "text-[#1d9bf0] text-[22px]";   // RiChat1Line
export const notifRepostIcon    = "text-[#00ba7c] text-[22px]";   // RiRepeat2Line
export const notifText          = "text-[#e7e9ea] text-[15px] leading-snug flex-1";
export const notifTextBold      = "font-bold text-[#e7e9ea] hover:underline cursor-pointer";
export const notifPostPreview   = "text-[#71767b] text-[15px] mt-1";
export const notifTime          = "text-[#71767b] text-[13px] mt-1";
export const notifUnreadDot     = "w-2 h-2 rounded-full bg-[#1d9bf0] flex-shrink-0 mt-2 ml-auto";

// Empty state for notifications (Image 7)
export const emptyStateWrap     = "flex flex-col items-start px-8 py-12";
export const emptyStateTitle    = "text-[#e7e9ea] font-bold text-[31px] mb-2 leading-tight";
export const emptyStateSub      = "text-[#71767b] text-[15px] leading-relaxed max-w-[350px]";

// ─── FOLLOW / SUGGESTIONS PAGE (Image 8) ─────────────────────────────────────
// "Suggested for you" section header
export const sectionHeader      = "px-4 py-3 font-bold text-[20px] text-[#e7e9ea]";
export const followPageItem     = "flex items-start gap-3 px-4 py-3 border-b border-[#2f3336] hover:bg-[#080808] transition-colors cursor-pointer";
export const followPageName     = "font-bold text-[#e7e9ea] text-[15px] hover:underline cursor-pointer leading-snug";
export const followPageHandle   = "text-[#71767b] text-[14px] leading-snug";
export const followPageBio      = "text-[#e7e9ea] text-[14px] mt-0.5 line-clamp-2";

// ─── CHAT PAGE (Image 9) ──────────────────────────────────────────────────────
// Chat uses a DIFFERENT layout — sidebar collapses to icon-only strip
export const chatLayout         = "flex h-screen bg-black";
export const chatSidebar        = "w-[400px] flex-shrink-0 border-r border-[#2f3336] flex flex-col";
export const chatSidebarHeader  = "px-4 py-3 flex items-center justify-between border-b border-[#2f3336] h-[53px]";
export const chatSidebarTitle   = "font-bold text-[20px] text-[#e7e9ea]";
export const chatFilterBtn      = "flex items-center gap-1.5 border border-[#2f3336] text-[#e7e9ea] rounded-full px-3 py-1 text-[14px] hover:bg-[#1e2126] transition-colors cursor-pointer";
export const chatNewBtn         = "w-9 h-9 flex items-center justify-center rounded-full border border-[#2f3336] text-[#e7e9ea] hover:bg-[#1e2126] transition-colors cursor-pointer text-[18px]";
export const chatSearch         = "mx-4 my-2 relative";
export const chatSearchInput    = "w-full bg-[#202327] rounded-full pl-10 pr-4 py-2 text-[#e7e9ea] text-[15px] placeholder:text-[#71767b] outline-none";
export const chatMain           = "flex-1 flex flex-col items-center justify-center text-center px-6";
export const chatEmptyIcon      = "text-[80px] text-[#e7e9ea] mb-5 opacity-90"; // speech bubble icon
export const chatEmptyTitle     = "font-bold text-[31px] text-[#e7e9ea] mb-2";
export const chatEmptySub       = "text-[#71767b] text-[15px] leading-relaxed max-w-[340px]";
export const chatNewChatBtn     = "mt-6 bg-[#e7e9ea] hover:bg-[#d0d0d0] text-black font-bold px-5 py-2.5 rounded-full text-[15px] transition-colors cursor-pointer";

// ─── PROFILE PAGE (Images 10, 11) ─────────────────────────────────────────────
export const profileBanner      = "h-[200px] w-full object-cover bg-[#333639] cursor-pointer relative overflow-hidden";
export const profileBannerEdit  = "absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-white text-[28px]";
export const profileAvatarWrap  = "relative -mt-[66px] ml-4 mb-3 w-fit";
export const profileAvatarRing  = "rounded-full border-4 border-black"; // wraps avatarXl
export const profileAvatarEdit  = "absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-white text-[24px]";

// Profile header info
export const profileName        = "font-bold text-[20px] text-[#e7e9ea] leading-tight";
export const profileHandle      = "text-[#71767b] text-[15px] mt-0.5";
export const profileBio         = "text-[#e7e9ea] text-[15px] mt-3 leading-relaxed";
export const profileMeta        = "flex flex-wrap items-center gap-x-4 gap-y-1 text-[#71767b] text-[15px] mt-2";
export const profileMetaIcon    = "inline-flex items-center gap-1.5";
export const profileJoined      = "text-[#71767b] text-[15px] flex items-center gap-1.5 mt-1";
// Following / Followers counts
export const profileStats       = "flex gap-5 mt-3";
export const profileStatItem    = "flex items-center gap-1 hover:underline cursor-pointer";
export const profileStatNum     = "font-bold text-[#e7e9ea] text-[15px]";
export const profileStatLabel   = "text-[#71767b] text-[15px]";
// Post count in top bar subtitle
export const profilePostCount   = "text-[#71767b] text-[13px] mt-px";

// Profile action buttons (top right of profile header)
export const profileActionsRow  = "flex items-center gap-2 ml-auto mt-3";
export const profileMoreBtn     = "w-9 h-9 flex items-center justify-center rounded-full border border-[#536471] text-[#e7e9ea] hover:bg-[#1e2126] transition-colors cursor-pointer text-[18px]";
export const profileMessageBtn  = "w-9 h-9 flex items-center justify-center rounded-full border border-[#536471] text-[#e7e9ea] hover:bg-[#1e2126] transition-colors cursor-pointer text-[18px]";
export const editProfileBtn     = "border border-[#536471] text-[#e7e9ea] font-bold px-4 py-1.5 rounded-full text-[15px] hover:bg-[#1e2126] transition-colors cursor-pointer";

// Profile tabs: Posts / Replies / Highlights / Articles / Media / Likes
export const profileTabs        = "flex border-b border-[#2f3336] overflow-x-auto [&::-webkit-scrollbar]:hidden";
export const profileTab         = "flex-1 min-w-fit py-4 px-2 text-center text-[#71767b] hover:bg-[#080808] transition-colors cursor-pointer text-[15px] font-medium whitespace-nowrap relative";
export const profileTabActive   = "flex-1 min-w-fit py-4 px-2 text-center text-[#e7e9ea] font-bold text-[15px] whitespace-nowrap relative cursor-pointer";
export const profileTabIndicator= "absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-14 bg-[#1d9bf0] rounded-full";

// ─── EDIT PROFILE MODAL (Image 12) ───────────────────────────────────────────
export const editModalOverlay   = "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-8 px-4";
export const editModalBox       = "bg-black border border-[#2f3336] rounded-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden";
export const editModalHeader    = "flex items-center gap-6 px-4 py-3 sticky top-0 bg-black/90 backdrop-blur-sm z-10 border-b border-[#2f3336]";
export const editModalClose     = "w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#181818] transition-colors cursor-pointer text-[#e7e9ea] text-[18px]";
export const editModalTitle     = "font-bold text-[20px] text-[#e7e9ea] flex-1";
export const editModalSaveBtn   = "bg-[#e7e9ea] hover:bg-[#d0d0d0] text-black font-bold px-4 py-1.5 rounded-full text-[15px] transition-colors cursor-pointer";

// Edit profile form fields (Name, Bio, Location, Website — bottom border style)
export const editFieldWrap      = "relative border-b border-[#2f3336] focus-within:border-[#1d9bf0] transition-colors px-4 py-2 mb-1";
export const editFieldLabel     = "text-[#1d9bf0] text-[13px] font-normal mb-1 block";
export const editFieldInput     = "w-full bg-transparent text-[#e7e9ea] text-[17px] outline-none resize-none";
export const editFieldCount     = "text-[#71767b] text-[12px] text-right mt-1";
// Birth date row (shows date + chevron — navigates to a sub-page)
export const editBirthDateRow   = "px-4 py-4 border-b border-[#2f3336] flex items-center justify-between hover:bg-[#080808] cursor-pointer";
export const editBirthDateLabel = "text-[#1d9bf0] text-[13px] mb-0.5";
export const editBirthDateVal   = "text-[#e7e9ea] text-[17px]";

// ─── SETTINGS PAGE (Image 13) ─────────────────────────────────────────────────
// Two-panel: left = settings menu list, right = content panel
export const settingsLayout     = "flex min-h-screen";
export const settingsMenu       = "w-[340px] flex-shrink-0 border-r border-[#2f3336] px-0";
export const settingsMenuTitle  = "font-bold text-[20px] text-[#e7e9ea] px-4 py-3 border-b border-[#2f3336]";
export const settingsMenuItem   = "flex items-center justify-between px-4 py-3.5 hover:bg-[#080808] transition-colors cursor-pointer text-[15px] text-[#e7e9ea]";
export const settingsMenuActive = "flex items-center justify-between px-4 py-3.5 bg-[#080808] transition-colors cursor-pointer text-[15px] text-[#e7e9ea] font-bold";
export const settingsMenuChevron= "text-[#71767b] text-[16px]";
export const settingsSearch     = "mx-4 my-3 relative";
export const settingsSearchInput= "w-full bg-[#202327] rounded-full pl-10 pr-4 py-2 text-[#e7e9ea] text-[14px] placeholder:text-[#71767b] outline-none";
export const settingsContent    = "flex-1 px-0";
export const settingsContentTitle = "font-bold text-[20px] text-[#e7e9ea] px-4 py-3 border-b border-[#2f3336]";
export const settingsContentSub = "text-[#71767b] text-[14px] px-4 py-2";
// Settings row item (Account info / Change password / Deactivate)
export const settingsRow        = "flex items-center gap-4 px-4 py-4 hover:bg-[#080808] transition-colors cursor-pointer border-b border-[#2f3336]";
export const settingsRowIcon    = "text-[#71767b] text-[20px] flex-shrink-0";
export const settingsRowContent = "flex-1 min-w-0";
export const settingsRowTitle   = "text-[#e7e9ea] text-[15px] leading-snug";
export const settingsRowSub     = "text-[#71767b] text-[13px] leading-snug mt-0.5";
export const settingsRowChevron = "text-[#71767b] text-[18px] flex-shrink-0";

// ─── BUTTONS (all variants) ───────────────────────────────────────────────────
// Follow / Unfollow state machine
export const followBtn          = "bg-[#e7e9ea] hover:bg-[#d0d0d0] text-black font-bold px-4 py-1.5 rounded-full text-[15px] transition-colors cursor-pointer";
export const followingBtn       = "border border-[#536471] text-[#e7e9ea] font-bold px-4 py-1.5 rounded-full text-[15px] cursor-pointer hover:border-[#f4212e] hover:text-[#f4212e] hover:bg-[#f4212e]/10 transition-colors"; // shows "Unfollow" text + red on hover
export const primaryBtn         = "bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold px-4 py-1.5 rounded-full text-[15px] transition-colors cursor-pointer";
export const secondaryBtn       = "border border-[#536471] text-[#e7e9ea] font-bold px-4 py-1.5 rounded-full text-[15px] hover:bg-[#1e2126] transition-colors cursor-pointer";
export const dangerBtn          = "bg-[#f4212e] hover:bg-[#d92838] text-white font-bold px-4 py-1.5 rounded-full text-[15px] transition-colors cursor-pointer";
export const dangerOutlineBtn   = "border border-[#f4212e] text-[#f4212e] font-bold px-4 py-1.5 rounded-full text-[15px] hover:bg-[#f4212e]/10 transition-colors cursor-pointer";
export const ghostBtn           = "text-[#1d9bf0] hover:underline cursor-pointer text-[15px] font-bold bg-transparent border-none";
// Large full-width buttons (used in auth, confirm dialogs)
export const largePrimaryBtn    = "w-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold py-3.5 rounded-full text-[17px] transition-colors cursor-pointer disabled:opacity-50";
export const largeWhiteBtn      = "w-full bg-[#e7e9ea] hover:bg-[#d0d0d0] text-black font-bold py-3.5 rounded-full text-[17px] transition-colors cursor-pointer disabled:opacity-50";
export const largeDangerBtn     = "w-full bg-[#f4212e] hover:bg-[#d92838] text-white font-bold py-3.5 rounded-full text-[17px] transition-colors cursor-pointer";

// ─── MODALS (generic) ─────────────────────────────────────────────────────────
export const modalOverlay       = "fixed inset-0 bg-black/98 backdrop-blur-sm z-50 flex items-center justify-center p-4";
export const modalBox           = "bg-black border border-[#2f3336] rounded-2xl w-[620px] max-w-[95vw] max-h-[92vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#2f3336] scrollbar-track-transparent";
export const modalHeader        = "flex items-center gap-4 px-4 py-3 sticky top-0 bg-black/90 backdrop-blur-sm z-10";
export const modalClose         = "w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#181818] transition cursor-pointer text-[#e7e9ea] text-[24px]";
export const modalTitle         = "font-bold text-[20px] text-[#e7e9ea]";
export const modalBody          = "px-6 pb-6 pt-2";

// Confirm/Destructive modal (e.g. "Deactivate account?" "Delete post?")
export const confirmModal       = "bg-black border border-[#2f3336] rounded-2xl w-full max-w-[320px] p-8 text-center";
export const confirmTitle       = "font-bold text-[23px] text-[#e7e9ea] mb-2";
export const confirmBody        = "text-[#71767b] text-[15px] mb-6 leading-relaxed";

// ─── FOLLOWERS / FOLLOWING LIST (modal or page) ──────────────────────────────
export const followListItem     = "flex items-center justify-between px-4 py-3 hover:bg-[#080808] transition-colors border-b border-[#2f3336]";
export const followListLeft     = "flex items-center gap-3 flex-1 min-w-0";
export const followListName     = "font-bold text-[#e7e9ea] text-[15px] hover:underline cursor-pointer truncate";
export const followListHandle   = "text-[#71767b] text-[14px] truncate";
export const followListBio      = "text-[#71767b] text-[13px] mt-0.5 truncate";

// ─── BADGES & PILLS ───────────────────────────────────────────────────────────
export const badgeBlue          = "inline-flex items-center px-2 py-0.5 rounded-full bg-[#1d9bf0]/20 text-[#1d9bf0] text-[11px] font-bold";
export const badgeRed           = "inline-flex items-center px-2 py-0.5 rounded-full bg-[#f4212e]/20 text-[#f4212e] text-[11px] font-bold";
export const badgeGreen         = "inline-flex items-center px-2 py-0.5 rounded-full bg-[#00ba7c]/20 text-[#00ba7c] text-[11px] font-bold";
export const badgeAmber         = "inline-flex items-center px-2 py-0.5 rounded-full bg-[#ffd400]/20 text-[#ffd400] text-[11px] font-bold";
export const badgeGray          = "inline-flex items-center px-2 py-0.5 rounded-full bg-[#71767b]/20 text-[#71767b] text-[11px] font-bold";

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
export const statCard           = "bg-[#16181c] rounded-2xl p-5 border border-[#2f3336]";
export const statNum            = "text-[32px] font-bold text-[#e7e9ea] leading-none";
export const statLabel          = "text-[#71767b] text-[14px] mt-2";
export const adminTable         = "w-full text-[15px]";
export const adminTh            = "text-left py-3 px-4 text-[#71767b] text-[13px] font-medium border-b border-[#2f3336]";
export const adminTd            = "py-3 px-4 border-b border-[#2f3336] text-[#e7e9ea]";
export const adminRow           = "hover:bg-[#080808] transition-colors";

// ─── FEEDBACK STATES ──────────────────────────────────────────────────────────
export const errorAlert         = "bg-[#f4212e]/10 text-[#f4212e] border border-[#f4212e]/30 rounded-xl px-4 py-3 text-[14px]";
export const successAlert       = "bg-[#00ba7c]/10 text-[#00ba7c] border border-[#00ba7c]/30 rounded-xl px-4 py-3 text-[14px]";
export const loadingSpinner     = "w-6 h-6 border-2 border-[#2f3336] border-t-[#1d9bf0] rounded-full animate-spin";
export const loadingCenter      = "flex justify-center items-center py-10";

// Skeleton loaders
export const skeletonLine       = "animate-pulse bg-[#2f3336] rounded-full h-3";
export const skeletonCircle     = (size="w-10 h-10") => `animate-pulse bg-[#2f3336] rounded-full ${size}`;
export const skeletonRect       = "animate-pulse bg-[#2f3336] rounded-xl";

// ─── MOBILE BOTTOM NAV ────────────────────────────────────────────────────────
export const bottomNav          = "fixed bottom-0 left-0 right-0 flex border-t border-[#2f3336] bg-black z-20 xl:hidden";
export const bottomNavItem      = "flex-1 flex flex-col items-center justify-center py-3 text-[#71767b] gap-0.5 relative";
export const bottomNavItemActive= "flex-1 flex flex-col items-center justify-center py-3 text-[#e7e9ea] gap-0.5 relative";

// ─── MISC UTILITIES ───────────────────────────────────────────────────────────
export const divider            = "border-t border-[#2f3336]";
export const sectionDivider     = "border-t-8 border-[#16181c]"; // thick surface break between sections
export const linkText           = "text-[#1d9bf0] hover:underline cursor-pointer";
export const mutedText          = "text-[#71767b] text-[15px]";
export const dot                = "w-1 h-1 rounded-full bg-[#71767b] inline-block mx-1";

// react-icons/ri reference map for this project:
// RiHome7Line / RiHome7Fill        → Home
// RiSearchLine                     → Explore / Search
// RiBellLine / RiBellFill          → Notifications
// RiUserAddLine                    → Follow (People+)
// RiChat1Line / RiChat1Fill        → Chat / Comment action
// RiBookmarkLine / RiBookmarkFill  → Bookmark
// RiUserLine / RiUserFill          → Profile
// RiMoreLine                       → ⋯ more (horizontal dots)
// RiRepeat2Line                    → Repost
// RiHeartLine / RiHeartFill        → Like
// RiBarChartLine                   → Views (bar chart — exact X icon)
// RiUploadLine                     → Share
// RiArrowLeftLine                  → Back
// RiSettings4Line                  → Settings gear
// RiImageAddLine                   → Add photo in composer
// RiMapPinLine                     → Location
// RiCalendarLine                   → Joined date
// RiLinkM                          → Website link
// RiVerifiedBadgeFill              → Verified checkmark (blue)