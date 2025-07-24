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
            ¿Por qué comprar con nosotros?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-indigo-500 p-4 rounded-full mb-4">
                <ShoppingBagIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-sora-regular uppercase text-xl font-semibold mb-2">
                Gran variedad de productos
              </h3>
              <p className="text-gray-600">
                Encuentra todo lo que necesitas en un solo lugar, con la mejor
                calidad.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-indigo-500 p-4 rounded-full mb-4">
                <TruckIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-sora-regular uppercase text-xl font-semibold mb-2">
                Coordinación de envíos
              </h3>
              <p className="text-gray-600">
                Enviamos tu pedido a donde estés. Coordinamos contigo el mejor
                método.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-indigo-500 p-4 rounded-full mb-4">
                <CreditCardIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-sora-regular uppercase text-xl font-semibold mb-2">
                Pagos seguros
              </h3>
              <p className="text-gray-600">
                Utiliza nuestra pasarela de pago con MercadoPago para una compra
                segura.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Tienes preguntas?</h2>
          <p className="text-xl mb-8">
            Estamos aquí para ayudarte con cualquier duda o sugerencia.
          </p>
          <ButtonContact />
        </div>
      </section>
    </>
  );
}
