"use client";
import { motion } from "framer-motion";
import { Clock, Heart, Truck, Shield } from "lucide-react";
import Image from "next/image";
import imagenAbout from "/public/images/2.jpg";

const features = [
  {
    icon: <Heart className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    title: "Calidad Premium",
    description:
      "Carne vacuna fresca y pollos sin agua que no se achican al cocinar",
  },
  {
    icon: <Clock className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    title: "Elaboración Diaria",
    description: "Milanesas preparadas todos los días para máxima frescura",
  },
  {
    icon: <Truck className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    title: "Entrega Rápida",
    description: "Pedís por WhatsApp, entregamos en 24hs en tu zona",
  },
  {
    icon: <Shield className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
    title: "Listo para Usar",
    description: "Separado y empaquetado, directo al freezer o a la sartén",
  },
];

const statsData = [
  { number: "500+", label: "Clientes satisfechos" },
  { number: "100%", label: "Productos frescos" },
  { number: "24h", label: "Máximo delivery" },
  { number: "4,2⭐", label: "Calificación promedio en google" },
];

const AboutPage = () => {
  return (
    <section
      id="nosotros"
      className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contenido principal */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* Texto e información */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-2 xl:order-1"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
              Más tiempo para lo que importa
              <span className="block sm:inline" style={{ color: "#F6C343" }}>
                {" "}
                Tu solución de comidas prácticas
              </span>
            </h2>

            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              ¿Llegás cansado del trabajo y no sabés qué cocinar? Nosotros lo
              resolvemos. Milanesas premium elaboradas diariamente, carnes
              frescas seleccionadas y todo listo para tu freezer. Solo calentás
              y disfrutás. Porque tu tiempo vale, y la calidad no se negocia. En
              Sol Campestre combinamos la calidad y el cuidado de los productos
              rurales con la eficiencia y rapidez que necesita la vida urbana.
              Cada día preparamos milanesas frescas y seleccionamos los mejores
              pollos para que tengas productos premium listos para tu freezer.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  <div
                    className="mt-1 flex-shrink-0"
                    style={{ color: "#F6C343" }}
                  >
                    {feature.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Imagen */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative order-1 xl:order-2"
          >
            <div className="relative aspect-square sm:aspect-[4/3] xl:aspect-square rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
              <Image
                src={imagenAbout}
                alt="Milanesas premium y productos frescos Sol Campestre"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                priority
              />

              {/* Overlay gradient sutil */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>

            {/* Elementos decorativos - Solo visibles en pantallas medianas+ */}
            <div
              className="hidden sm:block absolute -top-3 -right-3 lg:-top-4 lg:-right-4 w-16 h-16 lg:w-24 lg:h-24 rounded-full opacity-20 animate-pulse"
              style={{ backgroundColor: "#F6C343" }}
            ></div>
            <div
              className="hidden sm:block absolute -bottom-3 -left-3 lg:-bottom-4 lg:-left-4 w-12 h-12 lg:w-16 lg:h-16 rounded-full opacity-30 animate-pulse"
              style={{ backgroundColor: "#F6C343", animationDelay: "1s" }}
            ></div>
          </motion.div>
        </div>

        {/* Estadísticas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16 lg:mt-20"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl text-center hover:shadow-md transition-all duration-300 hover:scale-105"
              >
                <div
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2"
                  style={{ color: "#F6C343" }}
                >
                  {stat.number}
                </div>
                <div className="text-gray-600 text-xs sm:text-sm lg:text-base font-medium leading-tight">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutPage;
