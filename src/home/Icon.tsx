/* Simple line icons for the homepage (24×24, currentColor). */
const PATHS: Record<string, string> = {
  users:
    "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a7 7 0 0 1 14 0v1M17 11a3 3 0 1 0 0-6M22 21v-1a5 5 0 0 0-4-4.9",
  compass: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM16.2 7.8l-2.1 6.3-6.3 2.1 2.1-6.3z",
  car: "M5 17h14v-5l-2-5H7l-2 5zM5 12h14M7.5 17v2M16.5 17v2M8 14.5h.01M16 14.5h.01",
  chevron: "M9 18l6-6-6-6",
  pin: "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  chat: "M4 4h16v12H8l-4 4zM8 9h8M8 12h5",
  bed: "M3 18V6M3 13h18v5M21 18v-3a4 4 0 0 0-4-4h-6v2M7 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  support:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6",
  menu: "M3 6h18M3 12h18M3 18h18",
  close: "M18 6L6 18M6 6l12 12",
  check: "M20 6L9 17l-5-5",
  calendar: "M4 5h16v15H4zM4 10h16M9 3v4M15 3v4",
  phone:
    "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z",
  instagram:
    "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17.5 6.5h.01",
  star: "M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z",
  arrow: "M5 12h14M13 6l6 6-6 6",
};

export function Icon({
  name,
  size = 20,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name] ?? ""} />
    </svg>
  );
}

export function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.6a10.6 10.6 0 0 1-5.4-1.5l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.3 14.3 0 0 0 5.5 4.9c2 .9 2.8.9 3.8.8a3.2 3.2 0 0 0 2.1-1.5 2.6 2.6 0 0 0 .2-1.5c-.1-.2-.3-.3-.6-.4z" />
    </svg>
  );
}

/* Clean vehicle illustrations — stand-ins until genuine fleet photos are supplied. */
export function VehicleArt({ kind }: { kind: string }) {
  const body =
    kind === "Sedan & SUV"
      ? "M14 46l8-14h34l12 14h12v10H14z"
      : kind === "Innova Crysta"
        ? "M12 46l6-16h44l14 16h8v10H12z"
        : kind === "Tempo Traveller"
          ? "M10 24h62l12 14v18H10z"
          : "M6 22h86v34H6z";
  const windows =
    kind === "Sedan & SUV"
      ? ["M26 35h12v9H24z", "M42 35h12l8 9H42z"]
      : kind === "Innova Crysta"
        ? ["M22 33h14v11H20z", "M40 33h18l10 11H40z"]
        : kind === "Tempo Traveller"
          ? ["M16 29h12v9H16z", "M32 29h12v9H32z", "M48 29h12v9H48z", "M64 29h8l7 9H64z"]
          : kind === "AC Sleeper Bus"
            ? ["M12 28h74v6H12z", "M12 40h74v6H12z"]
            : [
                "M12 28h12v12H12z",
                "M28 28h12v12H28z",
                "M44 28h12v12H44z",
                "M60 28h12v12H60z",
                "M76 28h10v12H76z",
              ];
  const wheels = kind.includes("Bus") ? [24, 74] : kind === "Tempo Traveller" ? [26, 70] : [28, 68];
  return (
    <svg viewBox="0 0 98 66" className="veh-art" aria-hidden="true">
      <path d={body} fill="#012E69" />
      {windows.map((w) => (
        <path key={w} d={w} fill="#cfe0f5" />
      ))}
      {wheels.map((x) => (
        <g key={x}>
          <circle cx={x} cy={57} r={7} fill="#202938" />
          <circle cx={x} cy={57} r={3} fill="#F5F6F8" />
        </g>
      ))}
      <path d="M4 64h90" stroke="#dde2ea" strokeWidth={2} />
    </svg>
  );
}
