export type HighlightId =
  | "georgia-tech"
  | "gnn"
  | "innovius"
  | "safety-wearables"
  | "women-in-cs";

export type Segment = {
  text: string;
  highlight?: HighlightId;
  underline?: boolean;
};

// Shown on the camera screen when nothing is hovered or clicked.
export const cameraBaseImage = {
  src: "/assets/hover/first.jpeg",
  alt: "Photo shown on the camera screen",
};

export const highlights: Record<
  HighlightId,
  { image: string; alt: string; color: string; transform?: string }
> = {
  "georgia-tech": {
    image: "/assets/hover/georgia%20tech.jpg",
    alt: "Georgia Tech",
    color: "#EDE5C8",
  },
  gnn: {
    image: "/assets/hover/linkedin_2.png",
    alt: "GNN foundation models at LinkedIn",
    color: "#D8E4F0",
    transform: "scale(1.04)",
  },
  innovius: {
    image: "/assets/hover/innovius.jpg",
    alt: "Innovius Capital",
    color: "#DCEBD9",
  },
  "safety-wearables": {
    image: "/assets/hover/wearable.png",
    alt: "Voice-powered safety wearables",
    color: "#F3D9D3",
    // Zoom in from the bottom edge so the top is cropped and the wearable sits higher.
    transform: "scale(1.5)",
  },
  "women-in-cs": {
    image: "/assets/hover/w@cc.jpeg",
    alt: "Women in CS at Georgia Tech",
    color: "#F4DCE7",
  },
};

export const bio: Segment[][] = [
  [
    { text: "Hi, my name is " },
    { text: "Muskan" },
    { text: ". I’m a senior studying computer science at " },
    { text: "Georgia Tech.", highlight: "georgia-tech" },
    { text: " I’ve previously built " },
    { text: "GNN-based foundation models", highlight: "gnn" },
    { text: " at LinkedIn and bespoke software for VC at " },
    { text: "Innovius Capital.", highlight: "innovius" },
  ],
  [
    { text: "Currently, I’m working on " },
    { text: "voice-powered safety wearables", highlight: "safety-wearables" },
    {
      text: " with my friends and Prof Thomas Ploetz. Born and brought up in Delhi, India – I value community. Currently, I’m building one for Georgia Tech’s ",
    },
    { text: "women in CS", highlight: "women-in-cs" },
    { text: " (450 members strong)." },
  ],
  [{ text: "Welcome to my little corner on the internet!" }],
];
