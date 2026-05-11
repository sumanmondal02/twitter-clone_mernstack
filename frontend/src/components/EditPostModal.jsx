import { useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { usePost } from "../stores/postStore";

function EditPostModal({
  post,
  closeModal,
}) {

  const {
    editPost,
  } = usePost();

  const [
    description,
    setDescription,
  ] = useState(
    post.description || ""
  );

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const handleSave =
    async () => {

      if (
        !description.trim()
      ) return;

      try {

        setIsSaving(true);

        const res =
          await editPost(
            post._id,
            description
          );

        if (res.success) {
          closeModal();
        }

      } finally {
        setIsSaving(false);
      }
    };

  return (
    <div
      className="
        fixed inset-0
        z-[9999]
        bg-black/70
        backdrop-blur-sm
        flex
        justify-center
        items-start
        sm:pt-[5vh]
      "
      onClick={closeModal}
    >

      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className="
          w-full
          sm:max-w-[600px]
          bg-black
          border
          border-[#2f3336]
          sm:rounded-2xl
          overflow-hidden
        "
      >

        {/* TOP */}
        <div
          className="
            h-[53px]
            flex
            items-center
            px-4
          "
        >

          <button
            onClick={closeModal}
            className="
              w-9 h-9
              rounded-full
              hover:bg-[#181818]
              flex
              items-center
              justify-center
              transition
            "
          >
            <RiCloseLine className="text-[22px]" />
          </button>

        </div>

        {/* BODY */}
        <div className="p-4">

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            placeholder="What's happening?"
            className="
              w-full
              bg-transparent
              text-[20px]
              outline-none
              resize-none
              min-h-[180px]
            "
          />

          <div className="flex justify-end mt-4">

            <button
              onClick={handleSave}
              disabled={
                isSaving ||
                !description.trim()
              }
              className="
                bg-[#1d9bf0]
                hover:bg-[#1a8cd8]
                disabled:opacity-50
                disabled:cursor-not-allowed
                px-6
                h-[38px]
                rounded-full
                font-bold
                transition
              "
            >
              Save
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default EditPostModal;