"use client";

import Logo from "./Logo";
import { useLanguage } from "../i18n/LanguageContext";

export default function Header() {
  const { t, toggleLanguage } = useLanguage();

  return (
    <header
      style={{
        marginBottom: 40,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Logo size={40} />
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>{t.title}</h1>
          <p style={{ fontSize: 14, color: "#8888a0", marginTop: 4 }}>
            {t.description}
          </p>
        </div>
      </div>

      <button
        onClick={toggleLanguage}
        style={{
          marginTop: 4,
          padding: "6px 14px",
          background: "transparent",
          border: "1px solid #2a2a3e",
          borderRadius: 6,
          color: "#8888a0",
          fontSize: 13,
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "border-color 0.2s, color 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.borderColor = "#6c8cff";
          (e.target as HTMLButtonElement).style.color = "#6c8cff";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.borderColor = "#2a2a3e";
          (e.target as HTMLButtonElement).style.color = "#8888a0";
        }}
      >
        {t.langToggle}
      </button>
    </header>
  );
}
