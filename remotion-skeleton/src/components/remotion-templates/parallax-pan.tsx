"use client";
import React from "react";
import Image from "next/image";
interface ParallaxPanProps {
  imageUrl?: string;
  duration?: number;
  direction?: "left-right" | "right-left" | "top-bottom" | "bottom-top";
  scale?: number;
}

export const ParallaxPan: React.FC<ParallaxPanProps> = ({
  imageUrl = "https://images.pexels.com/photos/1644724/pexels-photo-1644724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  duration = 15,
  direction = "left-right",
  scale = 1.2,
}) => {
  const getKeyframes = () => {
    switch (direction) {
      case "left-right":
        return `
          0% { transform: translateX(0) scale(${scale}); }
          100% { transform: translateX(-20%) scale(${scale}); }
        `;
      case "right-left":
        return `
          0% { transform: translateX(-20%) scale(${scale}); }
          100% { transform: translateX(0) scale(${scale}); }
        `;
      case "top-bottom":
        return `
          0% { transform: translateY(0) scale(${scale}); }
          100% { transform: translateY(-20%) scale(${scale}); }
        `;
      case "bottom-top":
        return `
          0% { transform: translateY(-20%) scale(${scale}); }
          100% { transform: translateY(0) scale(${scale}); }
        `;
    }
  };

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
        alt="Parallax Pan"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          animation: `parallaxPan ${duration}s ease-out infinite alternate`,
        }}
      />
      <style jsx>{`
        @keyframes parallaxPan {
          ${getKeyframes()}
        }
      `}</style>
    </div>
  );
};

export default ParallaxPan;
