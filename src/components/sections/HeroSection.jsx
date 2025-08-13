// src/components/sections/HeroSection.jsx
"use client";

import Image from "next/image";
import { CTAButton } from "@/components/ui";
import heroImageUrl from "/public/images/portada2.jpg";

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Mobile: Imagen de fondo completa */}
      <div className="absolute inset-0 lg:hidden">
        <Image
          src={heroImageUrl}
          alt="Milanesas premium y productos frescos listos para tu freezer"
          fill
          style={{ objectFit: "cover" }}
          className="transition-opacity duration-500"
          priority
          quality={85}
          sizes="100vw"
        />
        {/* Overlay para mobile */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Desktop: Grid de 2 columnas */}
      <div className="hidden lg:grid lg:grid-cols-2 h-full">
        {/* Columna izquierda - Fondo negro con contenido */}
        <div className="bg-black text-white flex items-center justify-center px-8 xl:px-16">
          <div className="max-w-2xl">
            <h1 className="font-drop font-black uppercase leading-none mb-8">
              <span className="block text-[8vw] xl:text-[6vw] 2xl:text-[5vw] tracking-tighter text-white">
                CALIDAD
              </span>
              <span className="block text-[8vw] xl:text-[6vw] 2xl:text-[5vw] tracking-tighter text-white">
                ARGENTINA
              </span>
              <span className="block text-[8vw] xl:text-[6vw] 2xl:text-[5vw] tracking-tighter text-white">
                QUE ALIMENTA TU DÍA
              </span>
            </h1>

            <p className="text-lg xl:text-xl font-medium mb-8 tracking-wider uppercase text-white/90">
              Elaboración diaria • Listo para tu freezer • Sin agua agregada
            </p>

            <CTAButton />
          </div>
        </div>

        {/* Columna derecha - Imagen */}
        <div className="relative">
          <Image
            src={heroImageUrl}
            alt="Milanesas premium y productos frescos listos para tu freezer"
            fill
            style={{ objectFit: "cover" }}
            className="transition-opacity duration-500"
            priority
            quality={85}
            sizes="50vw"
          />
        </div>
      </div>

      {/* Mobile: Contenido sobre la imagen */}
      <div className="lg:hidden relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-5xl">
          <h1 className="font-drop font-black uppercase leading-none mb-8">
            <span className="block text-[12vw] tracking-tighter text-white drop-shadow-lg">
              MILANESAS
            </span>
            <span className="block text-[12vw] tracking-tighter text-white drop-shadow-lg">
              PREMIUM TODOS LOS DÍAS
            </span>
          </h1>

          <p className="text-xl md:text-2xl font-medium mb-8 tracking-wider uppercase text-white/90 drop-shadow-md max-w-2xl">
            Elaboración diaria • Listo para tu freezer
          </p>

          <CTAButton />
        </div>
      </div>
    </section>
  );
}
