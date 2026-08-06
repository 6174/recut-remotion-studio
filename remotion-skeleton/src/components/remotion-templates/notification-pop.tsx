/** Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Happy coding and building amazing videos! 🎉
 */

"use client";

import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export default function NotificationPop() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const notifications = [
    { title: "New Message", body: "Hey! Check out this update.", color: "#3b82f6", delay: 0 },
    { title: "Task Complete", body: "Your render finished successfully.", color: "#a855f7", delay: 20 },
    { title: "New Follower", body: "Someone started following you.", color: "#4361ee", delay: 40 },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(180deg, #111827, #1f2937)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-end",
        padding: "40px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <h2
        style={{
          position: "absolute",
          top: "40px",
          left: "40px",
          color: "white",
          fontSize: "1.8rem",
          fontWeight: "bold",
          fontFamily: "Inter, sans-serif",
          margin: 0,
        }}
      >
        Notifications
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          alignItems: "flex-end",
        }}
      >
        {notifications.map((notif, i) => {
          const delayedFrame = Math.max(0, frame - notif.delay);
          const slideIn = spring({
            frame: delayedFrame,
            fps,
            config: { damping: 14, stiffness: 180, mass: 0.6 },
          });

          const translateX = interpolate(slideIn, [0, 1], [300, 0]);
          const opacity = interpolate(slideIn, [0, 1], [0, 1]);

          return (
            <div
              key={i}
              style={{
                transform: `translateX(${translateX}px)`,
                opacity,
                width: "320px",
                padding: "16px",
                borderRadius: "12px",
                background: "rgba(31, 41, 55, 0.9)",
                border: `1px solid rgba(255, 255, 255, 0.1)`,
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: notif.color,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: "white",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    fontFamily: "Inter, sans-serif",
                    marginBottom: "4px",
                  }}
                >
                  {notif.title}
                </div>
                <div
                  style={{
                    color: "#9ca3af",
                    fontSize: "0.8rem",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {notif.body}
                </div>
              </div>
              {i === 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "#ef4444",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  3
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
