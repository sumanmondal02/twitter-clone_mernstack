import {RiCloseLine,} from "react-icons/ri";

function ImageLightbox({image,closeModal,}) {
  return (
    <div
      onClick={closeModal}
      className="
        fixed inset-0
        z-[99999]
        bg-black/95
        flex
        items-center
        justify-center
        p-4
      "
    >
      <button
        onClick={closeModal}
        className="
          absolute
          top-4
          left-4
          w-10 h-10
          rounded-full
          bg-black/50
          hover:bg-black/70
          text-white
          flex
          items-center
          justify-center
          text-[24px]
          transition
        "
      >
        <RiCloseLine />
      </button>
      <img
        src={image}
        alt="preview"
        onClick={(e) =>
          e.stopPropagation()
        }
        className="
          max-w-full
          max-h-full
          object-contain
          rounded-2xl
        "
      />
    </div>
  );
}

export default ImageLightbox;