import { create } from "zustand";
import axios from "axios";

const API = import.meta.env.VITE_URL;

const opts = {
  withCredentials: true,
};

export const usePost = create((set, get) => ({
  posts: [],
  feedType: "explore",

  isLoadingFeed: false,
  isFetchingMore: false,
  isPosting: false,
  isLiking: false,

  error: null,

  page: 1,
  hasMore: true,

  activeCommentPostId: null,

  // =========================
  // FEED TYPE
  // =========================
  setFeedType: (type) => {
    set({
      feedType: type,
      posts: [],
      page: 1,
      hasMore: true,
    });
  },

  // =========================
  // FETCH EXPLORE FEED
  // =========================
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
        posts:
          page === 1
            ? newPosts
            : [...posts, ...newPosts],

        page: page + 1,

        hasMore: res.data.hasMore,

        isLoadingFeed: false,
        isFetchingMore: false,
      });
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          "Failed to fetch explore feed",

        isLoadingFeed: false,
        isFetchingMore: false,
      });
    }
  },

  // =========================
  // FETCH FOLLOWING FEED
  // =========================
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
        posts:
          page === 1
            ? newPosts
            : [...posts, ...newPosts],

        page: page + 1,

        hasMore: res.data.hasMore,

        isLoadingFeed: false,
        isFetchingMore: false,
      });
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          "Failed to fetch following feed",

        isLoadingFeed: false,
        isFetchingMore: false,
      });
    }
  },

  // =========================
  // CREATE POST
  // =========================
  createPost: async ({
    description,
    image,
    scheduledDate,
  }) => {
    try {
      set({
        isPosting: true,
        error: null,
      });

      const formData = new FormData();

      formData.append(
        "description",
        description
      );

      if (scheduledDate) {
        formData.append(
            "scheduledDate",
            scheduledDate
        );

    }

      if (image) {
        formData.append(
          "mediaUrl",
          image
        );
      }

      const res = await axios.post(
        `${API}/post-api/createpost`,
        formData,
        {
          ...opts,
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      set((state) => ({
        posts: [
          res.data.payload,
          ...state.posts,
        ],

        isPosting: false,
      }));

      return {
        success: true,
      };
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          "Failed to create post",

        isPosting: false,
      });

      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Failed to create post",
      };
    }
  },

  // =========================
  // TOGGLE LIKE
  // =========================
  toggleLike: async (postId) => {
    try {
      const posts = get().posts;
      const targetPost =
        posts.find(
          (p) => p._id === postId
        );
      if (!targetPost) return;
      const currentUser = JSON.parse(
        localStorage.getItem(
          "currentUser"
        )
      );
      const alreadyLiked =
        targetPost.likes?.some(
          (like) =>
            like.userId ===
            currentUser?.id
        );
      const updatedPosts =
        posts.map((post) => {
          if (post._id !== postId)
            return post;
          return {
            ...post,
            likeCount:
              alreadyLiked
                ? post.likeCount - 1
                : post.likeCount + 1,

            likes: alreadyLiked
              ? post.likes.filter(
                  (l) =>
                    l.userId !==
                    currentUser.id
                )
              : [
                  ...post.likes,
                  {
                    userId:
                      currentUser.id,
                  },
                ],
          };
        });
      set({
        posts: updatedPosts,
      });
      const endpoint =
        alreadyLiked
          ? "unlikepost"
          : "likepost";
      await axios.patch(
        `${API}/post-api/${endpoint}/${postId}`,
        {},
        opts
      );
    } catch (err) {
      console.log(err);
    }
  },

  // =========================
  // ADD COMMENT
  // =========================
  addComment: async (
    postId,
    comment
  ) => {
    try {
      const res = await axios.post(
        `${API}/post-api/comment/${postId}`,
        { comment },
        opts
      );

      set((state) => ({
        posts: state.posts.map(
          (post) =>
            post._id === postId
              ? res.data.payload
              : post
        ),
      }));

      return {
        success: true,
      };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Failed to add comment",
      };
    }
  },

  // =========================
  // DELETE COMMENT
  // =========================
  deleteComment: async (
    postId,
    commentId
  ) => {
    try {
      const res = await axios.delete(
        `${API}/post-api/delcomment/${postId}/${commentId}`,
        opts
      );

      set((state) => ({
        posts: state.posts.map(
          (post) =>
            post._id === postId
              ? res.data.payload
              : post
        ),
      }));
    } catch (err) {
      console.log(err);
    }
  },

  // =========================
  // EDIT POST
  // =========================
  editPost: async (
    postId,
    description
  ) => {
    try {
      await axios.patch(
        `${API}/post-api/editpost/${postId}`,
        { description },
        opts
      );

      set((state) => ({
        posts: state.posts.map(
          (post) =>
            post._id === postId
              ? {
                  ...post,
                  description,
                  isEdited: true,
                  editedAt: new Date(),
                }
              : post
        ),
      }));

      return {
        success: true,
      };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Failed to edit post",
      };
    }
  },

  // =========================
  // DELETE POST
  // =========================
  deletePost: async (
    postId
  ) => {
    try {
      await axios.delete(
        `${API}/post-api/delpost/${postId}`,
        opts
      );

      set((state) => ({
        posts:
          state.posts.filter(
            (post) =>
              post._id !== postId
          ),
      }));
    } catch (err) {
      console.log(err);
    }
  },

  // =========================
  // ACTIVE COMMENT BOX
  // =========================
  setActiveCommentPostId: (
    postId
  ) =>
    set({
      activeCommentPostId:
        postId,
    }),

  // =========================
  // RESET FEED
  // =========================
  resetFeed: () => {
    set({
      posts: [],
      page: 1,
      hasMore: true,
    });
  },
}));