// app/admin/orders/[id]/page.js (CORREGIDO)
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getOrderById } from "@/lib/data";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import OrderStatusUpdate from "@/components/admin/OrderStatusUpdate";
import PropTypes from "prop-types";

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
    return new Date(dateString).toLocaleDateString(undefined, options);
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
  // Validación de params
  if (!params?.id) {
    return {
      title: "Pedido no encontrado | TiendaOnline",
    };
  }

  try {
    const order = await getOrderById(params.id);

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
    // 1. Verificar autenticación PRIMERO
    const session = await getServerSession(authOptions);

    if (!session) {
      redirect("/auth/signin");
    }

    if (session.user.role !== "admin") {
      redirect("/unauthorized");
    }

    // 2. Validar parámetros
    if (!params?.id) {
      console.log("No ID provided in params");
      notFound();
    }

    // 3. Validar que el ID tenga formato válido de MongoDB ObjectId
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    if (!objectIdPattern.test(params.id)) {
      console.log("Invalid ObjectId format:", params.id);
      notFound();
    }

    // 4. Obtener la orden
    console.log("Fetching order with ID:", params.id);
    const order = await getOrderById(params.id);

    if (!order) {
      console.log("Order not found for ID:", params.id);
      notFound();
    }

    console.log("Order found:", order._id);

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
    console.error("Error in OrderDetailPage:", error);

    // En producción, redirigir a una página de error
    if (process.env.NODE_ENV === "production") {
      redirect("/admin/orders?error=order-not-found");
    }

    // En desarrollo, mostrar el error
    throw error;
  }
}

// Validación de PropTypes
OrderDetailPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
