/** Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Happy coding and building amazing videos! 🎉
 * Restyled to the Vercel + Recut green design language (kitTheme).
 */

"use client";

import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kitFont, kitRadius, kitShadow, kitTheme } from "./helpers/theme";

export default function NotificationPop() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const notifications = [
    { title: "Render Complete", body: "Your cut exported successfully.", color: kitTheme.green[500], delay: 0 },
    { title: "New Comment", body: "Great pacing in the intro.", color: kitTheme.gray[400], delay: 20 },
    { title: "New Follower", body: "Someone subscribed to you.", color: kitTheme.green[300], delay: 40 },
  ];

  const cardWidth = Math.round(width * 0.32);
  const cardPadding = Math.round(width * 0.016);

  return (
    <AbsoluteFill style={{ background: kitTheme.paperSoft, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: Math.round(height * 0.08), left: Math.round(width * 0.06) }}>
        <span style={{ fontFamily: kitFont.mono, fontSize: Math.round(width * 0.011), letterSpacing: "0.5em", color: kitTheme.green[600], fontWeight: 600 }}>
          INBOX
        </span>
        <h2 style={{ margin: 0, marginTop: Math.round(height * 0.012), fontFamily: kitFont.sans, fontSize: Math.round(width * 0.05), fontWeight: 900, letterSpacing: "-0.03em", color: kitTheme.ink }}>
          Notifications
        </h2>
      </div>

      <div style={{ position: "absolute", right: Math.round(width * 0.06), top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: Math.round(height * 0.024), alignItems: "flex-end" }}>
        {notifications.map((notif, i) => {
          const delayedFrame = Math.max(0, frame - notif.delay);
          const slideIn = spring({
            frame: delayedFrame,
            fps,
            config: { damping: 14, stiffness: 180, mass: 0.6 },
          });

          const translateX = interpolate(slideIn, [0, 1], [cardWidth, 0]);
          const opacity = interpolate(slideIn, [0, 1], [0, 1]);

          return (
            <div
              key={i}
              style={{
                transform: `translateX(${translateX}px)`,
                opacity,
                width: cardWidth,
                padding: cardPadding,
                borderRadius: kitRadius.md,
                background: kitTheme.paper,
                border: `1px solid ${kitTheme.line}`,
                boxShadow: kitShadow.md,
                display: "flex",
                alignItems: "center",
                gap: Math.round(width * 0.014),
                position: "relative",
              }}
            >
              <div
                style={{
                  width: Math.round(width * 0.035),
                  height: Math.round(width * 0.035),
                  borderRadius: kitRadius.full,
                  background: notif.color,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: kitTheme.ink, fontSize: Math.round(width * 0.016), fontWeight: 700, fontFamily: kitFont.sans, letterSpacing: "-0.01em", marginBottom: 4 }}>
                  {notif.title}
                </div>
                <div style={{ color: kitTheme.faint, fontSize: Math.round(width * 0.013), fontFamily: kitFont.sans }}>
                  {notif.body}
                </div>
              </div>
              {i === 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: -Math.round(width * 0.008),
                    right: -Math.round(width * 0.008),
                    width: Math.round(width * 0.02),
                    height: Math.round(width * 0.02),
                    borderRadius: kitRadius.full,
                    background: kitTheme.green[500],
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#ffffff",
                    fontSize: Math.round(width * 0.011),
                    fontWeight: 700,
                    fontFamily: kitFont.mono,
                  }}
                >
                  3
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
