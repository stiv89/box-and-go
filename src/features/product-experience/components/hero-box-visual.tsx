import { DEMO_CHOCOLATES } from "@/data/demo-chocolates";

const HERO_GRID = DEMO_CHOCOLATES.slice(0, 9);
const BOX = 220;
const WALL = 38;

function Chocolate3D({
  color,
  index,
}: {
  color: string;
  index: number;
}) {
  const branded = index === 4;
  return (
    <div
      className="relative rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.18)] ring-1 ring-black/10"
      style={{
        width: 52,
        height: 52,
        backgroundColor: color,
        transform: `translateZ(${6 + (index % 3) * 0.5}px)`,
      }}
    >
      <div
        className="absolute inset-0 rounded-md opacity-35"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 55%, rgba(0,0,0,0.12) 100%)",
        }}
      />
      {branded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-semibold text-[var(--chocolate-dark)] shadow-sm">
            LOGO
          </span>
        </div>
      )}
    </div>
  );
}

export function HeroBoxVisual() {
  return (
    <div
      className="relative flex w-full items-center justify-center bg-white py-4"
      aria-hidden
    >
      <div
        className="relative h-[min(420px,70vw)] w-full max-w-lg"
        style={{ perspective: "1400px", perspectiveOrigin: "50% 42%" }}
      >
        <div
          className="absolute left-1/2 top-[52%] h-8 w-[58%] -translate-x-1/2 rounded-[100%] bg-black/[0.07] blur-xl"
          style={{ transform: "translateX(-50%) rotateX(78deg) scaleY(0.35)" }}
        />

        <div
          className="absolute left-1/2 top-1/2"
          style={{
            transformStyle: "preserve-3d",
            transform: "translate(-50%, -54%) rotateX(54deg) rotateZ(-38deg)",
          }}
        >
          {/* Lid — open */}
          <div
            className="absolute rounded-sm border border-[#e8dfd4] bg-gradient-to-br from-[#faf8f5] to-[#f0ebe3] shadow-md"
            style={{
              width: BOX + 6,
              height: BOX + 6,
              left: -3,
              top: -3,
              transformOrigin: "50% 100%",
              transform: "translateY(-2px) rotateX(-118deg) translateZ(-WALL * 0.4)",
            }}
          >
            <div
              className="absolute left-1/2 top-[42%] h-3 w-[72%] -translate-x-1/2 rounded-sm bg-[var(--gold)] shadow-sm"
            />
          </div>

          {/* Ribbon bow */}
          <div
            className="absolute left-1/2 z-20 -translate-x-1/2 rounded-sm bg-[var(--gold)] shadow-md"
            style={{
              width: 88,
              height: 14,
              top: -WALL - 10,
              transform: "translateZ(48px)",
            }}
          >
            <div
              className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 bg-[var(--gold)]"
            />
          </div>

          {/* Box group */}
          <div style={{ transformStyle: "preserve-3d", width: BOX, height: BOX }}>
            {/* Bottom / tray */}
            <div
              className="absolute inset-0 rounded-sm bg-[#f5f0e8] shadow-inner ring-1 ring-[#e5ddd2]"
              style={{ transform: `translateZ(0px)` }}
            >
              <div
                className="absolute inset-2 grid grid-cols-3 gap-1.5 p-1"
                style={{ transformStyle: "preserve-3d" }}
              >
                {HERO_GRID.map((chocolate, index) => (
                  <Chocolate3D key={chocolate.id} color={chocolate.color} index={index} />
                ))}
              </div>
            </div>

            {/* Front wall */}
            <div
              className="absolute bg-gradient-to-b from-[#ebe4da] to-[#ddd4c8] ring-1 ring-[#d5ccc0]"
              style={{
                width: BOX,
                height: WALL,
                left: 0,
                bottom: 0,
                transformOrigin: "bottom center",
                transform: `rotateX(-90deg) translateZ(${BOX / 2}px)`,
              }}
            />

            {/* Back wall */}
            <div
              className="absolute bg-gradient-to-b from-[#e5ddd2] to-[#d8cfc3] ring-1 ring-[#d0c7bb]"
              style={{
                width: BOX,
                height: WALL,
                left: 0,
                top: 0,
                transformOrigin: "top center",
                transform: `rotateX(90deg) translateZ(${BOX / 2}px)`,
              }}
            />

            {/* Left wall */}
            <div
              className="absolute bg-gradient-to-b from-[#e8e0d6] to-[#dad1c5] ring-1 ring-[#d2c9bd]"
              style={{
                width: WALL,
                height: BOX,
                left: 0,
                top: 0,
                transformOrigin: "left center",
                transform: `rotateY(-90deg) translateZ(${BOX / 2}px)`,
              }}
            />

            {/* Right wall */}
            <div
              className="absolute bg-gradient-to-b from-[#e3dbd1] to-[#d5cdc1] ring-1 ring-[#cdc4b8]"
              style={{
                width: WALL,
                height: BOX,
                right: 0,
                top: 0,
                transformOrigin: "right center",
                transform: `rotateY(90deg) translateZ(${BOX / 2}px)`,
              }}
            />
          </div>
        </div>
      </div>

      <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center text-[10px] tracking-[0.2em] text-neutral-400 uppercase">
        Sample 9-piece arrangement
      </p>
    </div>
  );
}
