import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section>
      <h2>Design not found</h2>
      <p>The requested catalogue item is unavailable.</p>
      <Link href="/" className="button">
        Back to catalogue
      </Link>
    </section>
  );
}
