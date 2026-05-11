import { RiCloseLine } from "react-icons/ri";
import PostComposer from "./PostComposer";

function ComposerModal({ closeModal }) {
  return (
    // Overlay — fixed, full screen, very dark, no blur
    <div
      className="
        fixed inset-0
        z-[9999]
        bg-black/40
        flex
        backdrop-blur-sm
        items-start
        justify-center
        pt-0
        sm:pt-[5vh]
      "
      onClick={closeModal}
    >
      {/* Modal box — fully opaque, floats on desktop, full screen on mobile */}
      <div
        className="
          relative
          bg-[#101010cf]
          sm:border sm:border-[#2f3336]
          sm:rounded-2xl
          sm:shadow-[0_0_60px_rgba(0,0,0,0.95)]
          w-full
          sm:max-w-[700px]
          h-full
          sm:h-auto
          sm:min-h-[270px]
          overflow-y-auto
          overflow-x-hidden
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP BAR */}
        <div className="
          h-[53px]
          bg-[#0606062f]
          flex
          items-center
          justify-between
          px-4
          sticky top-0
          bg-[#000000]
          z-10
        ">
          <button
            onClick={closeModal}
            className="
              w-9 h-9
              rounded-full
              hover:bg-[#181818]
              transition
              flex items-center justify-center
            "
          >
            <RiCloseLine className="text-[22px] text-white" />
          </button>
        </div>

        {/* COMPOSER */}
        <div className="px-4 pb-6">
          <PostComposer
            modal={true}
            closeModal={closeModal}
          />
        </div>
      </div>
    </div>
  );
}

export default ComposerModal;