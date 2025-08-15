// app/admin/orders/[id]/page.js (Errores de Sonar corregidos)
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getOrderById } from "@/lib/data";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import OrderStatusUpdate from "@/components/admin/OrderStatusUpdate";
import PropTypes from "prop-types";

// Función auxiliar para formatear fechas
const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Función auxiliar para obtener el color del estado
const getStatusColor = (status) => {
  switch (status) {
    case "pagado":
      return "text-green-600";
    case "enviado":
      return "text-blue-600";
    case "cancelado":
      return "text-red-600";
    case "pendiente":
    case "entregado":
      return { color: "#F6C343" };
    default:
      return "text-gray-600";
  }
};

// Función auxiliar para obtener el estilo del estado
const getStatusStyle = (status) => {
  const colorClass = getStatusColor(status);
  if (typeof colorClass === "object") {
    return { ...colorClass, fontWeight: "medium" };
  }
  return { fontWeight: "medium" };
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

  const order = await getOrderById(params.id);

  if (!order) {
    return {
      title: "Pedido no encontrado | TiendaOnline",
    };
  }

  return {
    title: `Pedido #${order._id.substring(0, 8)} | TiendaOnline`,
  };
}

export default async function OrderDetailPage({ params }) {
  // Validación inicial de parámetros
  if (!params?.id) {
    notFound();
  }

  const order = await getOrderById(params.id);

  if (!order) {
    notFound();
  }

  const statusColor = getStatusColor(order.status);
  const statusStyle = getStatusStyle(order.status);
  const statusClassName = typeof statusColor === "string" ? statusColor : "";

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
              {order.items.map((item) => (
                <div key={item._id} className="flex p-6">
                  <div className="flex-shrink-0 overflow-hidden rounded-md border border-gray-200 relative">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      layout="responsive"
                      width={96}
                      height={96}
                      className="object-cover object-center"
                    />
                  </div>

                  <div className="ml-6 flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <h3 className="text-base font-medium text-gray-900">
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
                      </h3>
                      <p className="ml-4 text-sm font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Cantidad: {item.quantity}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Precio unitario: ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen de precios */}
            <div className="border-t border-gray-200 px-6 py-4 space-y-2">
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Subtotal</p>
                <p className="text-sm font-medium text-gray-900">
                  ${order.totalAmount.toFixed(2)}
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
                  ${order.totalAmount.toFixed(2)}
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
              <h2 className="text-lg font-semibold">Información del Cliente</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nombre</h3>
                <p>{order.shippingInfo.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p>{order.shippingInfo.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Teléfono</h3>
                <p>{order.shippingInfo.phone}</p>
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
                <h3 className="text-sm font-medium text-gray-500">Dirección</h3>
                <p>{order.shippingInfo.address}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Ciudad</h3>
                <p>{order.shippingInfo.city}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Código Postal
                </h3>
                <p>{order.shippingInfo.postalCode}</p>
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
                <p>{getPaymentMethodName(order.paymentMethod)}</p>
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
                <p
                  className={`font-medium ${statusClassName}`}
                  style={typeof statusColor === "object" ? statusStyle : {}}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Validación de PropTypes
OrderDetailPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
