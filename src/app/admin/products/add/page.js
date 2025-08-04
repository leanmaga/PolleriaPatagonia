"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import MultipleImageUploader from "@/components/admin/MultipleImageUploader";

export default function AddProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Estados para imágenes - Solo URLs de Cloudinary
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [mainImageInfo, setMainImageInfo] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salePrice: "",
    promoPrice: "",
    cost: "",
    profitMargin: "",
    stock: "",
    category: "",
    featured: false,
  });

  // Estado para calcular automáticamente el margen
  const [autoCalculateMargin, setAutoCalculateMargin] = useState(true);
  const [showFinancialInfo, setShowFinancialInfo] = useState(false);

  // Efecto para calcular el margen automáticamente
  useEffect(() => {
    if (autoCalculateMargin && formData.salePrice && formData.cost) {
      const cost = parseFloat(formData.cost);
      const salePrice = parseFloat(formData.salePrice);

      if (cost > 0 && salePrice > 0) {
        const margin = ((salePrice - cost) / salePrice) * 100;
        setFormData((prev) => ({
          ...prev,
          profitMargin: Math.max(0, Math.min(100, margin)).toFixed(2),
        }));
      }
    }
  }, [formData.salePrice, formData.cost, autoCalculateMargin]);

  // Redirección de autenticación
  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (status === "authenticated" && session?.user?.role !== "admin")
    ) {
      router.push("/auth/signin?callbackUrl=/admin");
    }
  }, [status, session, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Limpiar error de validación cuando el usuario empieza a escribir
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Manejar cambio de imagen principal
  const handleMainImageChange = (info, imageUrl, color) => {
    setMainImageUrl(imageUrl);
    setMainImageInfo(info);

    // Limpiar error de imagen
    if (validationErrors.image) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
    }
  };

  const handleAddImage = (info, imageUrl, color) => {
    const newImage = {
      imageUrl,
      color: color || "",
      info,
    };
    setAdditionalImages((prev) => [...prev, newImage]);
  };

  const handleRemoveImage = (index) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Función de validación
  const validateForm = () => {
    const errors = {};

    // Validar campos obligatorios
    if (!formData.title.trim()) {
      errors.title = "El nombre del producto es obligatorio";
    }

    if (!formData.category) {
      errors.category = "Debes seleccionar una categoría";
    }

    if (!formData.salePrice || parseFloat(formData.salePrice) <= 0) {
      errors.salePrice =
        "El precio de venta es obligatorio y debe ser mayor a 0";
    }

    if (!mainImageUrl) {
      errors.image = "Debes subir una imagen principal del producto";
    }

    // Validaciones opcionales solo si se proporcionan valores
    if (formData.cost && parseFloat(formData.cost) < 0) {
      errors.cost = "El costo no puede ser negativo";
    }

    if (
      formData.profitMargin &&
      (parseFloat(formData.profitMargin) < 0 ||
        parseFloat(formData.profitMargin) > 100)
    ) {
      errors.profitMargin = "El margen debe estar entre 0 y 100%";
    }

    if (formData.promoPrice && parseFloat(formData.promoPrice) < 0) {
      errors.promoPrice = "El precio promocional no puede ser negativo";
    }

    if (formData.stock && parseInt(formData.stock) < 0) {
      errors.stock = "El stock no puede ser negativo";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    if (!validateForm()) {
      toast.error("Por favor completa todos los campos obligatorios");

      // Scroll al primer error
      const firstErrorField = Object.keys(validationErrors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar datos del producto
      const productData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        salePrice: parseFloat(formData.salePrice),
        category: formData.category,
        featured: formData.featured,
        stock: parseInt(formData.stock) || 0,
      };

      // Imagen principal
      if (mainImageUrl) {
        productData.imageUrl = mainImageUrl;

        if (mainImageInfo) {
          productData.imageCloudinaryInfo = {
            publicId: mainImageInfo.public_id,
            format: mainImageInfo.format,
            width: mainImageInfo.width,
            height: mainImageInfo.height,
            bytes: mainImageInfo.bytes,
          };
        }
      }

      // Imágenes adicionales
      productData.additionalImages = additionalImages.map((img) => ({
        imageUrl: img.imageUrl,
        color: img.color || "",
        ...(img.info && {
          imageCloudinaryInfo: {
            publicId: img.info.public_id,
            format: img.info.format,
            width: img.info.width,
            height: img.info.height,
            bytes: img.info.bytes,
          },
        }),
      }));

      // Solo agregar campos financieros opcionales si tienen valor
      if (formData.promoPrice) {
        productData.promoPrice = parseFloat(formData.promoPrice);
      }

      if (formData.cost) {
        productData.cost = parseFloat(formData.cost);
      }

      if (formData.profitMargin) {
        productData.profitMargin = parseFloat(formData.profitMargin);
      }

      // Crear el producto
      const productResponse = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!productResponse.ok) {
        try {
          const error = await productResponse.json();
          console.error("❌ API Error:", error);
          throw new Error(error.message || "Error al crear el producto");
        } catch (jsonError) {
          console.error("❌ JSON Parse Error:", jsonError);
          throw new Error(
            `Error HTTP ${productResponse.status}: Error al crear el producto`
          );
        }
      }

      const result = await productResponse.json();

      toast.success("Producto creado exitosamente");
      router.push("/admin/products");
    } catch (error) {
      console.error("❌ Error creating product:", error);
      toast.error(error.message || "Error al crear el producto");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (
    status === "unauthenticated" ||
    (status === "authenticated" && session?.user?.role !== "admin")
  ) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-semibold mb-6">Agregar Nuevo Producto</h1>

      {/* Mensaje de campos obligatorios */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Por favor completa los campos obligatorios:
              </h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {Object.entries(validationErrors).map(([field, error]) => (
                  <li key={field}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre del producto */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre del producto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                validationErrors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {validationErrors.title && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.title}
              </p>
            )}
          </div>

          {/* Categoría */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                validationErrors.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Selecciona una categoría</option>
              <option value="pollos-enteros">Pollos Enteros</option>
              <option value="cortes-pollo">Cortes de Pollo</option>
              <option value="huevos">Huevos</option>
              <option value="marinados">Marinados y Adobados</option>
              <option value="embutidos">Embutidos y Chorizos</option>
              <option value="menudencias">Menudencias</option>
              <option value="productos-organicos">Productos Orgánicos</option>
              <option value="preparados">Preparados y Listos</option>
              <option value="promociones">Promociones</option>
              <option value="otros">Otros</option>
            </select>
            {validationErrors.category && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.category}
              </p>
            )}
          </div>
        </div>

        {/* Precio de venta y Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="salePrice"
              className="block text-sm font-medium text-gray-700"
            >
              Precio de venta (ARS) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="salePrice"
              name="salePrice"
              value={formData.salePrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                validationErrors.salePrice
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {validationErrors.salePrice && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.salePrice}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700"
            >
              Stock
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                validationErrors.stock ? "border-red-500" : "border-gray-300"
              }`}
            />
            {validationErrors.stock && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.stock}
              </p>
            )}
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>

        {/* Sección de información financiera opcional (colapsable) */}
        <div className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => setShowFinancialInfo(!showFinancialInfo)}
            className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
          >
            <span className="text-lg font-medium text-gray-800">
              Información financiera (opcional)
            </span>
            <svg
              className={`h-5 w-5 transform transition-transform ${
                showFinancialInfo ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showFinancialInfo && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Costo */}
                <div>
                  <label
                    htmlFor="cost"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Costo (ARS)
                  </label>
                  <input
                    type="number"
                    id="cost"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      validationErrors.cost
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Costo interno del producto (no visible para clientes)
                  </p>
                  {validationErrors.cost && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.cost}
                    </p>
                  )}
                </div>

                {/* Precio promocional */}
                <div>
                  <label
                    htmlFor="promoPrice"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Precio promocional (ARS)
                  </label>
                  <input
                    type="number"
                    id="promoPrice"
                    name="promoPrice"
                    value={formData.promoPrice}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      validationErrors.promoPrice
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Precio de oferta (dejar vacío si no aplica)
                  </p>
                  {validationErrors.promoPrice && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.promoPrice}
                    </p>
                  )}
                </div>

                {/* Margen de ganancia */}
                <div className="md:col-span-2">
                  <div className="flex justify-between">
                    <label
                      htmlFor="profitMargin"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Margen de ganancia (%)
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="autoCalculate"
                        checked={autoCalculateMargin}
                        onChange={() =>
                          setAutoCalculateMargin(!autoCalculateMargin)
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="autoCalculate"
                        className="ml-2 text-xs text-gray-600"
                      >
                        Calcular automáticamente
                      </label>
                    </div>
                  </div>
                  <input
                    type="number"
                    id="profitMargin"
                    name="profitMargin"
                    value={formData.profitMargin}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    max="100"
                    disabled={autoCalculateMargin}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      autoCalculateMargin ? "bg-gray-100" : ""
                    } ${
                      validationErrors.profitMargin
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {autoCalculateMargin
                      ? "Calculado como: (precio venta - costo) / precio venta * 100"
                      : "Ingrese el margen manualmente (0-100%)"}
                  </p>
                  {validationErrors.profitMargin && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.profitMargin}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sección de imágenes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imágenes del producto <span className="text-red-500">*</span>
          </label>
          <div
            className={`${
              validationErrors.image ? "ring-2 ring-red-500 rounded-lg" : ""
            }`}
          >
            <MultipleImageUploader
              mainImage={mainImageUrl}
              additionalImages={additionalImages}
              onMainImageChange={handleMainImageChange}
              onAddImage={handleAddImage}
              onRemoveImage={handleRemoveImage}
              colors={[]}
              forceSquareCrop={false}
              showCropPreview={true}
            />
          </div>
          {validationErrors.image && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.image}
            </p>
          )}
        </div>

        {/* Destacado */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            htmlFor="featured"
            className="ml-2 block text-sm text-gray-700"
          >
            Producto destacado (aparecerá en la página principal)
          </label>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {isSubmitting ? "Guardando..." : "Guardar Producto"}
          </button>
        </div>
      </form>
    </div>
  );
}
