"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Componente interno que usa useSearchParams
function CategoryFilterContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";

  const handleCategoryChange = (category) => {
    const params = new URLSearchParams(searchParams);

    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap justify-center mb-8 gap-3">
      <button
        className={`px-5 py-2 rounded-full border transition-colors text-sm ${
          currentCategory === "all"
            ? "border-orange-500 bg-orange-500 text-white"
            : "border-gray-300 hover:border-orange-400 text-black"
        }`}
        onClick={() => handleCategoryChange("all")}
      >
        Todos
      </button>
      <button
        className={`px-5 py-2 rounded-full border transition-colors text-sm ${
          currentCategory === "pollos-enteros"
            ? "border-orange-500 bg-orange-500 text-white"
            : "border-gray-300 hover:border-orange-400 text-black"
        }`}
        onClick={() => handleCategoryChange("pollos-enteros")}
      >
        Pollos Enteros
      </button>
      <button
        className={`px-5 py-2 rounded-full border transition-colors text-sm ${
          currentCategory === "cortes-pollo"
            ? "border-orange-500 bg-orange-500 text-white"
            : "border-gray-300 hover:border-orange-400 text-black"
        }`}
        onClick={() => handleCategoryChange("cortes-pollo")}
      >
        Cortes de Pollo
      </button>
      <button
        className={`px-5 py-2 rounded-full border transition-colors text-sm ${
          currentCategory === "huevos"
            ? "border-orange-500 bg-orange-500 text-white"
            : "border-gray-300 hover:border-orange-400 text-black"
        }`}
        onClick={() => handleCategoryChange("huevos")}
      >
        Huevos
      </button>
      <button
        className={`px-5 py-2 rounded-full border transition-colors text-sm ${
          currentCategory === "marinados"
            ? "border-orange-500 bg-orange-500 text-white"
            : "border-gray-300 hover:border-orange-400 text-black"
        }`}
        onClick={() => handleCategoryChange("marinados")}
      >
        Marinados
      </button>
      <button
        className={`px-5 py-2 rounded-full border transition-colors text-sm ${
          currentCategory === "embutidos"
            ? "border-orange-500 bg-orange-500 text-white"
            : "border-gray-300 hover:border-orange-400 text-black"
        }`}
        onClick={() => handleCategoryChange("embutidos")}
      >
        Embutidos
      </button>
      <button
        className={`px-5 py-2 rounded-full border transition-colors text-sm ${
          currentCategory === "menudencias"
            ? "border-orange-500 bg-orange-500 text-white"
            : "border-gray-300 hover:border-orange-400 text-black"
        }`}
        onClick={() => handleCategoryChange("menudencias")}
      >
        Menudencias
      </button>
      <button
        className={`px-5 py-2 rounded-full border transition-colors text-sm ${
          currentCategory === "productos-organicos"
            ? "border-orange-500 bg-orange-500 text-white"
            : "border-gray-300 hover:border-orange-400 text-black"
        }`}
        onClick={() => handleCategoryChange("productos-organicos")}
      >
        Orgánicos
      </button>
      <button
        className={`px-5 py-2 rounded-full border transition-colors text-sm ${
          currentCategory === "preparados"
            ? "border-orange-500 bg-orange-500 text-white"
            : "border-gray-300 hover:border-orange-400 text-black"
        }`}
        onClick={() => handleCategoryChange("preparados")}
      >
        Preparados
      </button>
      <button
        className={`px-5 py-2 rounded-full border transition-colors text-sm ${
          currentCategory === "promociones"
            ? "border-orange-500 bg-orange-500 text-white"
            : "border-gray-300 hover:border-orange-400 text-black"
        }`}
        onClick={() => handleCategoryChange("promociones")}
      >
        Promociones
      </button>
      <button
        className={`px-5 py-2 rounded-full border transition-colors text-sm ${
          currentCategory === "otros"
            ? "border-orange-500 bg-orange-500 text-white"
            : "border-gray-300 hover:border-orange-400 text-black"
        }`}
        onClick={() => handleCategoryChange("otros")}
      >
        Otros
      </button>
    </div>
  );
}

// Componente principal con Suspense
const CategoryFilter = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center mb-8 gap-3 opacity-50">
          Cargando categorías...
        </div>
      }
    >
      <CategoryFilterContent />
    </Suspense>
  );
};

export default CategoryFilter;
