"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import MultipleImageUploader from "../../components/admin/MultipleImageUploader";

const ProductForm = ({ product = null }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [autoCalculateMargin, setAutoCalculateMargin] = useState(true);
  const [showFinancialInfo, setShowFinancialInfo] = useState(
    // Mostrar abierto si el producto tiene info financiera
    !!(product?.cost || product?.profitMargin || product?.promoPrice)
  );
  const [showNutritionalInfo, setShowNutritionalInfo] = useState(
    // Mostrar si tiene info nutricional
    !!(product?.nutritionalInfo?.calories || product?.nutritionalInfo?.protein)
  );
  const [validationErrors, setValidationErrors] = useState({});

  // Estados para imágenes (solo URLs de Cloudinary)
  const [mainImageUrl, setMainImageUrl] = useState(product?.imageUrl || "");
  const [mainImageInfo, setMainImageInfo] = useState(null);
  const [additionalImages, setAdditionalImages] = useState(
    product?.additionalImages?.map((img) => ({
      imageUrl: img.imageUrl,
      description: img.description || "",
      info: null, // Para imágenes existentes
    })) || []
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: product?.title || "",
      description: product?.description || "",
      salePrice: product?.salePrice?.toString() || "",
      promoPrice: product?.promoPrice?.toString() || "",
      cost: product?.cost?.toString() || "",
      profitMargin: product?.profitMargin?.toString() || "",
      stock: product?.stock?.toString() || "",
      category: product?.category || "",
      featured: product?.featured || false,

      // Campos específicos de pollería
      weight: product?.weight?.toString() || "",
      weightUnit: product?.weightUnit || "kg",
      poultryType: product?.poultryType || "pollo",
      farmingType: product?.farmingType || "convencional",
      productState: product?.productState || "fresco",
      cut: product?.cut || "entero",
      expirationDays: product?.expirationDays?.toString() || "3",

      // Rango de peso
      weightRangeMin: product?.weightRange?.min?.toString() || "",
      weightRangeMax: product?.weightRange?.max?.toString() || "",

      // Información nutricional
      calories: product?.nutritionalInfo?.calories?.toString() || "",
      protein: product?.nutritionalInfo?.protein?.toString() || "",
      fat: product?.nutritionalInfo?.fat?.toString() || "",
      per100g: product?.nutritionalInfo?.per100g !== false,

      // Ingredientes y alérgenos
      ingredients: product?.ingredients?.join(", ") || "",
      allergens: product?.allergens?.join(", ") || "",

      // Certificaciones
      certifications: product?.certifications || [],

      // Disponibilidad por días
      availabilityMonday: product?.availability?.monday !== false,
      availabilityTuesday: product?.availability?.tuesday !== false,
      availabilityWednesday: product?.availability?.wednesday !== false,
      availabilityThursday: product?.availability?.thursday !== false,
      availabilityFriday: product?.availability?.friday !== false,
      availabilitySaturday: product?.availability?.saturday !== false,
      availabilitySunday: product?.availability?.sunday !== false,

      sku: product?.sku || "",
    },
  });

  // Observar los cambios en el formulario
  const watchSalePrice = watch("salePrice");
  const watchCost = watch("cost");
  const watchCategory = watch("category");
  const watchPoultryType = watch("poultryType");
  const watchWeightUnit = watch("weightUnit");

  // Calcular margen automáticamente
  useEffect(() => {
    if (autoCalculateMargin && watchSalePrice && watchCost) {
      const salePrice = parseFloat(watchSalePrice);
      const cost = parseFloat(watchCost);

      if (salePrice > 0 && cost > 0) {
        const margin = ((salePrice - cost) / salePrice) * 100;
        setValue("profitMargin", Math.max(0, Math.min(100, margin)).toFixed(2));
      }
    }
  }, [watchSalePrice, watchCost, autoCalculateMargin, setValue]);

  // Funciones para manejar imágenes
  const handleMainImageChange = (info, imageUrl) => {
    setMainImageUrl(imageUrl);
    setMainImageInfo(info);

    if (validationErrors.image) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
    }
  };

  const handleAddImage = (info, imageUrl, description) => {
    const newImage = {
      imageUrl,
      description: description || "",
      info,
    };
    setAdditionalImages((prev) => [...prev, newImage]);
  };

  const handleRemoveImage = (index) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Función de validación
  const validateForm = (data) => {
    const errors = {};

    // Validar campos obligatorios
    if (!data.title.trim()) {
      errors.title = "El nombre del producto es obligatorio";
    }

    if (!data.category) {
      errors.category = "Debes seleccionar una categoría";
    }

    if (!data.salePrice || parseFloat(data.salePrice) <= 0) {
      errors.salePrice =
        "El precio de venta es obligatorio y debe ser mayor a 0";
    }

    // Para productos nuevos, la imagen es obligatoria
    if (!mainImageUrl && !product) {
      errors.image = "Debes subir una imagen principal del producto";
    }

    // Validaciones específicas de pollería
    if (data.weight && parseFloat(data.weight) < 0) {
      errors.weight = "El peso no puede ser negativo";
    }

    if (data.expirationDays && parseInt(data.expirationDays) < 0) {
      errors.expirationDays = "Los días de vencimiento no pueden ser negativos";
    }

    // Validar rango de peso
    if (data.weightRangeMin && data.weightRangeMax) {
      const min = parseFloat(data.weightRangeMin);
      const max = parseFloat(data.weightRangeMax);
      if (min >= max) {
        errors.weightRange = "El peso mínimo debe ser menor al máximo";
      }
    }

    // Validaciones opcionales
    if (data.cost && parseFloat(data.cost) < 0) {
      errors.cost = "El costo no puede ser negativo";
    }

    if (
      data.profitMargin &&
      (parseFloat(data.profitMargin) < 0 || parseFloat(data.profitMargin) > 100)
    ) {
      errors.profitMargin = "El margen debe estar entre 0 y 100%";
    }

    if (data.promoPrice && parseFloat(data.promoPrice) < 0) {
      errors.promoPrice = "El precio promocional no puede ser negativo";
    }

    if (data.stock && parseInt(data.stock) < 0) {
      errors.stock = "El stock no puede ser negativo";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Función onSubmit
  const onSubmit = async (data) => {
    if (!validateForm(data)) {
      toast.error("Por favor completa todos los campos obligatorios");
      const firstErrorField = Object.keys(validationErrors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setLoading(true);

    try {
      // Preparar datos del producto con estructura que coincida con el modelo
      const productData = {
        title: data.title.trim(),
        description: data.description.trim(),
        salePrice: parseFloat(data.salePrice),
        category: data.category,
        featured: data.featured,

        // Campos específicos de pollería
        weight: data.weight ? parseFloat(data.weight) : 0,
        weightUnit: data.weightUnit,
        poultryType: data.poultryType,
        farmingType: data.farmingType,
        productState: data.productState,
        cut: data.cut,
        expirationDays: data.expirationDays ? parseInt(data.expirationDays) : 3,

        // Rango de peso - corregido para coincidir con el modelo
        weightRange: {
          min: data.weightRangeMin ? parseFloat(data.weightRangeMin) : 0,
          max: data.weightRangeMax ? parseFloat(data.weightRangeMax) : 0,
        },

        // Información nutricional - corregido para coincidir con el modelo
        nutritionalInfo: {
          calories: data.calories ? parseFloat(data.calories) : 0,
          protein: data.protein ? parseFloat(data.protein) : 0,
          fat: data.fat ? parseFloat(data.fat) : 0,
          per100g: data.per100g !== false,
        },

        // Ingredientes y alérgenos - procesado correctamente como arrays
        ingredients: data.ingredients
          ? data.ingredients
              .split(",")
              .map((item) => item.trim())
              .filter((item) => item)
          : [],
        allergens: data.allergens
          ? data.allergens
              .split(",")
              .map((item) => item.trim())
              .filter((item) => item)
          : [],

        // Certificaciones - array de strings
        certifications: Array.isArray(data.certifications)
          ? data.certifications
          : [],

        // Disponibilidad por días - corregido para coincidir con el modelo
        availability: {
          monday: data.availabilityMonday !== false,
          tuesday: data.availabilityTuesday !== false,
          wednesday: data.availabilityWednesday !== false,
          thursday: data.availabilityThursday !== false,
          friday: data.availabilityFriday !== false,
          saturday: data.availabilitySaturday !== false,
          sunday: data.availabilitySunday !== false,
        },

        // SKU si se proporciona
        sku: data.sku || undefined,
      };

      // Campos financieros opcionales
      if (data.promoPrice) {
        productData.promoPrice = parseFloat(data.promoPrice);
      }

      if (data.cost) {
        productData.cost = parseFloat(data.cost);
      }

      if (data.profitMargin) {
        productData.profitMargin = parseFloat(data.profitMargin);
      }

      if (data.stock !== undefined && data.stock !== "") {
        productData.stock = parseInt(data.stock) || 0;
      }

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
        description: img.description || "",
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

      // Enviar a API
      const url = product ? `/api/products/${product._id}` : "/api/products";
      const method = product ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("❌ API Error:", error);
        throw new Error(error.message || "Error al guardar producto");
      }

      const result = await response.json();

      toast.success(
        product
          ? "Producto actualizado correctamente"
          : "Producto creado correctamente"
      );

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("❌ Error saving product:", error);
      toast.error(error.message || "Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center text-indigo-600 hover:text-indigo-800"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-1" />
        Volver
      </button>

      <h1 className="text-2xl font-semibold mb-6">
        {product ? "Editar Producto" : "Agregar Nuevo Producto"}
      </h1>

      {/* Mensaje de errores de validación */}
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div className="space-y-6">
            {/* Información básica */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre del Producto <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  validationErrors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ej: Pollo entero fresco, Pechuga sin hueso..."
                {...register("title")}
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.title}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descripción
              </label>
              <textarea
                id="description"
                rows="4"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
                placeholder="Descripción detallada del producto..."
                {...register("description")}
              />
            </div>

            {/* Categoría */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  validationErrors.category
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                {...register("category")}
              >
                <option value="">Selecciona una categoría</option>
                <option value="pollos-enteros">Pollos Enteros</option>
                <option value="cortes-pollo">Cortes de Pollo</option>
                <option value="huevos">Huevos</option>
                <option value="marinados">Marinados</option>
                <option value="embutidos">Embutidos</option>
                <option value="menudencias">Menudencias</option>
                <option value="productos-organicos">Productos Orgánicos</option>
                <option value="preparados">Preparados</option>
                <option value="promociones">Promociones</option>
                <option value="otros">Otros</option>
              </select>
              {validationErrors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.category}
                </p>
              )}
            </div>

            {/* Precio de venta */}
            <div>
              <label
                htmlFor="salePrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Precio de venta (ARS) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  $
                </span>
                <input
                  id="salePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  className={`w-full pl-7 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    validationErrors.salePrice
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  {...register("salePrice")}
                />
              </div>
              {validationErrors.salePrice && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.salePrice}
                </p>
              )}
            </div>

            {/* Peso y unidad */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Peso/Cantidad
                </label>
                <input
                  id="weight"
                  type="number"
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    validationErrors.weight
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  {...register("weight")}
                />
                {validationErrors.weight && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.weight}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="weightUnit"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Unidad
                </label>
                <select
                  id="weightUnit"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
                  {...register("weightUnit")}
                >
                  <option value="kg">Kilogramos (kg)</option>
                  <option value="g">Gramos (g)</option>
                  <option value="unidad">Unidad</option>
                  <option value="docena">Docena</option>
                </select>
              </div>
            </div>

            {/* Stock */}
            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Stock
              </label>
              <input
                type="number"
                id="stock"
                min="0"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  validationErrors.stock ? "border-red-500" : "border-gray-300"
                }`}
                {...register("stock")}
              />
              {validationErrors.stock && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.stock}
                </p>
              )}
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            {/* Campos específicos de pollería */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Detalles del Producto
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="poultryType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tipo de Producto
                  </label>
                  <select
                    id="poultryType"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
                    {...register("poultryType")}
                  >
                    <option value="pollo">Pollo</option>
                    <option value="gallina">Gallina</option>
                    <option value="gallo">Gallo</option>
                    <option value="pollito">Pollito</option>
                    <option value="huevos">Huevos</option>
                    <option value="embutido">Embutido</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="farmingType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tipo de Crianza
                  </label>
                  <select
                    id="farmingType"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
                    {...register("farmingType")}
                  >
                    <option value="convencional">Convencional</option>
                    <option value="organico">Orgánico</option>
                    <option value="libre-pastoreo">Libre Pastoreo</option>
                    <option value="sin-antibioticos">Sin Antibióticos</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="productState"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Estado del Producto
                  </label>
                  <select
                    id="productState"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
                    {...register("productState")}
                  >
                    <option value="fresco">Fresco</option>
                    <option value="congelado">Congelado</option>
                    <option value="marinado">Marinado</option>
                    <option value="cocido">Cocido</option>
                    <option value="ahumado">Ahumado</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="cut"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tipo de Corte
                  </label>
                  <select
                    id="cut"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
                    {...register("cut")}
                  >
                    <option value="entero">Entero</option>
                    <option value="trozado">Trozado</option>
                    <option value="pechuga">Pechuga</option>
                    <option value="muslo">Muslo</option>
                    <option value="contramuslo">Contramuslo</option>
                    <option value="ala">Ala</option>
                    <option value="cuadril">Cuadril</option>
                    <option value="rabadilla">Rabadilla</option>
                    <option value="menudencias">Menudencias</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="expirationDays"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Días de Vencimiento
                  </label>
                  <input
                    type="number"
                    id="expirationDays"
                    min="0"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      validationErrors.expirationDays
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...register("expirationDays")}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Número de días desde la fecha de elaboración hasta el
                    vencimiento
                  </p>
                  {validationErrors.expirationDays && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.expirationDays}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Rango de peso (para productos variables) */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Rango de Peso (Opcional)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="weightRangeMin"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Peso Mínimo
                  </label>
                  <input
                    type="number"
                    id="weightRangeMin"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
                    {...register("weightRangeMin")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="weightRangeMax"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Peso Máximo
                  </label>
                  <input
                    type="number"
                    id="weightRangeMax"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
                    {...register("weightRangeMax")}
                  />
                </div>
              </div>
              {validationErrors.weightRange && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.weightRange}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Para productos que varían en peso (ej: pollos enteros entre
                1.5kg y 2.2kg)
              </p>
            </div>

            {/* Gestión de imágenes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imágenes del producto{" "}
                {!product && <span className="text-red-500">*</span>}
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
                  descriptions={true} // Para permitir descripciones en imágenes adicionales
                />
              </div>
              {validationErrors.image && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.image}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Secciones adicionales colapsables */}

        {/* Información financiera */}
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
            <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-4">
              <div>
                <label
                  htmlFor="cost"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Costo (ARS)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    $
                  </span>
                  <input
                    id="cost"
                    type="number"
                    step="0.01"
                    min="0"
                    className={`w-full pl-7 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      validationErrors.cost
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...register("cost")}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Costo interno del producto (no visible para clientes)
                </p>
                {validationErrors.cost && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.cost}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="promoPrice"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Precio promocional (ARS)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    $
                  </span>
                  <input
                    id="promoPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    className={`w-full pl-7 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      validationErrors.promoPrice
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...register("promoPrice")}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Precio de oferta (dejar vacío si no aplica)
                </p>
                {validationErrors.promoPrice && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.promoPrice}
                  </p>
                )}
              </div>

              <div>
                <div className="flex justify-between">
                  <label
                    htmlFor="profitMargin"
                    className="block text-sm font-medium text-gray-700 mb-1"
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
                  step="0.01"
                  min="0"
                  max="100"
                  disabled={autoCalculateMargin}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    validationErrors.profitMargin
                      ? "border-red-500"
                      : "border-gray-300"
                  } ${autoCalculateMargin ? "bg-gray-100" : ""}`}
                  {...register("profitMargin")}
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
          )}
        </div>

        {/* Información nutricional */}
        <div className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => setShowNutritionalInfo(!showNutritionalInfo)}
            className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
          >
            <span className="text-lg font-medium text-gray-800">
              Información nutricional (opcional)
            </span>
            <svg
              className={`h-5 w-5 transform transition-transform ${
                showNutritionalInfo ? "rotate-180" : ""
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

          {showNutritionalInfo && (
            <div className="p-4 border-t border-gray-200 bg-green-50 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="calories"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Calorías
                  </label>
                  <input
                    type="number"
                    id="calories"
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
                    {...register("calories")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="protein"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Proteínas (g)
                  </label>
                  <input
                    type="number"
                    id="protein"
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
                    {...register("protein")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="fat"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Grasas (g)
                  </label>
                  <input
                    type="number"
                    id="fat"
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
                    {...register("fat")}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  id="per100g"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  {...register("per100g")}
                />
                <label htmlFor="per100g" className="ml-2 text-sm text-gray-700">
                  Valores por cada 100g
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Ingredientes y certificaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="ingredients"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ingredientes
            </label>
            <textarea
              id="ingredients"
              rows="3"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
              placeholder="Separar con comas: pollo, sal marina, especias..."
              {...register("ingredients")}
            />
            <p className="mt-1 text-xs text-gray-500">
              Lista de ingredientes separados por comas
            </p>
          </div>

          <div>
            <label
              htmlFor="allergens"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Alérgenos
            </label>
            <textarea
              id="allergens"
              rows="3"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
              placeholder="Separar con comas: soja, gluten..."
              {...register("allergens")}
            />
            <p className="mt-1 text-xs text-gray-500">
              Alérgenos presentes separados por comas
            </p>
          </div>
        </div>

        {/* Certificaciones */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Certificaciones
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              "organico",
              "halal",
              "kosher",
              "sin-antibioticos",
              "bienestar-animal",
            ].map((cert) => (
              <div key={cert} className="flex items-center">
                <input
                  id={`cert-${cert}`}
                  type="checkbox"
                  value={cert}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  {...register("certifications")}
                />
                <label
                  htmlFor={`cert-${cert}`}
                  className="ml-2 text-sm text-gray-700 capitalize"
                >
                  {cert.replace("-", " ")}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Disponibilidad por días */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Disponibilidad por días
          </label>
          <div className="grid grid-cols-7 gap-2">
            {[
              { key: "availabilityMonday", label: "Lun" },
              { key: "availabilityTuesday", label: "Mar" },
              { key: "availabilityWednesday", label: "Mié" },
              { key: "availabilityThursday", label: "Jue" },
              { key: "availabilityFriday", label: "Vie" },
              { key: "availabilitySaturday", label: "Sáb" },
              { key: "availabilitySunday", label: "Dom" },
            ].map((day) => (
              <div key={day.key} className="flex flex-col items-center">
                <label htmlFor={day.key} className="text-xs text-gray-600 mb-1">
                  {day.label}
                </label>
                <input
                  id={day.key}
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  {...register(day.key)}
                />
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Selecciona los días en que este producto estará disponible
          </p>
        </div>

        {/* SKU y opciones finales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="sku"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              SKU (Código de producto)
            </label>
            <input
              type="text"
              id="sku"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
              placeholder="Se generará automáticamente si se deja vacío"
              {...register("sku")}
            />
            <p className="mt-1 text-xs text-gray-500">
              Código único para identificar el producto en inventario
            </p>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <input
                id="featured"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                {...register("featured")}
              />
              <label
                htmlFor="featured"
                className="ml-2 block text-sm text-gray-700"
              >
                Producto destacado (aparecerá en la página principal)
              </label>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition mr-4"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Guardando...
              </span>
            ) : (
              "Guardar Producto"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
