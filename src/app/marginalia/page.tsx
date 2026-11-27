import Image from "next/image";
import Link from "next/link";

import bazaar from "@/assets/marginalia/bazaar.jpeg";
import diwali from "@/assets/marginalia/diwali.jpeg";
import nyc from "@/assets/marginalia/nyc.jpg";
import nyc2 from "@/assets/marginalia/nyc2.png";
import montserrat from "@/assets/marginalia/montserrat.jpeg";
import religion from "@/assets/marginalia/religion.png";
import turkey from "@/assets/marginalia/turkey.jpeg";

export const metadata = {
  title: "Marginalia — Muskan Mahajan",
};

export default function MarginaliaPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-16 sm:px-10 md:py-24">
      <div className="mb-4 flex items-center justify-between gap-6">
        <h1 className="font-samarkan text-4xl tracking-tight text-brown">marginalia</h1>
        <Link
          href="/"
          className="text-base text-brown underline decoration-brown underline-offset-4"
        >
          back
        </Link>
      </div>
      <div className="flex flex-col-reverse gap-8 md:flex-row md:items-start md:justify-between">
        <div className="grid min-w-0 max-w-164 flex-1 auto-rows-fr grid-cols-2 gap-4">
          <a
            href="https://lnkd.in/p/eampgwqa"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="On Surrendering"
            className="group relative block min-w-0"
          >
            <Image
              src={turkey}
              alt="Sipping tea in a spice and tea shop in Turkey"
              fill
              sizes="(min-width: 768px) 320px, 50vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-brick/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          </a>
          <div className="flex min-w-0 flex-col items-start gap-2">
            <a
              href="https://lnkd.in/p/eampgwqa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-brown underline decoration-brown underline-offset-4"
            >
              [READ] On Surrendering
            </a>
            <div className="group relative w-full flex-1">
              <Image
                src={bazaar}
                alt="Entrance to the Grand Bazaar in Istanbul"
                fill
                sizes="(min-width: 768px) 320px, 50vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-brick/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            </div>
          </div>
          <div className="col-start-1 row-start-2 flex min-w-0 flex-col items-start gap-2 self-start">
            <div className="group relative w-full">
              <Image
                src={religion}
                alt="A note titled religion listing: fitness, job, SAHEY, W@CC, saying yes to life"
                sizes="(min-width: 768px) 320px, 50vw"
                className="block h-auto w-full"
              />
              <div className="pointer-events-none absolute inset-0 bg-brick/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            </div>
            {/* TODO: replace href with the On Karma post URL */}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-brown underline decoration-brown underline-offset-4"
            >
              [READ] On Karma
            </a>
          </div>
          <div className="group relative col-start-2 row-start-2 min-w-0">
            <Image
              src={montserrat}
              alt="Montserrat"
              fill
              sizes="(min-width: 768px) 320px, 50vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-brick/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          </div>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-4 md:w-96">
          <div className="group relative w-full">
            <Image
              src={diwali}
              alt="Diwali"
              sizes="(min-width: 768px) 384px, 100vw"
              className="block h-auto w-full"
            />
            <div className="pointer-events-none absolute inset-0 bg-brick/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          </div>
          {/* TODO: replace href with the potlucks post URL */}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start text-base text-brown underline decoration-brown underline-offset-4"
          >
            [READ] you need to organize at least three potlucks
          </a>
          <div className="grid w-full grid-cols-2 gap-4">
            <div className="group relative aspect-3/4 min-w-0">
              <Image
                src={nyc2}
                alt="New York City"
                fill
                sizes="(min-width: 768px) 184px, 50vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-brick/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            </div>
            <div className="group relative aspect-3/4 min-w-0">
              <Image
                src={nyc}
                alt="New York City"
                fill
                sizes="(min-width: 768px) 184px, 50vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-brick/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            </div>
          </div>
          <a
            href="https://paulgraham.com/cities.html"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start text-base text-brown underline decoration-brown underline-offset-4"
          >
            [BOOKMARK] Every city sends a message
          </a>
          <iframe
            data-testid="embed-iframe"
            title="Spotify playlist"
            src="https://open.spotify.com/embed/playlist/7MeHFgyD3s6purkOXERFiO?utm_source=generator&si=403ec531000a4272"
            width="100%"
            height="352"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="w-full rounded-xl border-0"
          />
        </div>
      </div>
    </main>
  );
}
