export default function ContactPage() {
  return (
    <section className="container mx-auto py-12 px-6 max-w-3xl">
      <h1 className="text-4xl font-semibold text-gray-900 mb-6">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        Got questions or feedback? We’d love to hear from you.  
        Reach out to us using the form below or through our email.
      </p>

      <form className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium">Name</label>
          <input
            type="text"
            className="w-full mt-2 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:[#d6c4b6]"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            className="w-full mt-2 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:[#d6c4b6]"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Message</label>
          <textarea
            rows="4"
            className="w-full mt-2 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:[#d6c4b6]"
            placeholder="Write your message..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#d6c4b6] text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-[#e2d3c7] transition"
        >
          Send Message
        </button>
      </form>

      <div className="mt-12 text-gray-600">
        <p><strong>Email:</strong> flexters007@gmail.com</p>
        <p><strong>Phone:</strong> +1 234 567 890</p>
        <p><strong>Address:</strong> 123 Flex Street, NY, USA</p>
      </div>
    </section>
  );
}
