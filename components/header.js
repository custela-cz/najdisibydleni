import Link from "next/link";
import { Icon } from "./shared";
import { B2Logo } from "./logo";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/prihlaseni/actions";

async function currentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

function UserBlock({ user, style = {} }) {
  if (!user) {
    return (
      <Link
        href="/prihlaseni"
        style={{ fontSize: 14, fontWeight: 500, color: "var(--b-ink-2)", ...style }}
      >
        Přihlásit
      </Link>
    );
  }
  const initials =
    (user.user_metadata?.full_name || user.email || "")
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "U";
  return (
    <form action={signOut} style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Link
        href="/dashboard"
        style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--b-ink-2)" }}
      >
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: 999,
            background: "var(--b-cream)",
            color: "var(--b-primary)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--b-display)",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {initials}
        </span>
        <span style={{ maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {user.email}
        </span>
      </Link>
      <button
        type="submit"
        style={{ fontSize: 13, color: "var(--b-muted)", padding: 0, cursor: "pointer" }}
        title="Odhlásit se"
      >
        <Icon name="logout" size={16} />
      </button>
    </form>
  );
}

export async function B2Header({ active }) {
  const user = await currentUser();
  return (
    <header style={{ background: "var(--b-bg)", borderBottom: "1px solid var(--b-line-2)" }}>
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 32px",
          height: 76,
          display: "flex",
          alignItems: "center",
          gap: 48,
        }}
      >
        <Link href="/"><B2Logo /></Link>
        <nav style={{ display: "flex", gap: 28, fontSize: 14 }}>
          {[
            { k: "koupit", l: "Koupit", href: "/koupit" },
            { k: "pronajmout", l: "Pronajmout", href: "/koupit?type=byt-najem" },
            { k: "novostavby", l: "Novostavby", href: "/koupit?type=novostavba" },
            { k: "prodat", l: "Prodat", href: "/vlozit" },
            { k: "makleri", l: "Pro makléře", href: "/dashboard" },
            { k: "magazin", l: "Magazín", href: "/#magazin" },
          ].map((i) => (
            <Link
              key={i.k}
              href={i.href}
              style={{
                color: active === i.k ? "var(--b-ink)" : "var(--b-ink-2)",
                fontWeight: 500,
                position: "relative",
              }}
            >
              {i.l}
              {active === i.k && (
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: -28,
                    height: 2,
                    background: "var(--b-accent)",
                  }}
                />
              )}
            </Link>
          ))}
        </nav>
        <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
          <UserBlock user={user} />
          <Link
            href="/vlozit"
            style={{
              background: "var(--b-primary)",
              color: "var(--b-cream)",
              padding: "11px 20px",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Vložit inzerát <Icon name="arrow-right" size={14} />
          </Link>
        </div>
      </div>
    </header>
  );
}

export async function BHeader() {
  const user = await currentUser();
  return (
    <header style={{ background: "var(--b-bg)", borderBottom: "1px solid var(--b-line-2)" }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
          height: 72,
          display: "flex",
          alignItems: "center",
          gap: 40,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="28" height="28" viewBox="0 0 28 28">
            <path d="M4 14 L14 4 L24 14 L24 24 L4 24 Z" fill="none" stroke="var(--b-primary)" strokeWidth="1.5" />
            <circle cx="14" cy="18" r="2" fill="var(--b-accent)" />
          </svg>
          <div
            style={{
              fontFamily: "var(--b-display)",
              fontWeight: 500,
              fontSize: 20,
              letterSpacing: -0.5,
              fontStyle: "italic",
            }}
          >
            najdi<span style={{ color: "var(--b-accent)" }}>si</span>bydlení
          </div>
        </Link>
        <nav style={{ display: "flex", gap: 28, fontSize: 14 }}>
          {[
            { l: "Koupit", href: "/koupit" },
            { l: "Pronajmout", href: "/koupit?type=byt-najem" },
            { l: "Prodat", href: "/vlozit" },
            { l: "Magazín", href: "/#magazin" },
            { l: "Hypotéky", href: "/#magazin" },
          ].map((i) => (
            <Link key={i.l} href={i.href} style={{ color: "var(--b-ink-2)", fontWeight: 500 }}>
              {i.l}
            </Link>
          ))}
        </nav>
        <div style={{ marginLeft: "auto", display: "flex", gap: 14, alignItems: "center" }}>
          <UserBlock user={user} />
          <Link
            href="/vlozit"
            style={{
              background: "var(--b-primary)",
              color: "var(--b-cream)",
              padding: "10px 18px",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Přidat inzerát <Icon name="arrow-right" size={14} />
          </Link>
        </div>
      </div>
    </header>
  );
}
