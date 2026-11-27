"use client";

import { useState } from "react";
import type { HighlightId } from "@/content/about";
import Bio from "@/components/Bio";
import Camera from "@/components/Camera";

export default function Hero() {
  // Hovering shows a highlight's image temporarily; clicking pins it so it
  // stays on the camera screen after the mouse leaves.
  const [hoveredId, setHoveredId] = useState<HighlightId | null>(null);
  const [pinnedId, setPinnedId] = useState<HighlightId | null>(null);

  const activeId = hoveredId ?? pinnedId;

  const togglePin = (id: HighlightId) =>
    setPinnedId((current) => (current === id ? null : id));

  return (
    <div className="grid items-start gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-16">
      <Bio
        activeId={activeId}
        pinnedId={pinnedId}
        onHover={setHoveredId}
        onTogglePin={togglePin}
      />
      <div>
        <Camera activeId={activeId} />
      </div>
    </div>
  );
}
