import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";

function ImageCropModal({ image, setCroppedAreaPixels, }) {
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });
  const [zoom, setZoom] = useState(1);
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(
      croppedAreaPixels
    );
  }, [setCroppedAreaPixels]);

  return (
    <div className="space-y-5">
      <div className="relative w-full h-55 bg-black rounded-2xl overflow-hidden">

        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          restrictPosition={true}
          objectFit="contain"
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-[#71767b] mb-2">
            Zoom
          </p>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default ImageCropModal;