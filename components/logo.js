export function B2Logo({ size = 28 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 28 28">
        <path d="M4 14 L14 4 L24 14 L24 24 L4 24 Z" fill="none" stroke="var(--b-primary)" strokeWidth="1.5" />
        <circle cx="14" cy="18" r="2" fill="var(--b-accent)" />
      </svg>
      <div
        style={{
          fontFamily: "var(--b-display)",
          fontWeight: 400,
          fontSize: size * 0.72,
          letterSpacing: -0.8,
          lineHeight: 1,
          fontVariationSettings: '"opsz" 144',
        }}
      >
        najdi
        <span style={{ fontStyle: "italic", color: "var(--b-accent)", fontWeight: 300 }}>si</span>
        bydlení
      </div>
    </div>
  );
}
