export const metadata = {
  title: "About Us - Flexters",
};

export default function AboutPage() {
  return (
    <section className="container mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">About Us</h2>
      <p className="text-lg leading-relaxed mb-4">
        At <strong>Flexters</strong>, we believe T-shirts are more than clothing —
        they’re a way to express identity, style, and creativity.
      </p>
      <p className="text-lg leading-relaxed">
        We started small with a dream to provide stylish, comfortable, and
        affordable T-shirts. Each design is made with love, so you can wear your
        confidence every day.
      </p>
    </section>
  );
}
