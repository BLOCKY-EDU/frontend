import React, { useState } from "react";

export default function BoxModelOverlay({ children }) {
    const [overlay, setOverlay] = useState(null);

    const handleMouseEnter = (e) => {
        const el = e.currentTarget; // children의 실제 DOM
        const style = window.getComputedStyle(el);

        const rect = el.getBoundingClientRect();

        const margins = {
            top: parseInt(style.marginTop) || 0,
            right: parseInt(style.marginRight) || 0,
            bottom: parseInt(style.marginBottom) || 0,
            left: parseInt(style.marginLeft) || 0,
        };

        const paddings = {
            top: parseInt(style.paddingTop) || 0,
            right: parseInt(style.paddingRight) || 0,
            bottom: parseInt(style.paddingBottom) || 0,
            left: parseInt(style.paddingLeft) || 0,
        };

        setOverlay({ rect, margins, paddings });
    };

    const handleMouseLeave = () => {
        setOverlay(null);
    };

    return (
        <>
            <div
                style={{ display: "inline-block", position: "relative" }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </div>

            {overlay && (
                <>
                    {/* margin 표시 */}
                    <div
                        style={{
                            position: "fixed",
                            top: overlay.rect.top - overlay.margins.top,
                            left: overlay.rect.left - overlay.margins.left,
                            width: overlay.rect.width + overlay.margins.left + overlay.margins.right,
                            height: overlay.rect.height + overlay.margins.top + overlay.margins.bottom,
                            background: "rgba(255, 200, 0, 0.2)",
                            pointerEvents: "none",
                            zIndex: 9999,
                        }}
                    >
                        <span style={{
                            position: "absolute",
                            top: -20,
                            left: 0,
                            fontSize: 12,
                            background: "#ffc",
                            padding: "2px 4px",
                            border: "1px solid #aaa"
                        }}>
                            margin {overlay.margins.top}/{overlay.margins.right}/{overlay.margins.bottom}/{overlay.margins.left}
                        </span>
                    </div>

                    {/* padding 표시 */}
                    <div
                        style={{
                            position: "fixed",
                            top: overlay.rect.top,
                            left: overlay.rect.left,
                            width: overlay.rect.width,
                            height: overlay.rect.height,
                            boxSizing: "content-box",
                            border: `${overlay.paddings.top}px solid rgba(0, 200, 255, 0.2)`,
                            borderRightWidth: overlay.paddings.right,
                            borderBottomWidth: overlay.paddings.bottom,
                            borderLeftWidth: overlay.paddings.left,
                            pointerEvents: "none",
                            zIndex: 10000,
                        }}
                    >
                        {Object.values(overlay.paddings).some(v => v > 0) && (
                            <span style={{
                                position: "absolute",
                                bottom: -20,
                                left: 0,
                                fontSize: 12,
                                background: "#ccf",
                                padding: "2px 4px",
                                border: "1px solid #aaa"
                            }}>
                                padding {overlay.paddings.top}/{overlay.paddings.right}/{overlay.paddings.bottom}/{overlay.paddings.left}
                            </span>
                        )}
                    </div>
                </>
            )}
        </>
    );
}
