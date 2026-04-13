"use client";

import { useEffect, useState, useRef } from "react";

/**
 * Premium WhatsApp Widget
 * - Enhanced with luxury fashion aesthetic
 * - Smooth animations and transitions
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
  const [mounted, setMounted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [message, setMessage] = useState(defaultMessage);
  const inputRef = useRef(null);

  // Defer non-critical effects to avoid blocking paint
  useEffect(() => {
    const t = setTimeout(() => {
      setMounted(true);
      setTimeout(() => setShowWelcome(true), 1200);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  // focus input when opening
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const openWhatsApp = (text) => {
    const encoded = encodeURIComponent(text || message);
    const url = `https://wa.me/${phone}?text=${encoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Widget container - fixed bottom-right */}
      <div className="fixed right-6 bottom-6 z-50 flex items-end">
        {/* Welcome bubble */}
        {mounted && showWelcome && (
          <div
            role="status"
            aria-live="polite"
            className="mr-4 max-w-xs"
            style={{ animation: "fadeSlide .4s ease-out" }}
          >
            <div className="rounded-2xl bg-white border border-gray-200 shadow-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M8.5 10.5c.7 1 2 2 3.5 2.3 1 .2 2 .2 2.8 0" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="font-bold text-black text-sm uppercase tracking-wide">Need Help?</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Chat with our style experts — instant replies
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
              className="mb-4 w-96 rounded-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden"
              style={{ 
                transformOrigin: "bottom right",
                animation: "slideUp 0.3s ease-out"
              }}
            >
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M8.5 10.5c.7 1 2 2 3.5 2.3 1 .2 2 .2 2.8 0" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-black text-sm uppercase tracking-wide">Style Support</div>
                    <div className="text-xs text-gray-500">We reply instantly • Available 24/7</div>
                  </div>
                </div>

                <button
                  aria-label="Close chat"
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Messages area */}
              <div className="p-4 space-y-3 bg-white">
                <div className="text-sm text-gray-700">
                  <span className="font-bold text-black">Style Expert:</span> Hi! 👋 Welcome to our premium support. How can I help you find the perfect pieces today?
                </div>

                {/* typing indicator */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <div className="w-4 h-4 bg-gray-400 rounded-full animate-pulse" />
                  </div>
                  <div className="px-4 py-2 bg-gray-100 rounded-lg">
                    <span className="typing-dots" aria-hidden />
                    <span className="sr-only">Support is typing</span>
                  </div>
                </div>
              </div>

              {/* Input area */}
              <div className="px-4 py-3 border-t border-gray-100 flex gap-3 items-center bg-gray-50">
                <input
                  ref={inputRef}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm bg-white text-black focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                  placeholder="Type your message..."
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
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Floating main button */}
          <button
            aria-label="Open WhatsApp chat"
            onClick={() => {
              if (!open) {
                setOpen(true);
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
            className="group inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/20"
            title="Chat on WhatsApp"
          >
            {/* Enhanced WhatsApp SVG */}
            <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M20.5 3.5h-17A1.5 1.5 0 002 5v14a1.5 1.5 0 001.5 1.5h3.2L10 22l2.3-1.5h8.2A1.5 1.5 0 0022 19V5a1.5 1.5 0 00-1.5-1.5z" fill="currentColor"/>
              <path d="M16.5 14.5c-.3-.15-1.75-.85-2-.95-.25-.1-.45-.15-.65.15-.2.3-.8.95-.98 1.15-.18.2-.35.2-.65.05-.3-.15-1.25-.47-2.38-1.46-.88-.83-1.47-1.86-1.64-2.16-.18-.3-.02-.46.13-.61.12-.12.27-.31.4-.46.13-.15.17-.25.27-.42.1-.18.05-.33-.03-.47-.08-.14-.65-1.57-.89-2.15-.23-.56-.46-.5-.65-.51-.16-.01-.35-.01-.53-.01-.18 0-.47.07-.72.35-.25.28-.95.93-.95 2.24 0 1.3.98 2.55 1.12 2.73.14.18 1.94 2.96 4.7 4.03 3.02 1.2 3.02.8 3.56.75.54-.05 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.08-.13-.28-.2-.58-.35z" fill="white"/>
            </svg>
            
            {/* Pulse animation ring */}
            <div className="absolute inset-0 rounded-2xl bg-green-500 opacity-30 animate-ping" />
          </button>
        </div>
      </div>

      {/* Enhanced styles */}
      <style jsx>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .typing-dots {
          display: inline-block;
          width: 40px;
          height: 8px;
          position: relative;
        }
        
        .typing-dots::before,
        .typing-dots::after,
        .typing-dots > span {
          content: '';
          position: absolute;
          top: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          animation: typing 1.4s infinite;
        }
        
        .typing-dots::before { left: 0; animation-delay: 0s; }
        .typing-dots > span { left: 12px; animation-delay: .2s; }
        .typing-dots::after { left: 24px; animation-delay: .4s; }
        
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .typing-dots::before,
          .typing-dots::after,
          .typing-dots > span { animation: none; }
        }
      `}</style>
    </>
  );
}
