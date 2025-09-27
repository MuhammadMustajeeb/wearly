export const metadata = {
  title: "Contact Us - Flexters",
};

export default function ContactPage() {
  return (
    <main className="container mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
      <form className="max-w-lg space-y-4">
        <input type="text" placeholder="Your Name" className="w-full p-3 border rounded-md" />
        <input type="email" placeholder="Your Email" className="w-full p-3 border rounded-md" />
        <textarea placeholder="Your Message" rows="5" className="w-full p-3 border rounded-md" />
        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
          Send Message
        </button>
      </form>
    </main>
  );
}
