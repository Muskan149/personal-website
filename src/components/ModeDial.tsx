"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

/*
 * The top-right mode dial of the digicam, redrawn as a live SVG.
 *
 * The dial is seen edge-on, so it's drawn as a knurled cylinder: each ridge
 * sits at an angle around the drum and is projected to x = cx + R·sin(θ).
 * Spinning the dial just advances that angle, which makes the ridges slide
 * across the face and squash toward the edges like a real drum.
 *
 * All geometry is in the pixel space of /assets/digital-camera.png (612×408)
 * so the overlay lines up exactly with the painted camera body.
 */

const IMG_W = 612;
const IMG_H = 408;
// Overlay box (a little larger than the dial so it's easier to grab).
const VB = { x: 426, y: 42, w: 100, h: 32 };

const CX = 476; // drum centre
const R = 41.5; // drum radius as seen from the front
const LEFT = CX - R;
const RIGHT = CX + R;
const TOP = 51;
const BOTTOM = 68.5;

export const DIAL_STOPS = 25; // matches the ridge count in the painting
const STEP = 360 / DIAL_STOPS;
const RIDGE_PHASE = 3.6; // lines the ridges up with the original artwork at rest

// Physics tuning (degrees, seconds).
const OMEGA = 2 * Math.PI * 7; // how snappy a detent feels
const NOTCH = (OMEGA * OMEGA * STEP) / (2 * Math.PI); // detent "magnet" strength
const COAST_DAMPING = 2.5; // friction while free-spinning after a flick
const SETTLE_DAMPING = 0.9 * OMEGA; // friction once it's caught in a detent
const SPRING_K = OMEGA * OMEGA; // keyboard / click / wheel stepping
const SPRING_C = 1.1 * OMEGA;
const MAX_FLICK = 2400;
const WHEEL_PX_PER_STOP = 40;

const mod = (n: number, m: number) => ((n % m) + m) % m;
const nearestStop = (angle: number) => Math.round(angle / STEP);

type Engine = ReturnType<typeof createEngine>;

function createEngine(opts: {
  onFrame: (angle: number) => void;
  onStop: (stop: number) => void;
  reducedMotion: () => boolean;
}) {
  let angle = 0;
  let vel = 0;
  let target: number | null = null;
  let dragging = false;
  let lastStop = 0;
  let raf: number | null = null;
  let lastT = 0;
  // Recent drag samples, for flick velocity.
  let samples: { t: number; a: number }[] = [];

  const emit = () => {
    const stop = mod(nearestStop(angle), DIAL_STOPS);
    if (stop !== lastStop) {
      lastStop = stop;
      opts.onStop(stop);
    }
  };

  const tick = (now: number) => {
    const dt = Math.min((now - lastT) / 1000, 1 / 30);
    lastT = now;

    if (!dragging) {
      const n = Math.max(1, Math.ceil(dt / 0.004));
      const h = dt / n;
      for (let i = 0; i < n; i++) {
        let acc: number;
        if (target !== null) {
          acc = SPRING_K * (target - angle) - SPRING_C * vel;
        } else {
          // A sinusoidal potential with a well at every stop: the dial
          // ratchets through notches while fast and drops into one when slow.
          const notch = -NOTCH * Math.sin((2 * Math.PI * angle) / STEP);
          const damping = Math.abs(vel) > 120 ? COAST_DAMPING : SETTLE_DAMPING;
          acc = notch - damping * vel;
        }
        vel += acc * h;
        angle += vel * h;
      }

      const goal = target ?? nearestStop(angle) * STEP;
      if (Math.abs(goal - angle) < 0.02 && Math.abs(vel) < 1) {
        angle = goal;
        vel = 0;
        target = null;
        opts.onFrame(angle);
        emit();
        raf = null;
        return;
      }
    }

    opts.onFrame(angle);
    emit();
    raf = requestAnimationFrame(tick);
  };

  const run = () => {
    if (raf !== null) return;
    lastT = performance.now();
    raf = requestAnimationFrame(tick);
  };

  const jumpTo = (goal: number) => {
    if (opts.reducedMotion()) {
      angle = goal;
      vel = 0;
      target = null;
      opts.onFrame(angle);
      emit();
      return;
    }
    target = goal;
    run();
  };

  return {
    step(by: number) {
      const base = target !== null ? target / STEP : nearestStop(angle);
      jumpTo((Math.round(base) + by) * STEP);
    },
    dragStart() {
      dragging = true;
      target = null;
      vel = 0;
      samples = [{ t: performance.now(), a: angle }];
      run();
    },
    dragBy(deltaDeg: number) {
      angle += deltaDeg;
      const t = performance.now();
      samples.push({ t, a: angle });
      while (samples.length > 2 && t - samples[0].t > 80) samples.shift();
    },
    dragEnd(fling: boolean) {
      dragging = false;
      if (!fling) samples = samples.slice(-1);
      const first = samples[0];
      const last = samples[samples.length - 1];
      const span = (last.t - first.t) / 1000;
      const flick = span > 0 ? (last.a - first.a) / span : 0;
      // A pointer that stopped before letting go shouldn't fling the dial.
      const stale = performance.now() - last.t > 60;
      vel = stale ? 0 : Math.max(-MAX_FLICK, Math.min(MAX_FLICK, flick));
      if (opts.reducedMotion()) {
        jumpTo(nearestStop(angle) * STEP);
      } else {
        run();
      }
    },
    destroy() {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
    },
  };
}

