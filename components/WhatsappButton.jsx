"use client";

import { useEffect, useState, useRef } from "react";

/**
 * Lightweight WhatsApp Widget
 * - Inline SVG (no external asset)
 * - Deferred animation (starts after first paint)
 * - Opens wa.me link when user clicks Send
 *
 * Props:
 *  - phone (string): E.164 or local like "923001234567"
 *  - defaultMessage (string)
 */

export default function WhatsappWidget({
  phone = "923701114204",
  defaultMessage = "Hi! I need help with my order.",
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // defer heavy bits
  const [showWelcome, setShowWelcome] = useState(false);
  const [message, setMessage] = useState(defaultMessage);
  const inputRef = useRef(null);

  // Defer non-critical effects to avoid blocking paint
  useEffect(() => {
    // Wait for first paint + small delay
    const t = setTimeout(() => {
      setMounted(true);
      // show welcome bubble after short delay
      setTimeout(() => setShowWelcome(true), 900);
    }, 600); // safe delay; tweak smaller or larger
    return () => clearTimeout(t);
  }, []);

  // focus input when opening
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const openWhatsApp = (text) => {
    // use wa.me link (works mobile & web)
    const encoded = encodeURIComponent(text || message);
    const url = `https://wa.me/${phone}?text=${encoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Widget container - fixed bottom-right */}
      <div className="fixed right-5 bottom-5 z-50 flex items-end">
        {/* Welcome bubble (small, auto-hide after 6s) */}
        {mounted && showWelcome && (
          <div
            role="status"
            aria-live="polite"
            className="mr-3 max-w-xs"
            style={{ animation: "fadeSlide .28s ease-out" }}
          >
            <div className="rounded-2xl bg-white/95 dark:bg-neutral-900/95 border border-gray-200 dark:border-neutral-800 shadow-md p-3 text-sm text-neutral-900 dark:text-neutral-100">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0">
                  {/* tiny bubble avatar */}
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <rect width="24" height="24" rx="6" fill="#25D366" />
                    <path d="M8.5 10.5c.7 1 2 2 3.5 2.3 1 .2 2 .2 2.8 0" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Need help?</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-300">
                    Chat with us on WhatsApp — we'll reply quickly.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main widget */}
        <div className="relative">
          {/* Chat bubble / panel */}
          {open && (
            <div
              className="mb-3 w-80 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-lg overflow-hidden"
              style={{ transformOrigin: "bottom right" }}
            >
              <div className="px-3 py-2 border-b dark:border-neutral-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <rect width="24" height="24" rx="6" fill="#25D366" />
                    <path d="M8.5 10.5c.7 1 2 2 3.5 2.3 1 .2 2 .2 2.8 0" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <div className="text-sm font-medium">Chat with us</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Typically replies within a few hours</div>
                  </div>
                </div>

                <button
                  aria-label="Close chat"
                  onClick={() => setOpen(false)}
                  className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* messages area (static example + typing animation) */}
              <div className="p-3 space-y-3">
                <div className="text-xs text-neutral-600 dark:text-neutral-300">
                  <strong>Support:</strong> Hi! 👋 How can we help with your order today?
                </div>

                {/* typing bubble - small animation */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M3 12h18" stroke="#c7c7c7" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs">
                    <span className="typing-dots" aria-hidden />
                    <span className="sr-only">Support is typing</span>
                  </div>
                </div>
              </div>

              {/* input area */}
              <div className="px-3 py-2 border-t dark:border-neutral-800 flex gap-2 items-center">
                <input
                  ref={inputRef}
                  className="flex-1 rounded-lg border border-gray-200 dark:border-neutral-800 px-3 py-2 text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  placeholder="Write a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") openWhatsApp(message);
                  }}
                  aria-label="Message to send via WhatsApp"
                />
                <button
                  onClick={() => openWhatsApp(message)}
                  aria-label="Send message on WhatsApp"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#25D366] text-white text-sm font-medium hover:opacity-95 focus:outline-none"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {/* Floating main button */}
          <button
            aria-label="Open WhatsApp chat"
            onClick={() => {
              // open panel on first click, second click opens wa link quickly
              if (!open) {
                setOpen(true);
                // optionally delay immediate open-now behaviour
                return;
              }
              openWhatsApp(message);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (!open) setOpen(true);
                else openWhatsApp(message);
              }
            }}
            className="group inline-flex items-center justify-center w-14 h-14 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366] transition-transform active:scale-95"
            title="Chat on WhatsApp"
          >
            {/* Inline WhatsApp SVG (no asset) */}
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M20.5 3.5h-17A1.5 1.5 0 002 5v14a1.5 1.5 0 001.5 1.5h3.2L10 22l2.3-1.5h8.2A1.5 1.5 0 0022 19V5a1.5 1.5 0 00-1.5-1.5z" fill="#25D366"/>
              <path d="M16.5 14.5c-.3-.15-1.75-.85-2-.95-.25-.1-.45-.15-.65.15-.2.3-.8.95-.98 1.15-.18.2-.35.2-.65.05-.3-.15-1.25-.47-2.38-1.46-.88-.83-1.47-1.86-1.64-2.16-.18-.3-.02-.46.13-.61.12-.12.27-.31.4-.46.13-.15.17-.25.27-.42.1-.18.05-.33-.03-.47-.08-.14-.65-1.57-.89-2.15-.23-.56-.46-.5-.65-.51-.16-.01-.35-.01-.53-.01-.18 0-.47.07-.72.35-.25.28-.95.93-.95 2.24 0 1.3.98 2.55 1.12 2.73.14.18 1.94 2.96 4.7 4.03 3.02 1.2 3.02.8 3.56.75.54-.05 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.08-.13-.28-.2-.58-.35z" fill="#fff"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Small styles scoped here (avoid external CSS) */}
      <style jsx>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* typing animation */
        .typing-dots {
          display: inline-block;
          width: 32px;
          height: 6px;
          position: relative;
        }
        .typing-dots::before,
        .typing-dots::after,
        .typing-dots > span {
          content: '';
          position: absolute;
          top: 0;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #9ca3af;
          animation: typing 1s infinite;
        }
        .typing-dots::before { left: 0; animation-delay: 0s; }
        .typing-dots > span { left: 10px; animation-delay: .15s; }
        .typing-dots::after { left: 20px; animation-delay: .3s; }
        @keyframes typing {
          0% { transform: translateY(0); opacity: 0.35; }
          50% { transform: translateY(-4px); opacity: 1; }
          100% { transform: translateY(0); opacity: 0.35; }
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .typing-dots::before,
          .typing-dots::after,
          .typing-dots > span { animation: none; }
        }
      `}</style>
    </>
  );
}
