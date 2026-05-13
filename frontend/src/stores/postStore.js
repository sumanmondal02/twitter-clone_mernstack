import { create } from "zustand";
import axios from "axios";

const API = import.meta.env.VITE_URL;

const opts = {
  withCredentials: true,
};

// Zustand store for managing posts, feeds, likes, comments and replies
export const usePost = create((set, get) => ({
  posts: [],
  profilePosts: [],
  profilePostsFilter: "all",
  profilePostsPage: 1,
  profilePostsHasMore: true,
  isLoadingProfilePosts: false,
  isFetchingMoreProfilePosts: false,
  feedType: "explore",
  isLoadingFeed: false,
  isFetchingMore: false,
  isPosting: false,
  isLiking: false,
  replies: [],
  isLoadingReplies: false,
  likedPosts: [],
  isLoadingLikedPosts: false,
  error: null,
  page: 1,
  hasMore: true,
  activeCommentPostId: null,

  // FEED TYPE
  // Set feed type and reset pagination
  setFeedType: (type) => {
    set({
      feedType: type,
      posts: [],
      page: 1,
      hasMore: true,
    });
  },

  // FETCH EXPLORE FEED
  // Load explore feed posts with pagination
  fetchExploreFeed: async () => {
    try {
      const { page, posts } = get();
      set({
        isLoadingFeed: page === 1,
        isFetchingMore: page > 1,
        error: null,
      });
      const res = await axios.get(
        `${API}/post-api/explore?page=${page}&limit=10`,
        opts
      );
      const newPosts = res.data.payload || [];
      set({
        posts: page === 1 ? newPosts : [...posts, ...newPosts],
        page: page + 1,
        hasMore: res.data.hasMore,
        isLoadingFeed: false,
        isFetchingMore: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch explore feed",
        isLoadingFeed: false,
        isFetchingMore: false,
      });
    }
  },

  // FETCH FOLLOWING FEED
  // Load posts from followed users with pagination
  fetchFollowingFeed: async () => {
    try {
      const { page, posts } = get();
      set({
        isLoadingFeed: page === 1,
        isFetchingMore: page > 1,
        error: null,
      });
      const res = await axios.get(
        `${API}/post-api/feed?page=${page}&limit=10`,
        opts
      );
      const newPosts = res.data.posts || [];
      set({
        posts: page === 1 ? newPosts : [...posts, ...newPosts],
        page: page + 1,
        hasMore: res.data.hasMore,
        isLoadingFeed: false,
        isFetchingMore: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch following feed",
        isLoadingFeed: false,
        isFetchingMore: false,
      });
    }
  },

  // FETCH PROFILE POSTS
  // Load user profile posts with filter and pagination
  fetchProfilePosts: async (username, filter = "all") => {
    try {
      const { profilePostsPage, profilePosts } = get();
      set({
        isLoadingProfilePosts: profilePostsPage === 1,
        isFetchingMoreProfilePosts: profilePostsPage > 1,
        error: null,
      });
      const res = await axios.get(
        `${API}/post-api/profile-posts/${username}?filter=${filter}&page=${profilePostsPage}&limit=10`,
        opts
      );
      const newPosts = res.data.payload || [];
      set({
        profilePosts: profilePostsPage === 1 ? newPosts : [...profilePosts, ...newPosts],
        profilePostsFilter: filter,
        profilePostsPage: profilePostsPage + 1,
        profilePostsHasMore: res.data.hasMore,
        isLoadingProfilePosts: false,
        isFetchingMoreProfilePosts: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch profile posts",
        isLoadingProfilePosts: false,
        isFetchingMoreProfilePosts: false,
      });
    }
  },

  // CREATE POST
  // Create new post with optional image and scheduled date
  createPost: async ({ description, image, scheduledDate }) => {
    try {
      set({isPosting: true, error: null,});
      const formData = new FormData();
      formData.append("description", description);
      if (scheduledDate) {
        formData.append("scheduledDate", scheduledDate);
      }
      if (image) {
        formData.append("mediaUrl", image);
      }
      const res = await axios.post(`${API}/post-api/createpost`, formData, {
        ...opts,
        headers: {"Content-Type": "multipart/form-data",},
      });
      set((state) => ({
        posts: [res.data.payload, ...state.posts],
        profilePosts: [res.data.payload, ...state.profilePosts],
        isPosting: false,
      }));
      return { success: true };
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to create post",
        isPosting: false,
      });
      return {
        success: false,
        message: err.response?.data?.message || "Failed to create post",
      };
    }
  },

  // TOGGLE LIKE
  // Like or unlike a post and update all post arrays
  toggleLike: async (postId) => {
    try {
      const { posts, profilePosts, likedPosts, replies } = get();
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const updatePostArray = (arr) =>
        arr.map((post) => {
          if (post._id !== postId) return post;
          const alreadyLiked = post.likes?.some(
            (like) => (like.userId?._id || like.userId) === currentUser?.id
          );
          return {
            ...post,
            likeCount: alreadyLiked ? post.likeCount - 1 : post.likeCount + 1,
            likes: alreadyLiked
              ? post.likes.filter((l) => (l.userId?._id || l.userId) !== currentUser.id)
              : [...post.likes, { userId: currentUser.id }],
          };
        });
      const targetPost = [
        ...posts,
        ...profilePosts,
        ...likedPosts,
        ...replies.map((r) => r.post).filter(Boolean),
      ].find((p) => p._id === postId);
      if (!targetPost) return;
      const alreadyLiked = targetPost.likes?.some(
        (like) => (like.userId?._id || like.userId) === currentUser?.id
      );
      const updatedLikedPosts = updatePostArray(likedPosts);
      set({
        posts: updatePostArray(posts),
        profilePosts: updatePostArray(profilePosts),
        likedPosts: alreadyLiked
          ? updatedLikedPosts.filter((post) => post._id !== postId)
          : updatedLikedPosts,
        replies: replies.map((reply) =>
          reply.post?._id === postId
            ? { ...reply, post: updatePostArray([reply.post])[0] }
            : reply
        ),
      });
      const endpoint = alreadyLiked ? "unlikepost" : "likepost";
      await axios.patch(`${API}/post-api/${endpoint}/${postId}`, {}, opts);
    } catch (err) {
      console.log(err);
    }
  },

  // ADD COMMENT
  // Add comment to a post
  addComment: async (postId, comment) => {
    try {
      const res = await axios.post(
        `${API}/post-api/comment/${postId}`,
        { comment },
        opts
      );
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId ? res.data.payload : post
        ),
        profilePosts: state.profilePosts.map((post) =>
          post._id === postId ? res.data.payload : post
        ),
      }));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to add comment",
      };
    }
  },

  // DELETE COMMENT
  // Remove comment from a post
  deleteComment: async (postId, commentId) => {
    try {
      const res = await axios.delete(
        `${API}/post-api/delcomment/${postId}/${commentId}`,
        opts
      );
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId ? res.data.payload : post
        ),
        profilePosts: state.profilePosts.map((post) =>
          post._id === postId ? res.data.payload : post
        ),
        replies: state.replies.filter((reply) => reply._id !== commentId),
      }));
    } catch (err) {
      console.log(err);
    }
  },

  // EDIT POST
  // Update post description
  editPost: async (postId, description) => {
    try {
      await axios.patch(
        `${API}/post-api/editpost/${postId}`,
        { description },
        opts
      );
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                description,
                isEdited: true,
                editedAt: new Date(),
              } : post ),
        profilePosts: state.profilePosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                description,
                isEdited: true,
                editedAt: new Date(),
              } : post ),
      }));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to edit post",
      };
    }
  },

  // DELETE POST
  // Soft delete a post
  deletePost: async (postId) => {
    try {
      await axios.delete(`${API}/post-api/delpost/${postId}`, opts);
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? { ...post, isDeleted: true, deletedAt: new Date() }
            : post
        ),
        profilePosts: state.profilePosts.map((post) =>
          post._id === postId
            ? { ...post, isDeleted: true, deletedAt: new Date() }
            : post
        ),
      }));
      const currentFilter = get().profilePostsFilter;
      if (currentFilter === "active") {
        set((state) => ({
          profilePosts: state.profilePosts.filter((post) => post._id !== postId),
        }));
      }
    } catch (err) {
      console.log(err);
    }
  },

  // RECOVER POST
  // Restore a deleted post
  recoverPost: async (postId) => {
    try {
      await axios.patch(`${API}/post-api/recover/${postId}`, {}, opts);
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? { ...post, isDeleted: false, deletedAt: null }
            : post
        ),
        profilePosts: state.profilePosts.map((post) =>
          post._id === postId
            ? { ...post, isDeleted: false, deletedAt: null }
            : post
        ),
      }));
      const currentFilter = get().profilePostsFilter;
      if (currentFilter === "deleted") {
        set((state) => ({
          profilePosts: state.profilePosts.filter((post) => post._id !== postId),
        }));
      }
    } catch (err) {
      console.log(err);
    }
  },

  // ACTIVE COMMENT BOX
  // Set which post's comment box is active
  setActiveCommentPostId: (postId) =>
    set({activeCommentPostId: postId,}),

  // FETCH REPLIES
  // Load all replies for a user's posts
  fetchReplies: async (username) => {
    try {
      set({
        isLoadingReplies: true,
        error: null,
      });
      const res = await axios.get(
        `${API}/post-api/replies/${username}`,
        opts
      );
      set({
        replies: res.data.payload || [],
        isLoadingReplies: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch replies",
        isLoadingReplies: false,
      });
    }
  },

  // FETCH LIKED POSTS
  // Load all posts liked by a user
  fetchLikedPosts: async (username) => {
    try {
      set({
        isLoadingLikedPosts: true,
        error: null,
      });
      const res = await axios.get(
        `${API}/post-api/liked-posts/${username}`,
        opts
      );
      set({
        likedPosts: res.data.payload || [],
        isLoadingLikedPosts: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch liked posts",
        isLoadingLikedPosts: false,
      });
    }
  },

  // CLEAR PROFILE POSTS
  // Reset all profile-related post data
  clearProfilePosts: () =>
    set({
      profilePosts: [],
      profilePostsFilter: "all",
      profilePostsPage: 1,
      profilePostsHasMore: true,
      replies: [],
      likedPosts: [],
      isLoadingReplies: false,
    }),

  // RESET FEED
  // Reset feed to initial state
  resetFeed: () => {
    set({
      posts: [],
      page: 1,
      hasMore: true,
    });
  },
}));