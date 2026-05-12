import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  RiCalendarLine,
  RiEmotionLine,
  RiImageAddLine,
} from "react-icons/ri";

import * as s from "../styles/common";

import { useAuth } from "../stores/authStore";
import { usePost } from "../stores/postStore";

import ImagePreview from "./ImagePreview";
import EmojiPickerMenu from "./EmojiPickerMenu";
import SchedulePopover from "./SchedulePopover";

function PostComposer({
  modal = false,
  closeModal,
}) {
  const { currentUser } = useAuth();

  const {
    createPost,
    isPosting,
  } = usePost();

  const [text, setText] =
    useState("");

  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState(null);

  const [showEmoji, setShowEmoji] =
    useState(false);

  const [
    showSchedule,
    setShowSchedule,
  ] = useState(false);

  const [
    scheduledDate,
    setScheduledDate,
  ] = useState(null);

  const [error, setError] =
    useState("");

  const textareaRef = useRef(null);

  const fileInputRef = useRef(null);

  const handleTextarea = (e) => {
    setText(e.target.value);

    const textarea =
      textareaRef.current;

    textarea.style.height = "auto";

    const newHeight =
      textarea.scrollHeight;

    if (newHeight >= 320) {
      textarea.style.height =
        "320px";

      textarea.style.overflowY =
        "auto";
    } else {
      textarea.style.height = `${newHeight}px`;

      textarea.style.overflowY =
        "hidden";
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    const objectUrl =
      URL.createObjectURL(file);

    setPreview(objectUrl);
  };

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(null);

    setPreview(null);
  };

  const handleSubmit = async () => {
    setError("");

    if (!text.trim() && !image) {
      setError(
        "Please add text or image"
      );

      return;
    }

    const res = await createPost({
      description: text,
      image,
      scheduledDate,
    });

    if (!res.success) {
      setError(
        res.message ||
        "Failed to create post"
      );

      return;
    }

    setText("");

    removeImage();

    setScheduledDate(null);
    setShowSchedule(false);

    if (textareaRef.current) {
      textareaRef.current.style.height =
        "auto";
    }

    if (closeModal) {
      closeModal();
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className={modal ? "border-none" : s.composerWrapper}>
      <img
        src={
          currentUser?.profileImageUrl || "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png"
        }
        onError={(e) => {
          e.target.src = "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png";
        }}
        alt="profile"
        className={`${s.composerAvatar} ${modal ? "" : "md:ml-[-17px]"}`}
      />

      <div className={`${s.composerRight} ${modal ? "pt-2" : ""}`}>
        <textarea
          autoFocus={modal}
          ref={textareaRef}
          value={text}
          onChange={handleTextarea}
          rows={1}
          placeholder="What's happening?"
          className={`
            ${s.composerTextarea}
            overflow-hidden
            max-h-[270px]
          `}
        />

        {error && (
          <p className="text-red-500 text-[13px] mt-2">
            {error}
          </p>
        )}

        <ImagePreview
          preview={preview}
          removeImage={removeImage}
        />

        {scheduledDate && (
          <div
            className="
            mt-3
            w-fit
            flex items-center gap-2
            bg-[#1d9bf0]/10
            text-[#1d9bf0]
            px-3 py-2
            rounded-full
            text-[13px]
            font-semibold
          "
          >
            <span>
              Scheduled for{" "}
              {new Date(
                scheduledDate
              ).toLocaleString()}
            </span>

            <button
              onClick={() =>
                setScheduledDate(null)
              }
              className="
                w-5 h-5
                rounded-full
                hover:bg-[#1d9bf0]/20
                flex items-center justify-center
                transition
              "
            >
              ×
            </button>
          </div>
        )}

        <div className={s.composerToolbar}>
          <div className="relative
                flex 
                items-center 
                gap-1"
            >
            <input
              type="file"
              hidden
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImage}
            />

            <button
              className={
                s.composerIconBtn
              }
              onClick={() =>
                fileInputRef.current.click()
              }
            >
              <RiImageAddLine />
            </button>

            <button
              className={
                s.composerIconBtn
              }
              onClick={() => {
                setShowSchedule(false);

                setShowEmoji(
                  (prev) => !prev
                );
              }}
            >
              <RiEmotionLine />
            </button>

            <button
              className={
                s.composerIconBtn
              }
              onClick={() => {
                setShowEmoji(false);

                setShowSchedule(
                  (prev) => !prev
                );
              }}
            >
              <RiCalendarLine />
            </button>

            {showEmoji && (
              <EmojiPickerMenu
                closeEmoji={() =>
                  setShowEmoji(false)
                }
                onEmojiClick={(
                  emoji
                ) => {
                  setText(
                    (prev) =>
                      prev + emoji
                  );
                }}
              />
            )}

            {showSchedule && (
              <SchedulePopover
                scheduledDate={
                  scheduledDate
                }
                setScheduledDate={
                  setScheduledDate
                }
                closeSchedule={() =>
                  setShowSchedule(
                    false
                  )
                }
              />
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={
              isPosting ||
              (!text.trim() && !image)
            }
            className={`
              ${s.composerPostBtn}
              disabled:opacity-50
              disabled:cursor-not-allowed
            `}
          >
            {isPosting
              ? "Uploading..." : scheduledDate
              ? "Schedule" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostComposer;