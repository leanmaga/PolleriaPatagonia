import { motion } from "framer-motion";
import { Clock, Heart, Truck, Shield } from "lucide-react";

export default function AboutSection() {
  const features = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Calidad Rural",
      description:
        "Seleccionamos los mejores productos con el cuidado y tradición del campo",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Eficiencia Urbana",
      description: "Rapidez y practicidad para tu ritmo de vida en la ciudad",
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Delivery Rápido",
      description:
        "Llevamos productos frescos directo a tu puerta en tiempo récord",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Garantía Total",
      description:
        "Respaldamos cada producto con nuestra garantía de frescura y calidad",
    },
  ];

  return (
    <section id="nosotros" className="section-padding bg-white">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Texto e información */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              La fusión perfecta entre
              <span className="text-yellow-500"> tradición y modernidad</span>
            </h2>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              En Granja Urbana combinamos la calidad y el cuidado de los
              productos rurales con la eficiencia y rapidez que necesita la vida
              urbana. Cada día preparamos milanesas frescas y seleccionamos las
              mejores carnes para que tengas productos premium listos para tu
              freezer.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3"
                >
                  <div className="text-yellow-500 mt-1 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
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
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Productos frescos Granja Urbana"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Elementos decorativos */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-yellow-500 rounded-full opacity-30"></div>
          </motion.div>
        </div>

        {/* Estadísticas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8 text-center"
        >
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="text-3xl font-bold text-yellow-500 mb-2">500+</div>
            <div className="text-gray-600">Clientes satisfechos</div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="text-3xl font-bold text-yellow-500 mb-2">100%</div>
            <div className="text-gray-600">Productos frescos</div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="text-3xl font-bold text-yellow-500 mb-2">24h</div>
            <div className="text-gray-600">Máximo delivery</div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="text-3xl font-bold text-yellow-500 mb-2">5⭐</div>
            <div className="text-gray-600">Calificación promedio</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
