// src/app/page.js
import {
  ShoppingBagIcon,
  TruckIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import FeaturedProducts from "@/components/product/FeaturedProducts";
import { ButtonContact, ButtonProducts } from "@/components/ui";
import HeroSection from "@/components/sections/HeroSection";
import CategoriesSection from "@/components/ui/CategoriesSection";

export default function Home() {
  return (
    <>
      {/* Hero Section - Ahora dinámico */}
      <HeroSection />

      {/* Featured Categories */}
      <CategoriesSection />

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-sora-bold uppercase text-3xl font-bold text-center mb-12 text-gray-800">
            Productos Destacados
          </h2>
          <FeaturedProducts />
          <div className="text-center mt-10">
            <ButtonProducts />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-sora-bold uppercase text-3xl font-bold text-center mb-12 text-gray-800">
            ¿Por qué elegir Sol Campestre?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div
                className="p-4 rounded-full mb-4"
                style={{ backgroundColor: "#F6C343" }}
              >
                <ShoppingBagIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-sora-regular uppercase text-xl font-semibold mb-2">
                Elaboración Diaria
              </h3>
              <p className="text-gray-600">
                Milanesas preparadas todos los días para garantizar máxima
                frescura y calidad premium.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div
                className="p-4 rounded-full mb-4"
                style={{ backgroundColor: "#F6C343" }}
              >
                <TruckIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-sora-regular uppercase text-xl font-semibold mb-2">
                Entrega en 24hs
              </h3>
              <p className="text-gray-600">
                Pedí por WhatsApp y recibí en tu zona en menos de 24 horas.
                Cobertura en Belgrano, Palermo, Cañitas, Colegiales y Núñez.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div
                className="p-4 rounded-full mb-4"
                style={{ backgroundColor: "#F6C343" }}
              >
                <CreditCardIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-sora-regular uppercase text-xl font-semibold mb-2">
                Listo para tu Freezer
              </h3>
              <p className="text-gray-600">
                Mercadería separada y empaquetada. Llegás a casa y solo guardás
                en el freezer. Pollos sin agua que no se achican.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section
        className="py-16 text-white"
        style={{ backgroundColor: "#F6C343" }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Tenés preguntas sobre nuestros productos?
          </h2>
          <p className="text-xl mb-8">
            Contactanos por WhatsApp y te respondemos al toque. Atención cordial
            garantizada.
          </p>
          <ButtonContact />
        </div>
      </section>
    </>
  );
}
