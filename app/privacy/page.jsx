export const metadata = {
  title: "Privacy Policy - Flexters",
};

export default function PrivacyPage() {
  return (
    <main className="container mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold mb-6">Privacy Policy</h2>
      <p className="mb-4">
        At <strong>Flexters</strong>, we respect your privacy. This page explains how we collect,
        use, and protect your personal information when you shop with us.
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>We collect name, email, and address for order processing.</li>
        <li>Payments are handled securely via trusted providers.</li>
        <li>We never share your data with third parties without consent.</li>
      </ul>
    </main>
  );
}
