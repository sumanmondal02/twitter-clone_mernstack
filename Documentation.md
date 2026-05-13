# X/Twitter Clone — Project Documentation

## What Is This?

A full-stack Twitter/X clone built from scratch as a learning project. The goal is to replicate core Twitter functionality — auth, posting, likes, comments, follows, notifications, search, trending, and admin moderation — using a modern, production-style stack.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcrypt |
| File Storage | Cloudinary (images) |
| File Handling | Multer (memory storage, 15MB limit, JPG/PNG only) |
| Frontend | Vite + React + Tailwind CSS |
| State Management | Zustand |
| Routing | React Router v6 |
| Notifications (UI) | react-hot-toast |

---

## What Can Users Do?

- Register and login (with optional profile image upload to Cloudinary)
- Logout and page-refresh auth check
- Change password and forgot/reset password via email link
- Deactivate their own account (requires password confirmation, soft delete)
- Reactivate a deactivated account
- Create posts (text + optional image via Cloudinary)
- Schedule posts for a future date and time
- Edit their own posts (tracks `isEdited` flag and `editedAt` timestamp)
- Soft delete (archive) and recover their own posts
- Like and unlike posts
- Comment on posts and delete their own comments
- View a post's full likes list and comments list
- Follow and unfollow other users
- Remove a follower from their own followers list
- View own and other users' followers/following lists with follow/unfollow actions inline
- View own and other users' profiles (with `isOwnProfile` and `isFollowing` flags)
- Update profile (firstName, lastName, username, bio, gender, dob, profile image)
- Delete profile image (removes from Cloudinary too)
- Search users dynamically by username, firstName, or lastName with follow/unfollow in results
- Get "Who to Follow" suggestions (excludes self, already-following, and admins)
- View a user's posts by username (paginated with infinite scroll)
- Filter own profile posts by All / Active / Archived
- View replies tab (grouped by post, with delete reply option)
- View liked posts tab (sorted by most recently liked)
- Get post count for any user profile
- View a following feed (posts from people you follow, paginated)
- View an explore feed (all posts from active users, paginated)
- View trending hashtags (top 5 extracted from post descriptions, fetched from backend)
- Click a trending hashtag to view all posts containing it
- Get notifications (likes, comments, follows) with unread/past tabs
- View unread notification count badge on bell icon (polled every 30s)
- Mark all notifications as read
- Delete a single notification or clear all
- Image lightbox for full-size post image viewing
- Emoji picker and schedule popover in post composer
- Responsive layout — sidebar panel for desktop, bottom sheet for mobile (search, notifications)
- Auto-focus search input when search panel opens
- 404 catch-all route — redirects logged-in users to home, guests to landing page, with toast
- Terms, Privacy, and Cookies pages

## What Can Admins Do?

- Access admin dashboard via Profile nav item (redirects to `/admin`)
- View dashboard stats (total users, blocked, deactivated, total posts, archived posts)
- Search and view all users with block/unblock actions inline
- Block a user (cannot block self or another admin)
- Unblock a user
- View all posts including soft-deleted and scheduled ones
- Hard delete any post permanently (cannot be recovered)
- Admin profiles are hidden from regular users (URL access returns 403)
- Admins do not appear in search results or "Who to Follow" suggestions
- Admin cannot follow users (no follow button shown)

---

## Roadmap

### ✅ Phase 1 — Database Schemas (Done)

**User Schema** — firstName, lastName, username (unique), email (unique), password, gender, DOB (16+ validation), bio, profileImageUrl, profileImagePublicId, isAdmin, isDeactivated, isBlocked, followerCount, followingCount, followers[ ], following[ ], passwordResetVersion

**Post Schema** — userId, description, mediaUrl, isDeleted, deletedAt, isEdited, editedAt, isScheduled, scheduledFor, isPublished, likes[ ] (with timestamps), likeCount, comments[ ] (with timestamps), commentCount

**Notification Schema** — toUserId, fromUserId, type (like/comment/follow), postId (null for follows), isRead

> Likes and comments are embedded inside the Post document. Follows are embedded inside the User document. Counts are stored separately (denormalized) for fast reads and synced manually on every like/unlike/follow/unfollow operation. Notifications live in a separate collection to keep user documents lean. Like subdocuments have `_id: true` and `timestamps: true` to enable sorting liked posts by most recently liked.

---

### ✅ Phase 2 — Backend (Done)

