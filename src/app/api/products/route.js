// app/api/products/route.js - API ESPECÍFICA PARA POLLERÍA
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const category = searchParams.get("category");
    const poultryType = searchParams.get("poultryType");
    const farmingType = searchParams.get("farmingType");
    const productState = searchParams.get("productState");
    const featured = searchParams.get("featured");
    const minPrice = parseFloat(searchParams.get("minPrice")) || 0;
    const maxPrice = parseFloat(searchParams.get("maxPrice"));
    const availableToday = searchParams.get("availableToday");
    const search = searchParams.get("search");
    const skip = (page - 1) * limit;

    await connectDB();

    // Construir query base
    let query = { isActive: true }; // Solo productos activos

    // Filtros específicos para pollería
    if (category && category !== "all") {
      query.category = category;
    }

    if (poultryType && poultryType !== "all") {
      query.poultryType = poultryType;
    }

    if (farmingType && farmingType !== "all") {
      query.farmingType = farmingType;
    }

    if (productState && productState !== "all") {
      query.productState = productState;
    }

    if (featured === "true") {
      query.featured = true;
    }

    // Filtro de precio
    if (minPrice > 0 || maxPrice) {
      query.salePrice = {};
      if (minPrice > 0) query.salePrice.$gte = minPrice;
      if (maxPrice) query.salePrice.$lte = maxPrice;
    }

    // Filtro de disponibilidad para hoy
    if (availableToday === "true") {
      const today = new Date().getDay();
      const days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      query[`availability.${days[today]}`] = true;
    }

    // Búsqueda por texto
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }

    // Get total count with filters
    const total = await Product.countDocuments(query);

    // Get products with pagination and filters
    const products = await Product.find(query)
      .sort({ featured: -1, createdAt: -1 }) // Destacados primero, luego por fecha
      .skip(skip)
      .limit(limit);

    // Agregar información calculada a cada producto
    const productsWithInfo = products.map((product) => {
      const productObj = product.toObject();

      // Agregar virtuals manualmente
      productObj.hasDiscount = product.hasDiscount;
      productObj.discountPercentage = product.discountPercentage;
      productObj.effectivePrice = product.effectivePrice;
      productObj.availableToday = product.availableToday;
      productObj.pricePerKg = product.pricePerKg;
      productObj.isNearExpiration = product.isNearExpiration();

      return productObj;
    });

    return NextResponse.json({
      products: productsWithInfo,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      filters: {
        categories: await Product.distinct("category", { isActive: true }),
        poultryTypes: await Product.distinct("poultryType", { isActive: true }),
        farmingTypes: await Product.distinct("farmingType", { isActive: true }),
        productStates: await Product.distinct("productState", {
          isActive: true,
        }),
      },
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json(
      { message: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Autenticación: sólo admins pueden crear productos
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    const data = await request.json();
    await connectDB();

    // Validaciones de campos obligatorios
    if (!data.title || !data.salePrice || !data.category || !data.imageUrl) {
      const missingFields = [];
      if (!data.title) missingFields.push("Nombre del producto");
      if (!data.salePrice) missingFields.push("Precio de venta");
      if (!data.category) missingFields.push("Categoría");
      if (!data.imageUrl) missingFields.push("Imagen principal");

      return NextResponse.json(
        {
          message: "Faltan campos obligatorios",
          missingFields,
          details: `Por favor completa los siguientes campos: ${missingFields.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Validar que el precio de venta sea mayor a 0
    if (parseFloat(data.salePrice) <= 0) {
      return NextResponse.json(
        { message: "El precio de venta debe ser mayor a 0" },
        { status: 400 }
      );
    }

    // Validar categorías válidas para pollería
    const validCategories = [
      "pollos-enteros",
      "cortes-pollo",
      "huevos",
      "marinados",
      "embutidos",
      "menudencias",
      "productos-organicos",
      "preparados",
      "promociones",
      "otros",
    ];

    if (!validCategories.includes(data.category)) {
      return NextResponse.json(
        { message: "Categoría no válida para pollería" },
        { status: 400 }
      );
    }

    // Validar peso si se proporciona
    if (data.weight && parseFloat(data.weight) <= 0) {
      return NextResponse.json(
        { message: "El peso debe ser mayor a 0" },
        { status: 400 }
      );
    }

    // Preparar datos del producto
    const productData = {
      // Campos obligatorios
      title: data.title.trim(),
      salePrice: parseFloat(data.salePrice),
      category: data.category,
      imageUrl: data.imageUrl,

      // Campos con valores por defecto
      description: data.description || "",
      featured: data.featured || false,
      stock: parseInt(data.stock) || 0,
      cost: parseFloat(data.cost) || 0,
      profitMargin: parseFloat(data.profitMargin) || 0,
      promoPrice: parseFloat(data.promoPrice) || 0,

      // Campos específicos de pollería
      weight: parseFloat(data.weight) || 0,
      weightUnit: data.weightUnit || "kg",
      poultryType: data.poultryType || "pollo",
      farmingType: data.farmingType || "convencional",
      productState: data.productState || "fresco",
      cut: data.cut || "entero",
      expirationDays: parseInt(data.expirationDays) || 3,

      // Información nutricional
      nutritionalInfo: {
        calories: parseFloat(data.nutritionalInfo?.calories) || 0,
        protein: parseFloat(data.nutritionalInfo?.protein) || 0,
        fat: parseFloat(data.nutritionalInfo?.fat) || 0,
        per100g: data.nutritionalInfo?.per100g !== false,
      },

      // Arrays
      ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
      allergens: Array.isArray(data.allergens) ? data.allergens : [],
      certifications: Array.isArray(data.certifications)
        ? data.certifications
        : [],

      // Rango de peso
      weightRange: {
        min: parseFloat(data.weightRange?.min) || 0,
        max: parseFloat(data.weightRange?.max) || 0,
      },

      // Disponibilidad (por defecto todos los días)
      availability: {
        monday: data.availability?.monday !== false,
        tuesday: data.availability?.tuesday !== false,
        wednesday: data.availability?.wednesday !== false,
        thursday: data.availability?.thursday !== false,
        friday: data.availability?.friday !== false,
        saturday: data.availability?.saturday !== false,
        sunday: data.availability?.sunday !== false,
      },

      // SKU manual o se generará automáticamente
      sku: data.sku || undefined,
      isActive: data.isActive !== false,
    };

    // Información adicional de Cloudinary para imagen principal
    if (data.imageCloudinaryInfo) {
      productData.imageCloudinaryInfo = {
        publicId: data.imageCloudinaryInfo.publicId,
        format: data.imageCloudinaryInfo.format,
        width: data.imageCloudinaryInfo.width,
        height: data.imageCloudinaryInfo.height,
        bytes: data.imageCloudinaryInfo.bytes,
      };
    }

    // Procesar variantes de peso/precio
    if (data.variants && Array.isArray(data.variants)) {
      productData.variants = data.variants.map((variant) => ({
        weight: parseFloat(variant.weight) || 0,
        weightUnit: variant.weightUnit || "kg",
        price: parseFloat(variant.price) || 0,
        stock: parseInt(variant.stock) || 0,
        sku: variant.sku || "",
      }));
    }

    // Procesar imágenes adicionales
    if (data.additionalImages && Array.isArray(data.additionalImages)) {
      productData.additionalImages = data.additionalImages.map((img) => ({
        imageUrl: img.imageUrl,
        description: img.description || "",
        ...(img.imageCloudinaryInfo && {
          imageCloudinaryInfo: {
            publicId: img.imageCloudinaryInfo.publicId,
            format: img.imageCloudinaryInfo.format,
            width: img.imageCloudinaryInfo.width,
            height: img.imageCloudinaryInfo.height,
            bytes: img.imageCloudinaryInfo.bytes,
          },
        }),
      }));
    } else {
      productData.additionalImages = [];
    }

    // Verificar si el SKU ya existe (si se proporcionó)
    if (productData.sku) {
      const existingProduct = await Product.findOne({
        sku: productData.sku,
        _id: { $ne: productData._id }, // Excluir el producto actual si es edición
      });

      if (existingProduct) {
        return NextResponse.json(
          { message: "El SKU ya existe. Por favor utilice uno diferente." },
          { status: 400 }
        );
      }
    }

    // Crear el nuevo producto
    const newProduct = await Product.create(productData);

    // Convertir a objeto y agregar virtuals
    const productResponse = newProduct.toObject();
    productResponse.hasDiscount = newProduct.hasDiscount;
    productResponse.discountPercentage = newProduct.discountPercentage;
    productResponse.effectivePrice = newProduct.effectivePrice;
    productResponse.availableToday = newProduct.availableToday;
    productResponse.pricePerKg = newProduct.pricePerKg;
    productResponse.isNearExpiration = newProduct.isNearExpiration();

    return NextResponse.json(
      {
        message: "Producto creado correctamente",
        product: productResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error al crear producto:", error);

    // Manejo de errores más específico
    if (error.name === "ValidationError") {
      const validationErrors = Object.keys(error.errors).map((field) => ({
        field,
        message: error.errors[field].message,
      }));

      return NextResponse.json(
        {
          message: "Error de validación",
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    // Error de duplicado de SKU
    if (error.code === 11000 && error.keyPattern?.sku) {
      return NextResponse.json(
        { message: "El SKU ya existe. Por favor utilice uno diferente." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Error al crear producto: " + error.message },
      { status: 500 }
    );
  }
}
