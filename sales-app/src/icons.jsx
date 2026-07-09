// ─────────────────────────────────────────────────────────────
// Set mínimo de íconos de línea (stroke currentColor) — reemplaza
// los emojis del sistema, que se ven distintos en cada equipo y
// restan profesionalismo. Estilo: 24×24, trazo 2, esquinas redondas.
// ─────────────────────────────────────────────────────────────

const PATHS = {
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z",
  coins: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  trophy: "M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4zM7 6H4a3 3 0 0 0 3 5M17 6h3a3 3 0 0 1-3 5",
  puzzle: "M14 7h4a1 1 0 0 1 1 1v4h-2a2 2 0 0 0 0 4h2v4a1 1 0 0 1-1 1h-4v-2a2 2 0 0 0-4 0v2H6a1 1 0 0 1-1-1v-4H3a2 2 0 0 1 0-4h2V8a1 1 0 0 1 1-1h4V5a2 2 0 0 1 4 0v2z",
  trendDown: "M23 18l-9.5-9.5-5 5L1 6M17 18h6v-6",
  lock: "M5 11h14v10H5zM7 11V7a5 5 0 0 1 10 0v4",
  shuffle: "M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  cloud: "M17.5 19a4.5 4.5 0 0 0 0-9 7 7 0 0 0-13.6 2A4 4 0 0 0 6 19h11.5z",
  key: "M21 2l-2 2M15.5 7.5L21 2M11 13a5 5 0 1 1-7.1 7.1A5 5 0 0 1 11 13zM11 13l4.5-4.5M15 11l2 2",
  ball: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM3.5 7.5a10 10 0 0 1 0 9M20.5 7.5a10 10 0 0 0 0 9",
  gift: "M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7c-1.5 0-4.5-.5-4.5-2.5S10.5 2 12 7zM12 7c1.5 0 4.5-.5 4.5-2.5S13.5 2 12 7z",
  megaphone: "M3 11v4l13 5V4L3 9v2zM3 11H2M8 15.5V19a2 2 0 0 0 4 .5M19 9a3 3 0 0 1 0 6",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  building: "M3 21h18M6 21V5l6-3 6 3v16M10 9h.01M10 13h.01M14 9h.01M14 13h.01M10 21v-4h4v4",
  tag: "M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8zM7.5 7.5h.01",
  phone:
    "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2.1z",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  check: "M20 6L9 17l-5-5",
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  loop: "M23 4v6h-6M1 20v-6h6M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15",
  qr: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM18 18h3v3h-3zM14 21h1M21 14v1",
};

export function Icon({ name, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name] ?? PATHS.grid} />
    </svg>
  );
}
