import { RiCloseLine } from "react-icons/ri";

function ImagePreview({ preview, removeImage }) {
  if (!preview) return null;
  return (
    <div className="relative mt-4 rounded-2xl overflow-hidden border border-[#2f3336]">
      <img
        src={preview}
        alt="preview"
        className="w-full max-h-[400px] object-contain md:rounded-2xl"
      />
      <button
        onClick={removeImage}
        className="
          absolute top-2 right-2
          w-8 h-8
          rounded-full
          bg-black/70
          hover:bg-black
          transition
          flex items-center justify-center
        "
      >
        <RiCloseLine className="text-white text-[20px]" />
      </button>
    </div>
  );
}

export default ImagePreview;