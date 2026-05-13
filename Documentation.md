# X/Twitter Clone — Project Documentation

## What Is This?

A full-stack Twitter/X clone built from scratch as a learning project. The goal is to replicate core Twitter functionality — auth, posting, likes, comments, follows, notifications, and admin moderation — using a modern, production-style stack.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcrypt |
| File Storage | Cloudinary (images) |
| File Handling | Multer (memory storage, 25MB limit, JPG/PNG only) |
| Frontend | Vite + React + Tailwind CSS |

---

## What Can Users Do?

- Register and login (with optional profile image upload to Cloudinary)
- Logout and page-refresh auth check
- Change password
- Deactivate their own account (requires password confirmation, soft delete)
- Reactivate a deactivated account
- Create posts (text + optional image via Cloudinary)
- Edit their own posts (tracks `isEdited` flag and `editedAt` timestamp)
- Soft delete and recover their own posts
- Like and unlike posts
- Comment on posts and delete their own comments
- View a post's full likes list and comments list
- Follow and unfollow other users
- Remove a follower from their own followers list
- View own and other users' followers/following lists
- View own and other users' profiles (with `isOwnProfile` and `isFollowing` flags)
- Update profile (firstName, lastName, username, bio, gender, profile image)
- Delete profile image (removes from Cloudinary too)
- Search users by username, firstName, or lastName
- Get "People You May Know" suggestions (excludes self and already-following)
- View a user's posts by username (paginated)
- Get post count for any user profile
- View a following feed (posts from people you follow, paginated)
- View an explore feed (all posts from active users, paginated)
- Get notifications (likes, comments, follows)
- View unread notification count (for bell badge)
- Mark all notifications as read
- Delete a single notification
- Clear all notifications

## What Can Admins Do?

- View all users (excluding password, followers, following arrays)
- Block a user (cannot block self or another admin)
- Unblock a user
- View all posts including soft-deleted ones
- Hard delete any post permanently
- View dashboard stats (total users, blocked, deactivated, total posts, deleted posts)

---

## Roadmap

### ✅ Phase 1 — Database Schemas (Done)

**User Schema** — firstName, lastName, username (unique), email (unique), password, gender, DOB (16+ validation), bio, profileImageUrl, isAdmin, isDeactivated, isBlocked, followerCount, followingCount, followers[ ], following[ ]

**Post Schema** — userId, description, mediaUrl, isDeleted, isEdited, editedAt, likes[ ], likeCount, comments[ ], commentCount

**Notification Schema** — toUserId, fromUserId, type (like/comment/follow), postId (null for follows), isRead

> Likes and comments are embedded inside the Post document. Follows are embedded inside the User document. Counts are stored separately (denormalized) for fast reads and synced manually on every like/unlike/follow/unfollow operation. Notifications live in a separate collection to keep user documents lean.

---

### ✅ Phase 2 — Backend (Done)

#### Step 1 — Server Setup ✅
- Express server with CORS (origin whitelist + filter(Boolean) for undefined env vars), cookie-parser, express.json
- MongoDB connection with Mongoose
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
| POST | `/login` | Login, sets httpOnly cookie |
| POST | `/logout` | Clears token cookie |
| GET | `/check-auth` | Page refresh auth check, returns full user payload |
| PUT | `/change-password` | Change password (requires current + new password) |
| POST | `/reactivate` | Reactivate a deactivated account |

---

**Users (`/user-api`)** ✅
| Method | Route | Description |
|---|---|---|
| GET | `/profile/:username` | Get own or another user's profile |
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
| GET | `/search?q=` | Search users by username/firstName/lastName |
| GET | `/suggestions` | People you may know |
| GET | `/posts/:username` | Get a user's posts (paginated) |

---

**Posts (`/post-api`)** ✅
| Method | Route | Description |
|---|---|---|
| POST | `/createpost` | Create post with optional image upload to Cloudinary |
| GET | `/viewpost/:id` | View a single post |
| DELETE | `/delpost/:id` | Soft delete own post |
| PATCH | `/recover/:id` | Recover a soft-deleted post |
| PATCH | `/editpost/:id` | Edit post description (sets isEdited + editedAt) |
| PATCH | `/likepost/:id` | Like a post |
| PATCH | `/unlikepost/:id` | Unlike a post |
| POST | `/comment/:id` | Add a comment |
| DELETE | `/delcomment/:postId/:commentId` | Delete own comment |
| GET | `/likes/:id` | Get full likes list for a post |
| GET | `/comments/:id` | Get full comments list for a post |
| GET | `/feed` | Following feed (paginated) |
| GET | `/explore` | Explore feed — all active users' posts (paginated) |
| GET | `/count/:username` | Get post count for a user |

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
| GET | `/` | Get all notifications (populated) |
| GET | `/unreadcount` | Get unread notification count |
| PATCH | `/markread` | Mark all notifications as read |
| DELETE | `/clear` | Clear all notifications |
| DELETE | `/:id` | Delete a single notification |

> Notifications are auto-created inside follow, like, and comment routes. They are auto-deleted when a user unlikes, unfollows, or deletes a comment. Follow and like notifications are deduplicated (old one deleted before new one created) to prevent stacking.

#### Step 3 — Auth Middleware ✅
- `verifyToken` — JWT verification, attaches full user to `req.user`, checks blocked/deactivated on every request
- `verifyAdmin` — additional isAdmin check layered on top of verifyToken for all admin routes
- `errorHandler` — global error handler covering all known error types

#### Step 4 — File Handling ✅
- Multer configured with memory storage, 25MB limit, JPG/PNG only
- Cloudinary upload utility used in register, updateProfile, and createpost
- Cloudinary cleanup on failure in all three upload routes
- Profile image delete extracts public_id from URL and destroys from Cloudinary

---

### ⏳ Phase 3 — Frontend (Upcoming)

**Pages**
- Landing Page
- Login
- Register
- Home Feed
- Profile (own + other users)
- Explore
- Notifications (PopUp)
- Chat
- Bookmarks
- More (Dropdown)
- Admin Dashboard

**Key Components**
- TweetCard (with edit, delete, like, comment, isEdited label)
- TweetComposer (text + image upload)
- Feed (following feed + explore tab)
- ProfileHeader (with follow/unfollow, edit profile, remove follower)
- FollowButton
- NotificationItem (like / comment / follow)
- SearchBar with suggestions
- AdminUserTable + AdminPostTable

**State Management**
- React Query — server state (posts, users, notifications, feeds)
- Zustand — auth state (logged-in user, profileImageUrl, isAdmin flag)

---

### 🔮 Future Agenda

- **Real-time Chat** — direct messages between users (WebSockets / Socket.io)
- **Real-time Notifications** — push notifications via Socket.io instead of polling
- **Repost / Quote Tweet** — share another user's post with optional comment
- **Bookmark / Save Posts** — save posts to read later
- **Video support** — extend Cloudinary upload to support video mediaType
- **Refresh Token** — replace 1h JWT expiry with proper refresh token mechanism
- **Email Verification** — verify email on registration before allowing login
- **Public / Private Accoun** - to create private accounts