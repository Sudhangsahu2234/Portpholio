import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

export default function NotFound() {
  return (
    <main className="not-found" id="main-content" tabIndex={-1}>
      <Link className="signature" href="/"><BrandMark /><span>Sudhang Sahu</span></Link>
      <p className="role-line">404</p>
      <h1>Page not found<span className="name-dot">.</span></h1>
      <p>This address doesn’t match a portfolio page.</p>
      <Link href="/#work">Browse projects</Link>
    </main>
  );
}
