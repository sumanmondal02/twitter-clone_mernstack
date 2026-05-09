import * as s from "../styles/common";

import {
  RiImage2Line,
  RiEmotionHappyLine,
  RiCalendarEventLine,
} from "react-icons/ri";

import { useAuth } from "../stores/authStore";

function PostComposer() {
  const { currentUser } = useAuth();

  return (
    <div className={s.composerWrapper}>
      <img
        src={currentUser?.profileImageUrl || "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail_unscaled&_=20240121032759"}
        alt="profile"
        className={s.composerAvatar}
      />

      <div className={s.composerRight}>
        <textarea
          placeholder="What's happening?"
          className={s.composerTextarea}
        />

        <div className={s.composerToolbar}>
          <div className="flex items-center gap-1">
            <button className={s.composerIconBtn}>
              <RiImage2Line />
            </button>

            <button className={s.composerIconBtn}>
              <RiEmotionHappyLine />
            </button>

            <button className={s.composerIconBtn}>
              <RiCalendarEventLine />
            </button>
          </div>

          <button className={s.composerPostBtn}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostComposer;