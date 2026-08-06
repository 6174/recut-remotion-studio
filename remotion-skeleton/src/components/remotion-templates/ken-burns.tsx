"use client";
import React from "react";

interface KenBurnsProps {
  imageUrl?: string;
  duration?: number;
  scale?: number;
  translateX?: number;
  translateY?: number;
}

export const KenBurns: React.FC<KenBurnsProps> = ({
  imageUrl = "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba",
  duration = 20,
  scale = 1.5,
  translateX = -50,
  translateY = -30,
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
      <img
        src={imageUrl}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          animation: `kenBurns ${duration}s ease-out forwards`,
        }}
      />
      <style jsx>{`
        @keyframes kenBurns {
          0% {
            transform: scale(1) translate(0, 0);
          }
          100% {
            transform: scale(${scale})
              translate(${translateX}px, ${translateY}px);
          }
        }
      `}</style>
    </div>
  );
};

export default KenBurns;
