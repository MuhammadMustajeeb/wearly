"use client";

import React from "react";

const SectionHeading = ({
  title,
  subtitle,
  actionText,
  onAction,
  align = "left", // left | center
  theme = "light", // light | dark
}) => {
  const alignClass = align === "center" ? "text-center items-center" : "items-start";
  const themeClass =
    theme === "dark"
      ? "text-white border-white"
      : "text-black border-black";

  return (
    <div className={`flex flex-col ${alignClass} gap-3 mb-12`}>
      {/* Subtitle */}
      {subtitle && (
        <p className="text-xs uppercase tracking-[0.35em] opacity-60">
          {subtitle}
        </p>
      )}

      {/* Title + Action */}
      <div className="flex w-full items-end justify-between gap-6">
        <h2
  className={`
    text-4xl md:text-5xl lg:text-6xl
    font-semibold
    leading-[1.05]
    tracking-[-0.02em]
    ${themeClass}
  `}
>
  {title}
</h2>


        {actionText && onAction && (
          <button
            onClick={onAction}
            className={`text-xs uppercase tracking-widest border-b pb-1 transition hover:opacity-70 ${themeClass}`}
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default SectionHeading;
