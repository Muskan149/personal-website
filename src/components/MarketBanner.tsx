"use client";

import Image from "next/image";
import { useState } from "react";

const WELCOME = "Welcome to my farmer’s market! Hover on a stall to learn more";

// Each stall is a separate PNG, all 724px tall. `flex` is set to the stall's
// original pixel width, so every stall scales by the same factor and the row
// keeps the proportions of the original combined image.
const stalls = [
  {
    src: "/assets/farmers-market-stalls/stall-1.png",
    alt: "A cafe stall with pastries, coffee and a chalkboard menu",
    caption: "If I could have the same breakfast every day (without health or financial implications) it’d be iced almond latte and chocolate croissant, toasted",
    width: 468,
  },
  {
    src: "/assets/farmers-market-stalls/stall-6-market.png",
    alt: "A fitness stall with dumbbells, an exercise ball, resistance bands and a weekly workout chalkboard",
    caption: (
      <>
        <strong>Fun fact:</strong> I used to be a competitive powerlifter in
        high school! I don’t train competitively anymore, but I lift
        consistently at my campus gym. I’m also a retired SoulCycler (haters
        will say it’s not real cardio, but my Peloton playlist and I
        disagree)
      </>
    ),
    width: 528,
  },
  {
    src: "/assets/farmers-market-stalls/stall-3.png",
    alt: "A sweets stall with marigold garlands and bangles",
    caption: "Delhi: my home and land of chaai, chaat and chudiyaaan 🛺",
    width: 431,
  },
  {
    src: "/assets/farmers-market-stalls/stall-4.png",
    alt: "A tech desk with a laptop and storage boxes",
    caption: "I got the hardware bug last semester after working on the software side for my whole life (i.e. 5 years). I'm currently learning PCB design and how to organize circuits in a compact form so people can wear them",
    width: 393,
  },
  {
    src: "/assets/farmers-market-stalls/stall-5.png",
    alt: "A travel shop with postcards, a globe and a suitcase",
    caption: "Travel (!) fills my life with color. The way to my heart is a walkable city. Let's run back: New York City, London, and Barcelona.",
    width: 485,
  },
];

export default function MarketBanner() {
  // Index of the stall under the cursor, or null when none is hovered.
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Every caption (plus the welcome line) is rendered in one grid cell and only
  // the active one is opaque. Every caption crossfades over 100ms.
  const captions = [
    { key: "welcome", text: WELCOME, active: activeIndex === null },
    ...stalls.map((stall, index) => ({
      key: stall.src,
      text: stall.caption,
      active: activeIndex === index,
    })),
  ];

  return (
    <section aria-label="Farmers market" className="mt-6 md:mt-9">
      <div className="flex w-full items-end">
        {stalls.map((stall, index) => (
          <div
            key={stall.src}
            style={{ flex: stall.width }}
            className="mr-4 min-w-0 hover:animate-shake motion-reduce:animate-none"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <Image
              src={stall.src}
              alt={stall.alt}
              width={stall.width}
              height={724}
              sizes="(max-width: 1024px) 20vw, 205px"
              className="h-auto w-full"
            />
          </div>
        ))}
      </div>
      <div
        aria-live="polite"
        className="mt-0 grid text-center text-sm text-brown/60"
      >
        {captions.map((caption) => (
          <p
            key={caption.key}
            aria-hidden={!caption.active}
            className={`col-start-1 row-start-1 transition-opacity duration-100 motion-reduce:transition-none ${
              caption.active ? "opacity-100" : "opacity-0"
            }`}
          >
            {caption.text}
          </p>
        ))}
      </div>
    </section>
  );
}
