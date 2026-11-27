import Image from "next/image";
import {
  cameraBaseImage,
  highlights,
  type HighlightId,
} from "@/content/about";
import ModeDial from "@/components/ModeDial";

type CameraProps = {
  activeId: HighlightId | null;
};

export default function Camera({ activeId }: CameraProps) {
  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="relative">
        <Image
          src="/assets/digital-camera-body.png"
          alt=""
          width={612}
          height={408}
          preload
          sizes="(max-width: 768px) 90vw, 480px"
          className="h-auto w-full select-none"
          draggable={false}
        />
        {/* The mode dial is painted out of the PNG above and drawn live here. */}
        <ModeDial />
        <div className="absolute left-[24%] top-[26%] h-[55%] w-[50%] overflow-hidden rounded-sm bg-black">
          {/* Base image: hides instantly on hover, crossfades back in over 300ms. */}
          <Image
            src={cameraBaseImage.src}
            alt={cameraBaseImage.alt}
            fill
            sizes="(max-width: 768px) 45vw, 240px"
            className={`object-cover ${
              activeId === null
                ? "opacity-100 transition-opacity duration-500 motion-reduce:transition-none"
                : "opacity-0"
            }`}
          />
          {/* Highlight images: the active one swipes in from the left; when it
              deactivates it fades out over 300ms as the base image returns. */}
          {Object.entries(highlights).map(([id, highlight]) => (
            <div
              key={id}
              className={`absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none ${
                activeId === id ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={highlight.image}
                alt={highlight.alt}
                fill
                sizes="(max-width: 768px) 45vw, 240px"
                style={{ transform: highlight.transform, transformOrigin: "50% 100%" }}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
