// app/admin/orders/[id]/page.js (ALTERNATIVA usando API)
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import OrderStatusUpdate from "@/components/admin/OrderStatusUpdate";
import PropTypes from "prop-types";

// Función para obtener orden usando la API existente
async function fetchOrderFromAPI(id) {
  try {
    console.log("🌐 Intentando obtener orden via API:", id);

    // Usar URL absoluta para server-side
    const baseUrl = process.env.NEXTAUTH_URL || "https://www.solcampestre.com";
    const url = `${baseUrl}/api/orders/${id}`;

    console.log("🌐 URL de la API:", url);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // No cachear para tener datos frescos
    });

    console.log("🌐 Response status:", response.status);
    console.log("🌐 Response ok:", response.ok);

    if (response.status === 404) {
      console.log("🌐 Orden no encontrada (404)");
      return null;
    }

    if (response.status === 401) {
      console.log("🌐 No autenticado (401)");
      throw new Error("No autenticado");
    }

    if (response.status === 403) {
      console.log("🌐 Sin permisos (403)");
      throw new Error("No tienes permisos para ver esta orden");
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.log("🌐 Error en la respuesta:", response.status, errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("🌐 Datos recibidos de la API:", !!data);
    console.log("🌐 Estructura de datos:", Object.keys(data));

    // La API devuelve { order, paymentDetails }
    const order = data.order || data;
    console.log("🌐 Orden extraída:", !!order);
    console.log("🌐 ID de la orden:", order?._id);

    return order;
  } catch (error) {
    console.error("🌐 Error completo obteniendo orden de la API:", {
      message: error.message,
      stack: error.stack,
      id: id,
    });
    throw error;
  }
}

// Función auxiliar para formatear fechas
const formatDate = (dateString) => {
  try {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  } catch (error) {
    return "Fecha no válida";
  }
};

// Función auxiliar para obtener estilos de estado
const getStatusStyle = (status) => {
  switch (status) {
    case "pagado":
      return { color: "#10b981", fontWeight: "medium" };
    case "enviado":
      return { color: "#2563eb", fontWeight: "medium" };
    case "cancelado":
      return { color: "#dc2626", fontWeight: "medium" };
    case "pendiente":
    case "entregado":
      return { color: "#F6C343", fontWeight: "medium" };
    default:
      return { color: "#4b5563", fontWeight: "medium" };
  }
};

// Función auxiliar para obtener el nombre del método de pago
const getPaymentMethodName = (paymentMethod) => {
  const paymentMethods = {
    mercadopago: "MercadoPago",
    credit_card: "Tarjeta de Crédito",
    debit_card: "Tarjeta de Débito",
  };
  return paymentMethods[paymentMethod] || paymentMethod;
};

export async function generateMetadata({ params }) {
  if (!params?.id) {
    return {
      title: "Pedido no encontrado | TiendaOnline",
    };
  }

  try {
    const order = await fetchOrderFromAPI(params.id);

    if (!order) {
      return {
        title: "Pedido no encontrado | TiendaOnline",
      };
    }

    return {
      title: `Pedido #${order._id.substring(0, 8)} | TiendaOnline`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error | TiendaOnline",
    };
  }
}

