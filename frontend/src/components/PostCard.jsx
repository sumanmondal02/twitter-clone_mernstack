import { useEffect, useMemo, useRef, useState } from "react";
import {
  RiChat1Line,
  RiChat1Fill,
  RiHeartFill,
  RiHeartLine,
  RiMoreFill,
} from "react-icons/ri";

import * as s from "../styles/common";
import { useNavigate } from "react-router-dom";
import ImageLightbox from "./ImageLightbox";

import { useAuth } from "../stores/authStore";
import { usePost } from "../stores/postStore";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function PostCard({ post }) {

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const {
    toggleLike,
    deletePost,
    recoverPost,
    addComment,
    deleteComment,
    activeCommentPostId,
    setActiveCommentPostId,
    editPost,
  } = usePost();

  const [showMenu, setShowMenu] = useState(false);

  const [showLightbox, setShowLightbox] =
    useState(false);

  const [commentText, setCommentText] =
    useState("");

  const [isSubmittingComment, setIsSubmittingComment] =
    useState(false);

  const [isEditing, setIsEditing] =
    useState(false);

  const [editText, setEditText] =
    useState(post.description || "");

  const [isSavingEdit, setIsSavingEdit] =
    useState(false);

  const menuRef = useRef(null);

  const commentsRef = useRef(null);

  const showComments =
    activeCommentPostId === post._id;

  const isLiked = useMemo(() => {

  if (!currentUser) return false;

  return post.likes?.some((like) => {

    const likedUserId =
      like.userId?._id ||
      like.userId;

    return (
      likedUserId?.toString() ===
      currentUser.id?.toString()
    );

  });

}, [post.likes, currentUser]);

  // =========================
  // DELETE POST
  // =========================
  const handleDeletePost =
    async (e) => {

      e.stopPropagation();

      if (
        !window.confirm(
          "Delete this post?"
        )
      ) return;

      await deletePost(post._id);
      setShowMenu(false);

    };

  // =========================
  // ADD COMMENT
  // =========================
  const handleAddComment =
    async (e) => {

      e.stopPropagation();

      if (!commentText.trim()) return;

      try {

        setIsSubmittingComment(true);

        const res =
          await addComment(
            post._id,
            commentText
          );

        if (res.success) {
          setCommentText("");
        }

      } finally {

        setIsSubmittingComment(false);

      }

    };

  // =========================
  // SAVE EDIT
  // =========================
  const handleSaveEdit =
    async (e) => {

      e.stopPropagation();

      if (!editText.trim()) return;

      try {

        setIsSavingEdit(true);

        const res =
          await editPost(
            post._id,
            editText
          );

        if (res.success) {
          setIsEditing(false);
        }

      } finally {

        setIsSavingEdit(false);

      }

    };

  // =========================
  // CLOSE MENU OUTSIDE
  // =========================
  useEffect(() => {

    function handleClickOutside(e) {

      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {

        setShowMenu(false);

      }

    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);

  // =========================
  // CLOSE COMMENTS OUTSIDE
  // =========================
  useEffect(() => {

    function handleClickOutside(e) {

      if (
        e.target.closest(
          ".comment-trigger"
        )
      ) {
        return;
      }

      if (
        commentsRef.current &&
        !commentsRef.current.contains(e.target)
      ) {

        setActiveCommentPostId(null);

      }

    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);

  return (

    <article className={`${s.tweetCard}${post.isDeleted ? " opacity-95" : ""}`}>

      {/* AVATAR */}
      <img
        onClick={() =>
          navigate(`/profile/${post.userId?.username}`)
        }
        src={
          post.userId?.profileImageUrl ||
          "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png"
        }
        alt="profile"
        className={`${s.avatarMd} cursor-pointer`}
      />

      {/* MAIN */}
      <div className="flex-1 min-w-0">

        {/* HEADER */}
<div className="flex items-start justify-between gap-3">

  <div className="min-w-0">

    {/* NAME + TIME */}
<div className="flex flex-wrap items-center gap-x-2 gap-y-0 min-w-0">
  <span
    onClick={() => navigate(`/profile/${post.userId?.username}`)}
    className={`${s.tweetName} cursor-pointer hover:underline`}
  >
    {post.userId?.firstName} {post.userId?.lastName}
  </span>

  {/* inline on md+, hidden on small */}
  <span className="hidden sm:flex items-center gap-2 text-[#71767b] text-[12.5px] whitespace-nowrap">
    <span>
      {new Date(post.createdAt).toLocaleString("en-US", {
        month: "short", day: "numeric",
        hour: "numeric", minute: "2-digit", hour12: true,
      })}
    </span>
    {post.isEdited && post.editedAt && (
      <span className="text-[#71767b]">Edited {dayjs(post.editedAt).fromNow()}</span>
    )}
  </span>
</div>

{/* USERNAME */}
<div onClick={() => navigate(`/profile/${post.userId?.username}`)}
  className="text-[#71767b] text-[15px] truncate cursor-pointer hover:underline">
  @{post.userId?.username}
</div>

{/* time below username on small screens only */}
<div className="sm:hidden flex items-center gap-2 text-[#71767b] text-[12.5px]">
  <span>
    {new Date(post.createdAt).toLocaleString("en-US", {
      month: "short", day: "numeric",
      hour: "numeric", minute: "2-digit", hour12: true,
    })}
  </span>
  {post.isEdited && post.editedAt && (
    <span>Edited {dayjs(post.editedAt).fromNow()}</span>
  )}
</div>
  </div>

          {/* MENU */}
          {
            (
              post.userId?._id === currentUser?.id ||
              post.userId === currentUser?.id
            ) && (

              <div
                ref={menuRef}
                className="relative"
              >

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu((prev) => !prev);
                  }}
                  className={`${s.iconBtn} ${s.iconBtnHover}`}
                >
                  <RiMoreFill />
                </button>

                {
                  showMenu && (

                    <div className="absolute right-0 mt-2 w-[150px] overflow-hidden rounded-2xl border border-[#2f3336] bg-black shadow-xl z-50">

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditing(true);
                          setShowMenu(false);
                        }}
                        className="w-full px-5 py-2 text-left text-white transition hover:bg-[#16181c]"
                      >
                        Edit Post
                      </button>

                      {post.isDeleted ? (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            await recoverPost(post._id);
                            setShowMenu(false);
                          }}
                          className="
                            w-full
                            px-5
                            py-2
                            text-left
                            text-[#1d9bf0]
                            transition
                            hover:bg-[#0a1a24]
                          "
                        >
                          Unarchive
                        </button>
                      ) : (
                        <button
                          onClick={handleDeletePost}
                          className="
                            w-full
                            px-5
                            py-2
                            text-left
                            text-red-500
                            transition
                            hover:bg-[#16181c]
                          "
                        >
                          Archive
                        </button>
                      )}
                    </div>
                  )
                }
              </div>
            )
          }
        </div>

        {/* BODY */}
        {
          isEditing ? (
            <div
              className="mt-2"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <textarea
                value={editText}
                onChange={(e) =>
                  setEditText(e.target.value)
                }
                className="
                  w-full
                  bg-transparent
                  border
                  border-[#2f3336]
                  focus:border-[#1d9bf0]
                  rounded-2xl
                  px-4
                  py-3
                  text-white
                  outline-none
                  resize-none
                  min-h-[120px]
                  transition
                "
              />
              <div className="flex justify-end gap-3 mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditText(
                      post.description || ""
                    );
                    setIsEditing(false);
                  }}
                  className="
                    px-4
                    h-[36px]
                    rounded-full
                    border
                    border-[#2f3336]
                    hover:bg-[#16181c]
                    transition
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveEdit}
                  disabled={
                    isSavingEdit ||
                    !editText.trim()
                  }
                  className="
                    bg-[#1d9bf0]
                    hover:bg-[#1a8cd8]
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    px-5
                    h-[36px]
                    rounded-full
                    font-bold
                    transition
                  "
                >
                  Save
                </button>

              </div>

            </div>

          ) : (

            post.description && (
              <div className={s.tweetBody}>
                {post.description}
              </div>
            )

          )
        }

        {/* IMAGE */}
        {
          post.mediaUrl && (
            <>
              <img
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLightbox(true);
                }}
                src={post.mediaUrl}
                alt="post"
                className={`${s.tweetMedia} cursor-pointer`}
              />

              {
                showLightbox && (
                  <ImageLightbox
                    image={post.mediaUrl}
                    closeModal={() =>
                      setShowLightbox(false)
                    }
                  />
                )
              }
            </>
          )
        }

        {/* ACTIONS */}
        <div className="flex items-center gap-10 sm:gap-16 mt-3">

          {/* COMMENT */} 
          <button
            onClick={(e) => {

              e.stopPropagation();
              if (post.isDeleted) return;

              if (showComments) {

                setActiveCommentPostId(null);

              } else {

                setActiveCommentPostId(post._id);

              }

            }}
            className={`comment-trigger ${s.tweetActionGroup} ${showComments ? s.commentActive : s.commentHover}`}
          >

            <div className={s.tweetActionIconWrap}>
              {
                showComments
                  ? <RiChat1Fill />
                  : <RiChat1Line />
              }
            </div>

            <span className={s.tweetActionCount}>
              {post.commentCount || 0}
            </span>

          </button>

          {/* LIKE */}
          <button
            onClick={(e) => {

              e.stopPropagation();

              if (!post.isDeleted) {
                 toggleLike(post._id);
    }

            }}
            className={`${s.tweetActionGroup} ${s.likeHover} ${isLiked ? s.likeActive : ""}`}
          >

            <div className={s.tweetActionIconWrap}>
              {
                isLiked
                  ? <RiHeartFill />
                  : <RiHeartLine />
              }
            </div>

            <span className={s.tweetActionCount}>
              {post.likeCount || 0}
            </span>

          </button>

        </div>

        {/* COMMENTS */}
        {
          showComments && (

            <div
              ref={commentsRef}
              className="
                mt-4
                border-t
                border-[#2f3336]
                pt-4
              "
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* COMMENT INPUT */}
              <div
                className="
                  flex
                  gap-3
                  mb-4
                "
              >

                <img
                  src={
                    currentUser?.profileImageUrl || "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png"
                  }
                  onError={(e) => {
                    e.target.src = "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png";
                  }}
                  alt="profile"
                  className="
                    w-9 h-9
                    rounded-full
                    object-cover
                  "
                />

                <div className="flex-1">

                  <div
                    className="
                      border
                      border-[#2f3336]
                      rounded-2xl
                      overflow-hidden
                      focus-within:border-[#1d9bf0]
                      transition
                    "
                  >

                    <textarea
                      value={commentText}
                      onChange={(e) =>
                        setCommentText(
                          e.target.value
                        )
                      }
                      placeholder="Post your reply"
                      className="
                        w-full
                        bg-transparent
                        px-4
                        py-3
                        text-white
                        outline-none
                        resize-none
                        min-h-[52px]
                        max-h-[140px]
                        overflow-y-auto
                      "
                    />

                    <div
                      className="
                        flex
                        justify-end
                        px-3
                        pb-3
                      "
                    >

                      <button
                        disabled={
                          isSubmittingComment ||
                          !commentText.trim()
                        }
                        onClick={handleAddComment}
                        className="
                          bg-[#1d9bf0]
                          hover:bg-[#1a8cd8]
                          disabled:opacity-50
                          disabled:cursor-not-allowed
                          text-white
                          font-bold
                          px-4
                          h-[34px]
                          rounded-full
                          transition
                        "
                      >
                        Reply
                      </button>

                    </div>

                  </div>

                </div>

              </div>

              {/* COMMENTS LIST */}
              <div
                className="
                  flex
                  flex-col
                  gap-4
                  max-h-[350px]
                  overflow-y-auto
                  pr-1
                "
              >

                {
                  post.comments?.length === 0 && (

                    <div
                      className="
                        text-[#71767b]
                        text-[14px]
                        text-center
                        py-4
                      "
                    >
                      No replies yet
                    </div>

                  )
                }

                {
                  [...(post.comments || [])]
                    .reverse()
                    .map((comment) => (

                      <div
                        key={comment._id}
                        className="
                          flex
                          gap-3
                        "
                      >

                        <img onClick={() => navigate(`/profile/${comment.userId?.username}`)}
                          src={
                            comment.userId?.profileImageUrl || "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png"
                          }
                          alt="profile"
                          className="
                            w-9 h-9
                            rounded-full
                            object-cover
                            shrink-0
                            cursor-pointer
                          "
                        />

                        <div className="flex-1 min-w-0">

                          {/* HEADER */}
                          <div className="flex flex-col leading-tight">

                            <div className="flex items-center gap-2 min-w-0">

                              <span 
                              onClick={() => navigate(`/profile/${comment.userId?.username}`)}
                              className="text-white font-bold text-[14px] cursor-pointer hover:underline">

                                {
                                  comment.userId
                                    ?.firstName
                                }{" "}

                                {
                                  comment.userId
                                    ?.lastName
                                }

                              </span>

                              <span className="text-[#71767b] text-[13px]">

                                {
                                  dayjs(
                                    comment.createdAt
                                  ).fromNow()
                                }

                              </span>

                            </div>

                            <span className="text-[#71767b] text-[14px] cursor-pointer hover:underline"
                            onClick={() => navigate(`/profile/${comment.userId?.username}`)}>

                              @
                              {
                                comment.userId
                                  ?.username
                              }

                            </span>

                          </div>

                          {/* COMMENT TEXT */}
                          <div
                            className="
                              text-white
                              text-[15px]
                              mt-1
                              break-words
                            "
                          >

                            {
                              comment.comment
                            }

                          </div>

                          {/* DELETE COMMENT */}
                          {
                            (
                              comment.userId?._id === currentUser?.id ||

                              comment.userId === currentUser?.id
                            ) && (

                              <button
                                onClick={(e) => {

                                  e.stopPropagation();

                                  deleteComment(
                                    post._id,
                                    comment._id
                                  );

                                }}
                                className="
                                  text-[#71767b]
                                  hover:text-red-500
                                  text-[13px]
                                  mt-2
                                  transition
                                "
                              >
                                Archive
                              </button>

                            )
                          }

                        </div>

                      </div>

                    ))
                }

              </div>

            </div>

          )
        }

      </div>

    </article>

  );

}

export default PostCard;