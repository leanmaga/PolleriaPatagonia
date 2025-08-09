import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Por favor proporcione un título"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // Precio de venta (precio principal en tienda) - OBLIGATORIO
    salePrice: {
      type: Number,
      required: [true, "Por favor proporcione el precio de venta"],
      min: [0, "El precio no puede ser negativo"],
    },
    // Precio promocional opcional
    promoPrice: {
      type: Number,
      default: 0,
      min: [0, "El precio promocional no puede ser negativo"],
    },
    // Costo interno (no se muestra en tienda) - OPCIONAL
    cost: {
      type: Number,
      min: [0, "El costo no puede ser negativo"],
      default: 0,
    },
    // Margen de ganancia (%) calculado o manual - OPCIONAL
    profitMargin: {
      type: Number,
      min: [0, "El margen no puede ser negativo"],
      max: [100, "El margen no puede exceder el 100%"],
      default: 0,
    },
    stock: {
      type: Number,
      min: [0, "El stock no puede ser negativo"],
      default: 0,
    },
    category: {
      type: String,
      required: [true, "Por favor proporcione una categoría"],
      enum: [
        // Categorías de pollería
        "pollos-enteros",
        "cortes-pollo",
        "huevos",
        "marinados-pollo",
        "embutidos-pollo",
        "menudencias-pollo",

        // Categorías de carnicería
        "cortes-vacunos",
        "cortes-cerdo",
        "cortes-cordero",
        "milanesas",
        "carne-picada",
        "embutidos-vacunos",
        "vísceras",

        // Categorías generales
        "productos-organicos",
        "preparados",
        "promociones",
        "otros",
      ],
    },

    // === CAMPOS ESPECÍFICOS PARA POLLERÍA Y CARNICERÍA ===

    // Peso del producto (en kg o gramos)
    weight: {
      type: Number,
      min: [0, "El peso no puede ser negativo"],
      default: 0,
    },
    weightUnit: {
      type: String,
      enum: ["kg", "g", "unidad", "docena"],
      default: "kg",
    },

    // Tipo de producto (más general que poultryType)
    productType: {
      type: String,
      enum: [
        // Productos avícolas
        "pollo",
        "gallina",
        "gallo",
        "pollito",
        "huevos",

        // Productos vacunos
        "carne-vacuna",
        "ternera",

        // Productos porcinos
        "cerdo",
        "lechón",

        // Productos ovinos
        "cordero",
        "oveja",

        // Productos procesados
        "embutido",
        "milanesa",
        "preparado",
        "otro",
      ],
      default: "pollo",
    },

    // Tipo de crianza/origen
    farmingType: {
      type: String,
      enum: [
        "convencional",
        "organico",
        "libre-pastoreo",
        "sin-antibioticos",
        "grass-fed", // Para carnes vacunas
        "grain-fed", // Para carnes vacunas
        "natural",
        "premium",
      ],
      default: "convencional",
    },

    // Estado del producto
    productState: {
      type: String,
      enum: [
        "fresco",
        "congelado",
        "marinado",
        "cocido",
        "ahumado",
        "madurado", // Para carnes vacunas
        "empanizado", // Para milanesas
        "procesado",
      ],
      default: "fresco",
    },

    // Para cortes específicos (ahora incluye vacunos)
    cut: {
      type: String,
      enum: [
        // Cortes de pollo
        "entero",
        "trozado",
        "pechuga",
        "muslo",
        "contramuslo",
        "ala",
        "cuadril-pollo",
        "rabadilla",
        "menudencias",

        // Cortes vacunos (basado en las imágenes)
        "tortuguita",
        "bola-de-lomo",
        "peceto",
        "cuadril",
        "colita-de-cuadril",
        "bife-ancho",
        "bife-angosto",
        "osobuco",
        "cuadrada",
        "picaña",
        "nalga",
        "paleta",
        "roast-beef",
        "lomo",
        "entraña",
        "vacío",
        "falda",
        "aguja",
        "cogote",

        // Cortes de cerdo
        "bondiola",
        "costeleta",
        "matambre-cerdo",
        "paleta-cerdo",

        // Otros
        "carne-picada",
        "milanesa-suprema",
        "milanesa-nalga",
        "milanesa-peceto",
        "otro",
      ],
      default: "entero",
    },

    // Rangos de peso para productos variables
    weightRange: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 0,
      },
    },

    // Fecha de vencimiento (importante para productos frescos)
    expirationDays: {
      type: Number,
      min: [0, "Los días de vencimiento no pueden ser negativos"],
      default: 3, // Por defecto 3 días para productos frescos
    },

    // Información nutricional
    nutritionalInfo: {
      calories: {
        type: Number,
        default: 0,
      },
      protein: {
        type: Number,
        default: 0,
      },
      fat: {
        type: Number,
        default: 0,
      },
      // Por cada 100g
      per100g: {
        type: Boolean,
        default: true,
      },
    },

    // Ingredientes y alérgenos
    ingredients: {
      type: [String],
      default: [],
    },
    allergens: {
      type: [String],
      default: [],
    },

    // Certificaciones
    certifications: {
      type: [String],
      enum: [
        "organico",
        "halal",
        "kosher",
        "sin-antibioticos",
        "bienestar-animal",
        "grass-fed",
        "angus",
        "hereford",
        "wagyu",
        "premium",
        "natural",
      ],
      default: [],
    },

    // Grado de carne (para vacunos)
    meatGrade: {
      type: String,
      enum: ["premium", "primera", "segunda", "especial", "comercial", ""],
      default: "",
    },

    // Preparación especial (para milanesas, marinados, etc.)
    specialPreparation: {
      type: String,
      enum: [
        "panko",
        "tradicional",
        "marinado-especias",
        "marinado-vino",
        "adobado",
        "",
      ],
      default: "",
    },

    // Variantes para diferentes pesos o presentaciones
    variants: {
      type: [
        {
          weight: Number,
          weightUnit: {
            type: String,
            enum: ["kg", "g", "unidad", "docena"],
            default: "kg",
          },
          price: Number,
          stock: {
            type: Number,
            default: 0,
            min: 0,
          },
          sku: String,
        },
      ],
      default: [],
    },

    // Campos para fotos y presentación
    imageUrl: {
      type: String,
      required: [true, "Por favor proporcione una imagen"],
    },

    // Información adicional de Cloudinary para la imagen principal
    imageCloudinaryInfo: {
      publicId: String,
      format: String,
      width: Number,
      height: Number,
      bytes: Number,
    },

    // Imágenes adicionales
    additionalImages: {
      type: [
        {
          imageUrl: String,
          description: String, // Ej: "producto marinado", "corte específico"
          imageCloudinaryInfo: {
            publicId: String,
            format: String,
            width: Number,
            height: Number,
            bytes: Number,
          },
        },
      ],
      default: [],
    },

    featured: {
      type: Boolean,
      default: false,
    },

    // Disponibilidad por días de la semana
    availability: {
      monday: { type: Boolean, default: true },
      tuesday: { type: Boolean, default: true },
      wednesday: { type: Boolean, default: true },
      thursday: { type: Boolean, default: true },
      friday: { type: Boolean, default: true },
      saturday: { type: Boolean, default: true },
      sunday: { type: Boolean, default: true },
    },

    // Campos para valoraciones
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },

    // SKU único para inventario
    sku: {
      type: String,
      unique: true,
      sparse: true, // Permite que sea único solo si existe
    },

    // Estado del producto (activo/inactivo)
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Crear índices para mejorar el rendimiento de las consultas
productSchema.index({ category: 1 });
productSchema.index({ productType: 1 }); // Cambié de poultryType a productType
productSchema.index({ farmingType: 1 });
productSchema.index({ productState: 1 });
productSchema.index({ cut: 1 }); // Índice para cortes
productSchema.index({ featured: 1 });
productSchema.index({ salePrice: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ meatGrade: 1 }); // Nuevo índice para grado de carne
productSchema.index({ "variants.weight": 1 });
productSchema.index({ createdAt: -1 });

