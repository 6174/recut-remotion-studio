"use client";
import React from "react";
import Image from "next/image";
interface ZoomPulseProps {
  imageUrl?: string;
  duration?: number;
  minScale?: number;
  maxScale?: number;
}

export const ZoomPulse: React.FC<ZoomPulseProps> = ({
  imageUrl = "https://images.pexels.com/photos/1726310/pexels-photo-1726310.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  duration = 4,
  minScale = 1,
  maxScale = 1.1,
}) => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        overflow: "hidden",
      }}
    >
      <Image
        src={imageUrl}
        width={800}
        height={450}
        unoptimized={true}
        alt="Zoom Pulse"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          animation: `zoomPulse ${duration}s ease-in-out infinite`,
        }}
      />
      <style jsx>{`
        @keyframes zoomPulse {
          0%,
          100% {
            transform: scale(${minScale});
          }
          50% {
            transform: scale(${maxScale});
          }
        }
      `}</style>
    </div>
  );
};

export default ZoomPulse;
