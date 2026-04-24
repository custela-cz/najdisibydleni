import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AuthForm from "./auth-form";
import { PropPhoto } from "@/components/shared";
import { bPage } from "@/components/shared";

export default async function LoginPage({ searchParams }) {
  const sp = searchParams ? await searchParams : {};
  const next = sp.next || "/";
  const mode = sp.mode === "register" ? "register" : "login";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect(next);

  return (
    <div
      className="ab v-b"
      style={{ ...bPage, display: "grid", gridTemplateColumns: "1fr 1.2fr", minHeight: "100vh" }}
    >
      <div style={{ display: "grid", placeItems: "center", padding: 48 }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
            <svg width="28" height="28" viewBox="0 0 28 28">
              <path d="M4 14 L14 4 L24 14 L24 24 L4 24 Z" fill="none" stroke="var(--b-primary)" strokeWidth="1.5" />
              <circle cx="14" cy="18" r="2" fill="var(--b-accent)" />
            </svg>
            <div style={{ fontFamily: "var(--b-display)", fontSize: 20, fontStyle: "italic" }}>
              najdisibydlení
            </div>
          </Link>
          <AuthForm initialMode={mode} next={next} />
        </div>
      </div>
      <div style={{ position: "relative", padding: 24 }}>
        <PropPhoto seed={2} style={{ width: "100%", height: "100%", borderRadius: 24 }} />
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 48,
            right: 48,
            color: "#fff",
            textShadow: "0 2px 8px rgba(0,0,0,.3)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--b-display)",
              fontSize: 36,
              fontWeight: 400,
              fontStyle: "italic",
              lineHeight: 1.1,
              letterSpacing: -0.5,
            }}
          >
            „Našli jsme tady dům, o kterém jsme si mysleli, že už neexistuje.&ldquo;
          </div>
          <div style={{ marginTop: 16, fontSize: 13, opacity: 0.9 }}>— Jana a Pavel, nyní doma v Kostelci</div>
        </div>
      </div>
    </div>
  );
}
