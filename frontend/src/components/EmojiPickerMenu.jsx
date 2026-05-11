import { useEffect, useRef } from "react";

import EmojiPicker from "emoji-picker-react";

function EmojiPickerMenu({
  onEmojiClick,
  closeEmoji,
}) {
  const pickerRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target)
      ) {
        closeEmoji();
      }
    };

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
    <div
      ref={pickerRef}
      className="
        absolute
        left-0
        top-full
        mt-1
        z-[999]
        max-md:fixed
        max-md:left-1/2
        max-md:-translate-x-1/2
        max-md:bottom-20
        max-md:top-auto
        max-sm:fixed
        max-sm:left-50
        max-sm:-translate-x-1/2
        max-sm:bottom-93
        max-sm:top-auto
      "
    >
      <EmojiPicker
        theme="dark"
        width={300}
        height={360}
        previewConfig={{
          showPreview: false,
        }}
        skinTonesDisabled
        onEmojiClick={(emojiData) => {
          onEmojiClick(emojiData.emoji);
          closeEmoji();
        }}
      />
    </div>
  );
}

export default EmojiPickerMenu;