// Middleware pre-save para cálculos automáticos
productSchema.pre("save", function (next) {
  // Si hay variantes, calcular el stock total
  if (this.variants && this.variants.length > 0) {
    this.stock = this.variants.reduce((total, variant) => {
      return total + (variant.stock || 0);
    }, 0);
  }

  // Si se proporciona costo y precio de venta pero no margen, calcularlo
  if (this.cost > 0 && this.salePrice > 0 && this.profitMargin === 0) {
    this.profitMargin = ((this.salePrice - this.cost) / this.salePrice) * 100;
  }

  // Generar SKU automático si no existe
  if (!this.sku) {
    const categoryCode = this.category.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    this.sku = `${categoryCode}-${timestamp}`;
  }

  next();
});

// Virtual para verificar si tiene descuento
productSchema.virtual("hasDiscount").get(function () {
  return this.promoPrice > 0 && this.promoPrice < this.salePrice;
});

// Virtual para calcular porcentaje de descuento
productSchema.virtual("discountPercentage").get(function () {
  if (this.hasDiscount) {
    return Math.round(
      ((this.salePrice - this.promoPrice) / this.salePrice) * 100
    );
  }
  return 0;
});

// Virtual para precio efectivo (promocional si existe, sino el de venta)
productSchema.virtual("effectivePrice").get(function () {
  return this.hasDiscount ? this.promoPrice : this.salePrice;
});

// Virtual para verificar si está disponible hoy
productSchema.virtual("availableToday").get(function () {
  const today = new Date().getDay(); // 0 = domingo, 1 = lunes, etc.
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return this.availability[days[today]];
});

// Virtual para calcular precio por kg (si el producto se vende por peso)
productSchema.virtual("pricePerKg").get(function () {
  if (this.weight > 0 && this.weightUnit === "kg") {
    return this.effectivePrice / this.weight;
  } else if (this.weight > 0 && this.weightUnit === "g") {
    return (this.effectivePrice / this.weight) * 1000;
  }
  return this.effectivePrice;
});

// Método para verificar si el producto está próximo a vencer
productSchema.methods.isNearExpiration = function () {
  if (!this.createdAt || this.expirationDays === 0) return false;

  const creationDate = new Date(this.createdAt);
  const expirationDate = new Date(creationDate);
  expirationDate.setDate(expirationDate.getDate() + this.expirationDays);

  const today = new Date();
  const daysUntilExpiration = Math.ceil(
    (expirationDate - today) / (1000 * 60 * 60 * 24)
  );

  return daysUntilExpiration <= 1; // Próximo a vencer si queda 1 día o menos
};

// Verificar si el modelo ya existe para evitar sobreescribirlo
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
