import Link from "next/link";

export const metadata = {
  title: "Experiences — Muskan Mahajan",
};

export default function ExperiencesPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-16 sm:px-10 md:py-24">
      <div className="mb-4 flex items-center justify-between gap-6">
        <h1 className="font-samarkan text-4xl tracking-tight text-brown">experiences</h1>
        <Link
          href="/"
          className="text-base text-brown underline decoration-brown underline-offset-4"
        >
          back
        </Link>
      </div>
      <p className="text-base text-brown">coming soon.</p>
    </main>
  );
}
