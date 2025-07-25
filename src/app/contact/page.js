"use client";

import { useState } from "react";
import { useForm as useReactHookForm } from "react-hook-form";
import { useForm as useFormspree, ValidationError } from "@formspree/react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  MessageCircle,
} from "lucide-react";

export default function ContactPage() {
  // Reemplaza "xjvdrgba" con tu ID de formulario de Formspree
  const [formspreeState, handleFormspreeSubmit] = useFormspree("xjvdrgba");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useReactHookForm();

  // Mostrar mensaje de éxito cuando el formulario se envía correctamente
  if (formspreeState.succeeded) {
    return (
      <div className="min-h-screen bg-white py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
              ¡Gracias por tu mensaje!
            </h2>
            <p className="text-gray-600 mb-8 text-sm sm:text-base">
              Nos pondremos en contacto contigo lo antes posible.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              Enviar otro mensaje
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const contactInfo = [
    {
      icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Dirección",
      content: "14 de julio 2698, Castelar Sur.",
    },
    {
      icon: <Phone className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Teléfono",
      content: "+54 9 11 2690-7696",
    },
    {
      icon: <Mail className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Email",
      content: "Sofiaballesta1424@gmail.com",
    },
    {
      icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Horarios",
      content:
        "Lunes a Viernes: 8:00 - 20:00\nSábados: 8:00 - 18:00\nDomingos: 9:00 - 15:00",
    },
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
  };

  return (
    <div className="bg-white py-12 sm:py-16 lg:py-20 xl:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-4">
            Ponte en
            <span className="text-yellow-500"> contacto</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para responder todas tus preguntas sobre nuestros
            productos frescos
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20">
          {/* Información de Contacto */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-2 xl:order-1"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
              Información de contacto
            </h2>

            <div className="space-y-6 sm:space-y-8">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4 p-4 sm:p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                >
                  <div className="text-yellow-500 mt-1 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                      {item.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Redes Sociales */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-8 sm:mt-12"
            >
              <h3 className="font-semibold text-gray-800 mb-4 text-sm sm:text-base">
                Síguenos en redes sociales
              </h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/patagonia_script?igsh=ZWNqemd2aGM0cWNq"
                  className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-colors duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>

                <a
                  href="https://wa.me/5491126907696?text=Hola%20quisiera%20saber%20si"
                  className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-1 xl:order-2"
          >
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
                Envía un mensaje
              </h2>

              <form onSubmit={handleFormspreeSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm sm:text-base font-semibold text-gray-800 mb-2"
                  >
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-300 text-sm sm:text-base"
                    placeholder="Tu nombre completo"
                    required
                  />
                  <ValidationError
                    prefix="Name"
                    field="name"
                    errors={formspreeState.errors}
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm sm:text-base font-semibold text-gray-800 mb-2"
                  >
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-300 text-sm sm:text-base"
                    placeholder="tu@email.com"
                    required
                  />
                  <ValidationError
                    prefix="Email"
                    field="email"
                    errors={formspreeState.errors}
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm sm:text-base font-semibold text-gray-800 mb-2"
                  >
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-300 resize-none text-sm sm:text-base"
                    placeholder="Cuéntanos en qué podemos ayudarte..."
                    required
                  />
                  <ValidationError
                    prefix="Message"
                    field="message"
                    errors={formspreeState.errors}
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 sm:py-4 px-6 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  disabled={formspreeState.submitting}
                >
                  {formspreeState.submitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5"
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
                      Enviando mensaje...
                    </span>
                  ) : (
                    "Enviar mensaje"
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16 lg:mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 sm:p-8 rounded-2xl">
            <h3 className="text-lg sm:text-xl font-bold mb-2">
              ¿Necesitas ayuda inmediata?
            </h3>
            <p className="text-sm sm:text-base mb-4 opacity-90">
              Contáctanos por WhatsApp para una respuesta rápida
            </p>
            <a
              href="https://wa.me/5491126907696?text=Hola%20quisiera%20saber%20si"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-white text-yellow-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chatear por WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