export default async function OrderDetailPage({ params }) {
  try {
    console.log("🚀 OrderDetailPage iniciado");
    console.log("🚀 Params recibidos:", params);

    // 1. Verificar autenticación PRIMERO
    const session = await getServerSession(authOptions);
    console.log("🚀 Sesión:", session ? "ENCONTRADA" : "NO ENCONTRADA");

    if (!session) {
      console.log("🚀 No hay sesión, redirigiendo a login");
      redirect("/auth/signin");
    }

    if (session.user.role !== "admin") {
      console.log("🚀 Usuario no es admin, redirigiendo");
      console.log("🚀 Rol del usuario:", session.user.role);
      redirect("/unauthorized");
    }

    console.log("🚀 Usuario autenticado como admin:", session.user.email);

    // 2. Validar parámetros
    if (!params?.id) {
      console.log("🚀 No ID provided in params");
      notFound();
    }

    console.log("🚀 ID recibido:", params.id);
    console.log("🚀 Longitud del ID:", params.id.length);

    // 3. Validar formato de ObjectId (opcional pero recomendado)
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    if (!objectIdPattern.test(params.id)) {
      console.log("🚀 ID no tiene formato de ObjectId válido:", params.id);
      notFound();
    }

    // 4. Obtener la orden usando la API
    console.log("🚀 Intentando obtener orden...");
    const order = await fetchOrderFromAPI(params.id);

    if (!order) {
      console.log("🚀 Orden no encontrada, mostrando 404");
      notFound();
    }

    console.log("🚀 Orden obtenida exitosamente:");
    console.log("🚀   - ID:", order._id);
    console.log("🚀   - Status:", order.status);
    console.log("🚀   - Cliente:", order.shippingInfo?.name);
    console.log("🚀   - Total:", order.totalAmount);
    console.log("🚀   - Items:", order.items?.length);

    const statusStyle = getStatusStyle(order.status);

    return (
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center mb-6 transition-colors"
          style={{ color: "#F6C343" }}
          onMouseEnter={(e) => {
            e.target.style.color = "#E5B63C";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "#F6C343";
          }}
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Volver a todos los pedidos
        </Link>

        <div className="flex flex-col lg:flex-row justify-between items-start mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold">
              Pedido #{order._id.substring(0, 8)}
            </h1>
            <p className="text-gray-500">
              Realizado el {formatDate(order.createdAt)}
            </p>
          </div>

          <OrderStatusUpdate order={order} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Productos del pedido */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">Productos</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={item._id || index} className="flex p-6">
                      <div className="flex-shrink-0 overflow-hidden rounded-md border border-gray-200 relative">
                        <Image
                          src={item.imageUrl || "/placeholder-image.jpg"}
                          alt={item.title || "Producto"}
                          width={96}
                          height={96}
                          className="object-cover object-center"
                        />
                      </div>

                      <div className="ml-6 flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <h3 className="text-base font-medium text-gray-900">
                            {item.product ? (
                              <Link
                                href={`/products/${item.product}`}
                                className="transition-colors"
                                style={{ color: "inherit" }}
                                onMouseEnter={(e) => {
                                  e.target.style.color = "#F6C343";
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.color = "inherit";
                                }}
                              >
                                {item.title}
                              </Link>
                            ) : (
                              item.title
                            )}
                          </h3>
                          <p className="ml-4 text-sm font-medium text-gray-900">
                            $
                            {((item.price || 0) * (item.quantity || 1)).toFixed(
                              2
                            )}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          Cantidad: {item.quantity || 1}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Precio unitario: ${(item.price || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    No hay productos en este pedido
                  </div>
                )}
              </div>

              {/* Resumen de precios */}
              <div className="border-t border-gray-200 px-6 py-4 space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">
                    ${(order.totalAmount || 0).toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">Envío</p>
                  <p className="text-sm font-medium text-gray-900">
                    Por coordinar
                  </p>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <p className="text-base font-medium text-gray-900">Total</p>
                  <p className="text-base font-medium text-gray-900">
                    ${(order.totalAmount || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Información del cliente y envío */}
          <div className="space-y-6">
            {/* Información del Cliente */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">
                  Información del Cliente
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nombre</h3>
                  <p>{order.shippingInfo?.name || "No especificado"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p>{order.shippingInfo?.email || "No especificado"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Teléfono
                  </h3>
                  <p>{order.shippingInfo?.phone || "No especificado"}</p>
                </div>
              </div>
            </div>

            {/* Dirección de Envío */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">Dirección de Envío</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Dirección
                  </h3>
                  <p>{order.shippingInfo?.address || "No especificada"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Ciudad</h3>
                  <p>{order.shippingInfo?.city || "No especificada"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Código Postal
                  </h3>
                  <p>{order.shippingInfo?.postalCode || "No especificado"}</p>
                </div>
              </div>
            </div>

            {/* Información de Pago */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">Información de Pago</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Método de Pago
                  </h3>
                  <p>
                    {getPaymentMethodName(
                      order.paymentMethod || "No especificado"
                    )}
                  </p>
                </div>
                {order.paymentId && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      ID de Pago
                    </h3>
                    <p>{order.paymentId}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Estado</h3>
                  <p style={statusStyle}>
                    {order.status
                      ? order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)
                      : "No especificado"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("🚨 Error completo en OrderDetailPage:", {
      message: error.message,
      stack: error.stack,
      params: params,
    });

    // Manejar errores específicos
    if (error.message.includes("No autenticado")) {
      redirect("/auth/signin");
    }

    if (error.message.includes("permisos")) {
      redirect("/unauthorized");
    }

    // Si es un error de fetch o de red, mostrar un error más específico
    if (
      error.message.includes("fetch") ||
      error.message.includes("ECONNREFUSED")
    ) {
      console.error("🚨 Error de conexión con la API");
      redirect("/admin/orders?error=api-connection-failed");
    }

    // En otros casos, redirigir con error genérico
    console.error("🚨 Error no manejado, redirigiendo con error genérico");
    redirect("/admin/orders?error=order-fetch-failed");
  }
}

OrderDetailPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
