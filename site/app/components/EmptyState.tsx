"use client";

import { useLanguage } from "../i18n/LanguageContext";

export default function EmptyState() {
  const { t } = useLanguage();

  return (
    <div
      style={{
        textAlign: "center",
        padding: 80,
        color: "#555570",
      }}
    >
      <p style={{ fontSize: 16 }}>{t.noData}</p>
      <p style={{ fontSize: 13, marginTop: 8 }}>
        {t.runFetcher}
      </p>
    </div>
  );
}