#### Step 1 — Server Setup ✅
- Express server with CORS (origin whitelist + filter(Boolean) for undefined env vars), cookie-parser, express.json
- MongoDB connection with Mongoose
- Node-cron job for publishing scheduled posts
- 404 handler and global error handler (handles ValidationError, CastError, duplicate key 11000, JWT errors, Multer errors, StrictModeError, CORS errors)

#### Step 2 — API Routes

| Router | Prefix |
|---|---|
| Authentication | `/auth` |
| Users | `/user-api` |
| Posts | `/post-api` |
| Admin | `/admin-api` |
| Notifications | `/notification-api` |

---

**Auth (`/auth`)** ✅
| Method | Route | Description |
|---|---|---|
| POST | `/register` | Register with optional profile image upload |
| POST | `/login` | Login, sets httpOnly cookie (includes isAdmin in JWT) |
| POST | `/logout` | Clears token cookie |
| GET | `/check-auth` | Page refresh auth check, returns full user payload |
| PUT | `/change-password` | Change password (requires current + new password) |
| POST | `/forgot-password` | Send password reset link via email (10min expiry) |
| PUT | `/reset-password/:token` | Reset password via token (invalidates old links via version) |
| POST | `/reactivate` | Reactivate a deactivated account |

---

**Users (`/user-api`)** ✅
| Method | Route | Description |
|---|---|---|
| GET | `/profile/:username` | Get own or another user's profile (admins hidden from regular users) |
| PUT | `/updateProfile` | Update profile fields + optional new image upload |
| DELETE | `/profileImage` | Delete profile image from DB and Cloudinary |
| PUT | `/deactivate` | Deactivate own account (requires password) |
| POST | `/follow/:id` | Follow a user |
| DELETE | `/unfollow/:id` | Unfollow a user |
| DELETE | `/removeFollower/:id` | Remove someone from your followers |
| GET | `/followerslist` | Own followers list |
| GET | `/followinglist` | Own following list |
| GET | `/followerslist/:username` | Another user's followers list |
| GET | `/followinglist/:username` | Another user's following list |
| GET | `/followers/:username` | Followers with isFollowing flag per entry |
| GET | `/following/:username` | Following with isFollowing flag per entry |
| GET | `/search?q=` | Search users by username/firstName/lastName (excludes admins, returns isFollowing) |
| GET | `/suggestions` | Who to follow — excludes self, following, admins |
| GET | `/posts/:username` | Get a user's posts |

---

**Posts (`/post-api`)** ✅
| Method | Route | Description |
|---|---|---|
| POST | `/createpost` | Create post with optional image upload, optional scheduledDate |
| GET | `/viewpost/:id` | View a single post |
| DELETE | `/delpost/:id` | Soft delete own post |
| PATCH | `/recover/:id` | Recover a soft-deleted post |
| PATCH | `/editpost/:id` | Edit post description, schedule, or publish now |
| PATCH | `/likepost/:id` | Like a post |
| PATCH | `/unlikepost/:id` | Unlike a post |
| POST | `/comment/:id` | Add a comment |
| DELETE | `/delcomment/:postId/:commentId` | Delete own comment |
| GET | `/likes/:id` | Get full likes list for a post |
| GET | `/comments/:id` | Get full comments list for a post |
| GET | `/feed` | Following feed (paginated) |
| GET | `/explore` | Explore feed — all active users' posts (paginated) |
| GET | `/count/:username` | Get post count for a user |
| GET | `/profile-posts/:username` | Profile posts with filter (all/active/deleted) and pagination |
| GET | `/replies/:username` | All replies by a user, grouped and sorted by recency |
| GET | `/liked-posts/:username` | Posts liked by user, sorted by most recently liked |
| GET | `/trending` | Top 5 trending hashtags extracted from post descriptions |
| GET | `/hashtag/:tag` | All posts containing a specific hashtag |

---

**Admin (`/admin-api`)** ✅
| Method | Route | Description |
|---|---|---|
| GET | `/users` | List all users |
| PATCH | `/users/:id/block` | Block a user |
| PATCH | `/users/:id/unblock` | Unblock a user |
| GET | `/posts` | View all posts including soft-deleted |
| DELETE | `/posts/:id` | Hard delete a post permanently |
| GET | `/stats` | Dashboard stats |

---

**Notifications (`/notification-api`)** ✅
| Method | Route | Description |
|---|---|---|
| GET | `/` | Get all notifications (populated, latest 20) |
| GET | `/unreadcount` | Get unread notification count |
| PATCH | `/markread` | Mark all notifications as read |
| DELETE | `/clear` | Clear all notifications (must be defined before `/:id`) |
| DELETE | `/:id` | Delete a single notification |

