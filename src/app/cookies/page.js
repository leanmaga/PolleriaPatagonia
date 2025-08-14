// app/cookies/page.js
import CookiesContent from "./CookiesContent";

export const metadata = {
  title: "Configuración de Cookies | Sol Campestre",
  description:
    "Gestiona tus preferencias de cookies en Sol Campestre. Información sobre tipos de cookies y cómo controlarlas.",
  keywords: "cookies, configuración, preferencias, analíticas, marketing",
  robots: "index, follow",
  openGraph: {
    title: "Configuración de Cookies | Sol Campestre",
    description:
      "Gestiona tus preferencias de cookies en Sol Campestre. Información sobre tipos de cookies y cómo controlarlas.",
    type: "website",
  },
};

export default function CookiesPage() {
  return <CookiesContent />;
}