type ModeDialProps = {
  /** Called with the new stop index (0…DIAL_STOPS-1) whenever the dial clicks into one. */
  onChange?: (stop: number) => void;
  label?: string;
};

export default function ModeDial({ onChange, label = "Mode dial" }: ModeDialProps) {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, "");

  const [angle, setAngle] = useState(0);
  const [stop, setStop] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [grabbing, setGrabbing] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const engine = useRef<Engine | null>(null);
  const onChangeRef = useRef(onChange);
  const drag = useRef<{ x: number; moved: boolean; pointerId: number } | null>(null);
  const wheelAccum = useRef(0);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const e = createEngine({
      onFrame: setAngle,
      onStop: (s) => {
        setStop(s);
        onChangeRef.current?.(s);
      },
      reducedMotion: () => media.matches,
    });
    engine.current = e;

    // Wheel needs a non-passive listener so it can stop the page scrolling
    // while the pointer is over the dial.
    const svg = svgRef.current;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      wheelAccum.current += event.deltaMode === 1 ? delta * 16 : delta;
      const steps = Math.trunc(wheelAccum.current / WHEEL_PX_PER_STOP);
      if (steps !== 0) {
        wheelAccum.current -= steps * WHEEL_PX_PER_STOP;
        e.step(steps);
      }
    };
    svg?.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      svg?.removeEventListener("wheel", onWheel);
      e.destroy();
      engine.current = null;
    };
  }, []);

  // Screen pixels → degrees of rotation, so the ridge under the pointer
  // tracks it (surface speed = R·ω).
  const pxToDeg = (px: number) => {
    const svg = svgRef.current;
    if (!svg) return 0;
    const scale = svg.getBoundingClientRect().width / VB.w;
    return (px / (R * scale)) * (180 / Math.PI);
  };

  // Is this pointer over the drawn dial itself (not just the padded hit box)?
  const overDial = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return false;
    const rect = svg.getBoundingClientRect();
    const x = VB.x + ((clientX - rect.left) / rect.width) * VB.w;
    const y = VB.y + ((clientY - rect.top) / rect.height) * VB.h;
    return x >= LEFT - 2 && x <= RIGHT + 2 && y >= TOP - 1.5 && y <= BOTTOM + 2;
  };

  // Press on the dial and drag left/right to turn it. With a mouse, the turn
  // stops as soon as the cursor leaves the dial; on touch the finger keeps
  // hold (fingers are bigger than the dial) and a tap clicks one notch.
  const handlePointerDown = (event: PointerEvent<SVGSVGElement>) => {
    event.stopPropagation();
    if (event.button !== 0) return;
    const isMouse = event.pointerType === "mouse";
    if (isMouse && !overDial(event.clientX, event.clientY)) return;
    event.preventDefault();
    if (!isMouse) event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, moved: false, pointerId: event.pointerId };
    setGrabbing(true);
    engine.current?.dragStart();
  };

  const finishDrag = (fling: boolean) => {
    drag.current = null;
    setGrabbing(false);
    engine.current?.dragEnd(fling);
  };

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== event.pointerId) return;
    if (event.pointerType === "mouse" && !overDial(event.clientX, event.clientY)) {
      finishDrag(false);
      return;
    }
    const dx = event.clientX - d.x;
    if (!d.moved && Math.abs(dx) < 3) return;
    d.moved = true;
    d.x = event.clientX;
    engine.current?.dragBy(pxToDeg(dx));
  };

  const endDrag = (event: PointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== event.pointerId) return;
    finishDrag(event.type === "pointerup");
    // A touch tap (no drag) clicks the dial one stop toward the tapped side.
    if (!d.moved && event.type === "pointerup" && event.pointerType !== "mouse") {
      const rect = event.currentTarget.getBoundingClientRect();
      const centreX = rect.left + ((CX - VB.x) / VB.w) * rect.width;
      engine.current?.step(event.clientX >= centreX ? 1 : -1);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    const steps: Record<string, number> = {
      ArrowRight: 1,
      ArrowUp: 1,
      ArrowLeft: -1,
      ArrowDown: -1,
      PageUp: 5,
      PageDown: -5,
      Enter: 1,
      " ": 1,
    };
    const by = steps[event.key];
    if (by === undefined) return;
    // Keep the camera's own Enter/Space tilt from firing too.
    event.preventDefault();
    event.stopPropagation();
    engine.current?.step(by);
  };

  // Project each ridge around the drum onto the front face.
  const ridges = [];
  for (let i = 0; i < DIAL_STOPS; i++) {
    const theta = mod(angle + RIDGE_PHASE + i * STEP + 180, 360) - 180;
    const rad = (theta * Math.PI) / 180;
    const facing = Math.cos(rad);
    if (facing <= 0.06) continue;
    const x = CX + R * Math.sin(rad);
    const w = 0.45 + 1.45 * facing;
    // Light comes from the upper left, so grooves read darker on the right.
    const depth = 0.5 + 0.25 * (1 - facing) + 0.15 * Math.sin(rad);
    ridges.push(
      <g key={i}>
        <rect
          x={x - w / 2}
          y={55.4}
          width={w}
          height={10.8}
          rx={w / 2}
          fill="#a87a4a"
          opacity={depth}
        />
        <rect
          x={x + w / 2}
          y={56}
          width={0.7 * facing}
          height={9.6}
          rx={0.35}
          fill="#fff4da"
          opacity={0.5 * facing}
        />
      </g>,
    );
  }

  const bodyPath = `M${LEFT},${BOTTOM} L${LEFT},${TOP + 3.6} Q${LEFT},${TOP} ${LEFT + 4},${TOP} L${RIGHT - 4},${TOP} Q${RIGHT},${TOP} ${RIGHT},${TOP + 3.6} L${RIGHT},${BOTTOM} Z`;
  // Lifts slightly while pressed, like pulling up a locking mode dial.
  const lift = grabbing ? -0.7 : hovered ? -0.3 : 0;

  return (
    <svg
      ref={svgRef}
      viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={DIAL_STOPS - 1}
      aria-valuenow={stop}
      aria-orientation="horizontal"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={(event) => {
        setHovered(false);
        endDrag(event);
      }}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={handleKeyDown}
      className={`absolute touch-none select-none overflow-visible rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown/50 ${
        "cursor-pointer"
      }`}
      style={{
        left: `${(VB.x / IMG_W) * 100}%`,
        top: `${(VB.y / IMG_H) * 100}%`,
        width: `${(VB.w / IMG_W) * 100}%`,
        height: `${(VB.h / IMG_H) * 100}%`,
      }}
    >
      <defs>
        <linearGradient id={`${id}-drum`} x1={LEFT} x2={RIGHT} y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#d4a36a" />
          <stop offset="0.12" stopColor="#ebc48d" />
          <stop offset="0.38" stopColor="#f8daa8" />
          <stop offset="0.62" stopColor="#efc893" />
          <stop offset="0.88" stopColor="#dcae74" />
          <stop offset="1" stopColor="#c48f58" />
        </linearGradient>
        <linearGradient id={`${id}-shade`} x1="0" x2="0" y1={TOP} y2={BOTTOM + 1.5} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff3d8" stopOpacity="0.7" />
          <stop offset="0.2" stopColor="#fff3d8" stopOpacity="0.12" />
          <stop offset="0.7" stopColor="#7a5230" stopOpacity="0" />
          <stop offset="1" stopColor="#7a5230" stopOpacity="0.35" />
        </linearGradient>
        <clipPath id={`${id}-band`}>
          <rect x={LEFT + 0.6} y={54.6} width={2 * R - 1.2} height={12.4} />
        </clipPath>
        <clipPath id={`${id}-body`}>
          <path d={bodyPath} />
        </clipPath>
        {/* Wobbles the outline a touch so it sits with the hand-painted body. */}
        <filter id={`${id}-rough`} x="-5%" y="-20%" width="110%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="0.7" />
        </filter>
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.18" />
          </feComponentTransfer>
        </filter>
        <filter id={`${id}-soft`} x="-10%" y="-100%" width="120%" height="300%">
          <feGaussianBlur stdDeviation="0.8" />
        </filter>
      </defs>

      {/* Generous transparent hit area. */}
      <rect x={VB.x} y={VB.y} width={VB.w} height={VB.h} fill="transparent" />

      {/* Contact shadow on the camera body. */}
      <ellipse
        cx={CX}
        cy={69.6}
        rx={R + 2}
        ry={1.4}
        fill="#6f4a2f"
        opacity={hovered ? 0.14 : 0.22}
        filter={`url(#${id}-soft)`}
        style={{ transition: "opacity 200ms" }}
      />

      <g
        style={{
          transform: `translateY(${lift}px)`,
          transition: "transform 160ms ease-out",
        }}
      >
        {/* Base flange where the dial meets the body. */}
        <rect
          x={LEFT - 1.6}
          y={65.2}
          width={2 * R + 3.2}
          height={4.6}
          rx={1.4}
          fill={`url(#${id}-drum)`}
          stroke="#9c7e62"
          strokeWidth={0.8}
          filter={`url(#${id}-rough)`}
        />
        <rect x={LEFT - 1.2} y={68} width={2 * R + 2.4} height={1.6} rx={0.8} fill="#7a5230" opacity={0.3} />

        {/* Drum. */}
        <path d={bodyPath} fill={`url(#${id}-drum)`} />
        <g clipPath={`url(#${id}-band)`}>{ridges}</g>
        <path d={bodyPath} fill={`url(#${id}-shade)`} />
        <g clipPath={`url(#${id}-body)`}>
          <rect x={LEFT} y={TOP} width={2 * R} height={BOTTOM - TOP} filter={`url(#${id}-grain)`} />
        </g>

        {/* Top rim catch-light and the lip between rim and knurling. */}
        <path
          d={`M${LEFT + 3},${TOP + 1.4} L${RIGHT - 3},${TOP + 1.4}`}
          stroke="#fff4da"
          strokeWidth={1.4}
          strokeLinecap="round"
          opacity={0.75}
        />
        <path
          d={`M${LEFT + 1.2},${54.4} L${RIGHT - 1.2},${54.4}`}
          stroke="#b98a56"
          strokeWidth={0.6}
          opacity={0.55}
        />

        {/* Ink outline. */}
        <path
          d={bodyPath}
          fill="none"
          stroke="#9c7e62"
          strokeWidth={0.95}
          strokeLinejoin="round"
          filter={`url(#${id}-rough)`}
        />
      </g>
    </svg>
  );
}
