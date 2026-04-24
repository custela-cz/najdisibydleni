"use client";

import { useState, useTransition } from "react";
import { bInput } from "@/components/shared";
import { signIn, signUp } from "./actions";

export default function AuthForm({ initialMode = "login", next = "/" }) {
  const [mode, setMode] = useState(initialMode);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const fd = new FormData(e.currentTarget);
    fd.set("next", next);
    startTransition(async () => {
      const result = mode === "login" ? await signIn(fd) : await signUp(fd);
      if (result?.error) setError(result.error);
      if (result?.info) setInfo(result.info);
    });
  };

  const isLogin = mode === "login";

  return (
    <>
      <h1
        style={{
          fontFamily: "var(--b-display)",
          fontSize: 44,
          fontWeight: 400,
          margin: "0 0 12px",
          letterSpacing: -1,
          lineHeight: 1,
        }}
      >
        {isLogin ? (
          <>Vítejte<br /><em style={{ color: "var(--b-accent)", fontStyle: "italic", fontWeight: 300 }}>zpátky.</em></>
        ) : (
          <>Založte si <em style={{ color: "var(--b-accent)", fontStyle: "italic", fontWeight: 300 }}>účet.</em></>
        )}
      </h1>
      <p style={{ color: "var(--b-muted)", fontSize: 15, margin: "0 0 32px" }}>
        {isLogin ? "Přihlaste se a pokračujte ve vkládání nabídek." : "Registrace je zdarma, žádné provize."}
      </p>
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {!isLogin && (
          <input name="full_name" placeholder="Jméno a příjmení" style={bInput} autoComplete="name" />
        )}
        <input
          name="email"
          type="email"
          placeholder="E-mail"
          style={bInput}
          autoComplete="email"
          required
        />
        <input
          name="password"
          type="password"
          placeholder={isLogin ? "Heslo" : "Heslo (min. 6 znaků)"}
          style={bInput}
          autoComplete={isLogin ? "current-password" : "new-password"}
          required
          minLength={6}
        />
        {error && (
          <div
            style={{
              padding: 10,
              background: "#FDECEC",
              border: "1px solid #F0B5B5",
              borderRadius: 10,
              fontSize: 13,
              color: "#8C2E2E",
            }}
          >
            {error}
          </div>
        )}
        {info && (
          <div
            style={{
              padding: 10,
              background: "var(--b-primary-soft)",
              borderRadius: 10,
              fontSize: 13,
              color: "var(--b-primary)",
            }}
          >
            {info}
          </div>
        )}
        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: 14,
            background: "var(--b-primary)",
            color: "var(--b-cream)",
            borderRadius: 999,
            fontSize: 15,
            fontWeight: 500,
            cursor: isPending ? "wait" : "pointer",
            opacity: isPending ? 0.7 : 1,
          }}
        >
          {isPending ? "Zpracovávám…" : isLogin ? "Přihlásit se →" : "Zaregistrovat se →"}
        </button>
      </form>
      <div style={{ marginTop: 32, fontSize: 13, color: "var(--b-muted)", textAlign: "center" }}>
        {isLogin ? (
          <>
            Nový zde?{" "}
            <button
              type="button"
              onClick={() => setMode("register")}
              style={{
                color: "var(--b-accent)",
                fontWeight: 500,
                cursor: "pointer",
                padding: 0,
                background: "transparent",
              }}
            >
              Založte si účet
            </button>
          </>
        ) : (
          <>
            Už máte účet?{" "}
            <button
              type="button"
              onClick={() => setMode("login")}
              style={{
                color: "var(--b-accent)",
                fontWeight: 500,
                cursor: "pointer",
                padding: 0,
                background: "transparent",
              }}
            >
              Přihlásit se
            </button>
          </>
        )}
      </div>
    </>
  );
}
