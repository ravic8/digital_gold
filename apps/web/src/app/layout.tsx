import "./styles.css";
import { ReactNode } from "react";
import Link from "next/link";

export const metadata = {
  title: "Digital Gold",
  description: "AI-powered digital jewellery catalogue"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <h1>Digital Gold</h1>
          <p>Jewellery discovery and assisted consultation</p>
          <nav className="nav">
            <Link href="/">Catalogue</Link>
            <Link href="/enquiry">Enquiry</Link>
            <Link href="/book-appointment">Book Appointment</Link>
            <Link href="/admin/leads">Admin Leads</Link>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
