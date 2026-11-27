import Link from "next/link";
import Hero from "@/components/Hero";
import MarketBanner from "@/components/MarketBanner";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-15 sm:px-10 md:py-10">
      <div className="flex items-end justify-between gap-6">
        <h1 className="font-samarkan text-5xl tracking-tight text-brown">
          <span className="font-sans">mus</span>kan <span className="font-sans">mah</span>ajan
        </h1>
        <nav aria-label="Main" className="flex gap-5 text-base text-brown">
          <a
            href="/assets/resume/Mahajan_Muskan_Resume_Full_Stack_Website.pdf"
            className="underline decoration-brown underline-offset-4"
          >
            resume
          </a>
          <Link
            href="/experiences"
            className="underline decoration-brown underline-offset-4"
          >
            experiences
          </Link>
          <Link
            href="/marginalia"
            className="underline decoration-brown underline-offset-4"
          >
            marginalia
          </Link>
        </nav>
      </div>
      <div className="mt-14 md:mt-16">
        <Hero />
      </div>
      <MarketBanner />
    </main>
  );
}