> Notifications are auto-created inside follow, like, and comment routes. They are auto-deleted when a user unlikes, unfollows, or deletes a comment. Follow and like notifications are deduplicated (old one deleted before new one created) to prevent stacking.

#### Step 3 — Auth Middleware ✅
- `verifyToken` — JWT verification, attaches full user to `req.user`, checks blocked/deactivated on every request
- `verifyAdmin` — additional isAdmin check layered on top of verifyToken for all admin routes
- `errorHandler` — global error handler covering all known error types

#### Step 4 — File Handling ✅
- Multer configured with memory storage, 15MB limit, JPG/PNG only
- Cloudinary upload utility used in register, updateProfile, and createpost
- Cloudinary cleanup on failure in all three upload routes
- Profile image delete extracts public_id from URL and destroys from Cloudinary

---

### ✅ Phase 3 — Frontend (Done)

**Pages**
- Landing Page (with Terms, Privacy, Cookies links)
- Login (email or username)
- Register (with optional profile image)
- Forgot Password / Reset Password (email link flow)
- Home Feed (For You + Following tabs, infinite scroll)
- Profile (own + other users, Posts/Replies/Likes tabs, filter dropdown, infinite scroll)
- Hashtag Feed (`/explore/:tag` — posts filtered by hashtag, with back button)
- Admin Dashboard (`/admin` — Stats, Users, Posts tabs)
- Messages (coming soon placeholder)
- Bookmarks (coming soon placeholder)
- Terms, Privacy, Cookies (static info pages)
- 404 Catch-All (redirects with toast)

**Key Components**
- `PostCard` — edit, archive/unarchive, like, comment, delete comment, image lightbox, edit mode inline, responsive date/time (inline on desktop, stacked on mobile)
- `PostComposer` — text + image upload, emoji picker, schedule popover, character count
- `FeedList` — infinite scroll with skeleton loaders
- `FeedTabs` — For You / Following toggle
- `LeftSidebar` — nav with active states, Search panel trigger, Notification panel trigger with unread badge, Post button (desktop wide + mobile circle), user card with logout popup
- `RightSidebar` — trending hashtags (top 5, clickable), who to follow (suggestions with follow button), footer links
- `SearchPanel` — slide-in desktop panel / bottom sheet mobile, debounced search, follow/unfollow inline, clear button inside input, auto-focus
- `NotificationPanel` — slide-in desktop / bottom sheet mobile, Unread/Past tabs, mark all read, clear all, delete single, unread dot indicator, type icons (heart/comment/follow)
- `ProfilePostsSkeleton` — animated skeleton loader
- `EditProfileModal` — update name, username, bio, gender, dob, profile image, remove image
- `FollowModal` — followers/following list with search, follow/unfollow/remove actions
- `ComposerModal` — post composer in a portal modal
- `ImageLightbox` — full-size image overlay
- `AppLayout` — wraps left + right sidebar around feed column

**State Management (Zustand Stores)**
- `authStore` — currentUser, login, logout, checkAuth, updateCurrentUser, register
- `postStore` — posts, profilePosts, replies, likedPosts, feed pagination, all post actions (toggleLike updates all 4 arrays simultaneously)
- `profileStore` — profile, isOwnProfile, isFollowing, followUser, unfollowUser
- `followStore` — followers, following, follow/unfollow/remove actions in modals
- `notificationStore` — notifications, unreadCount, fetchNotifications, markAllRead, deleteNotification, clearAll, showPast toggle
- `searchStore` — results, query, debounced searchUsers, clearSearch
- `trendingStore` — trends, fetchTrends (from backend)
- `suggestionsStore` — suggestions, fetchSuggestions, followUser (removes from list on follow)

---

### 🔮 Future Agenda

- **Real-time Chat** — direct messages between users (WebSockets / Socket.io)
- **Real-time Notifications** — push notifications via Socket.io instead of polling
- **Repost** — share another user's post with optional comment
- **Bookmark / Save Posts** — save posts to read later
- **Video support** — extend Cloudinary upload to support video mediaType
- **Refresh Token** — replace 1h JWT expiry with proper refresh token mechanism
- **Email Verification** — verify email on registration before allowing login
- **Public / Private Account** — private accounts require follow approval
- **Post Detail Page** — click a post to view it with full comment thread
- **Scheduled Posts Manager** — view, edit, cancel scheduled posts from profile