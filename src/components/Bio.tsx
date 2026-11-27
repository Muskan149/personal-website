import { bio, highlights, type HighlightId } from "@/content/about";

type BioProps = {
  activeId: HighlightId | null;
  pinnedId: HighlightId | null;
  onHover: (id: HighlightId | null) => void;
  onTogglePin: (id: HighlightId) => void;
};

export default function Bio({
  activeId,
  pinnedId,
  onHover,
  onTogglePin,
}: BioProps) {
  return (
    <div className="space-y-6 text-base leading-7 text-brown-deep">
      {bio.map((segments, i) => (
        <p key={i}>
          {segments.map((segment) => {
            if (!segment.highlight) {
              return segment.underline ? (
                <span
                  key={segment.text}
                  className="underline decoration-brown/50 underline-offset-4"
                >
                  {segment.text}
                </span>
              ) : (
                <span key={segment.text}>{segment.text}</span>
              );
            }

            const id = segment.highlight;
            const isActive = activeId === id;
            const isPinned = pinnedId === id;

            return (
              <span
                key={segment.text}
                tabIndex={0}
                role="button"
                aria-pressed={isPinned}
                onMouseEnter={() => onHover(id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(id)}
                onBlur={() => onHover(null)}
                onClick={() => onTogglePin(id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onTogglePin(id);
                  }
                }}
                style={{ backgroundColor: highlights[id].color }}
                className={`box-decoration-clone cursor-pointer rounded px-1 transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-brown/40 ${
                  isActive ? "ring-2 ring-brown/30" : ""
                }`}
              >
                {segment.text}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}
