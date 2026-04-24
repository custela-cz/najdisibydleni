export const sellerBadge = {
  owner: { l: "Soukromý majitel", c: "var(--b-primary)", bg: "var(--b-primary-soft)" },
  agent: { l: "Ověřený makléř", c: "var(--b-accent)", bg: "var(--b-accent-soft)" },
  dev: { l: "Developer", c: "#876A2A", bg: "#F3EBD8" },
};

export const bInput = {
  width: "100%",
  padding: "12px 16px",
  background: "var(--b-bg)",
  border: "1px solid var(--b-line)",
  borderRadius: 12,
  fontSize: 15,
  outline: "none",
  fontFamily: "inherit",
};

export const bPage = {
  background: "var(--b-bg)",
  color: "var(--b-ink)",
  fontFamily: "var(--b-font)",
  fontSize: 15,
  minHeight: "100vh",
  fontFeatureSettings: '"ss01", "ss02", "cv11"',
};

export const fmt = (n) => new Intl.NumberFormat("cs-CZ").format(n);
