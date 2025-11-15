"use client";

export default function WhatsappButton() {
  return (
    <a
      href="https://wa.me/923001234567?text=Hi%20I%20need%20help"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50"
    >
      <img
        src="/whatsapp.webp"
        alt="WhatsApp Chat"
        className="w-14 h-14 drop-shadow-lg"
      />
    </a>
  );
}
