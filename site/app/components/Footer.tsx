"use client";

import { useLanguage } from "../i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer
      style={{
        marginTop: 60,
        paddingTop: 20,
        borderTop: "1px solid #1e1e2e",
        fontSize: 12,
        color: "#555570",
        textAlign: "center",
      }}
    >
      {t.footer}
    </footer>
  );
}
