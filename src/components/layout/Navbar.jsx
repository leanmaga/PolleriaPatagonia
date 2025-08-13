"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/store";
import {
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import AuthModal from "@/components/auth/AuthModal";
import Image from "next/image";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  // Solo Zustand
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const cartItemsCount = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState("login");

  const isAdmin = session?.user?.role === "admin";
  const hasGoogleImage =
    session?.user?.image &&
    session.user.image.includes("googleusercontent.com");

  const handleSignOut = () => {
    // Limpiar Zustand store
    clearCart();

    // Limpiar directamente localStorage para asegurarse
    localStorage.removeItem("cart-storage");

    // Cerrar sesión
    signOut({ callbackUrl: "/" });
  };

  const isActive = (path) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const openLoginModal = () => {
    setAuthModalView("login");
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthModalView("register");
    setIsAuthModalOpen(true);
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="bg-white border-b border-gray-200 shadow-sm py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/solcampestrecolor.png"
                alt="Logo"
                width={65}
                height={65}
                className="object-cover rounded"
              />
              <Image
                src="/images/solcampestre.png"
                alt="Logo"
                width={120}
                height={65}
                className="object-contain hidden sm:block ml-2"
              />
            </Link>
          </div>

          {/* Navegación central - Solo desktop */}
          <div className="hidden md:flex items-center justify-center space-x-10 flex-grow">
            <Link
              href="/"
              className={`text-sm font-medium transition px-1 py-1 ${
                isActive("/") ? "text-black border-b-2" : "text-gray-700"
              }`}
              style={isActive("/") ? { borderBottomColor: "#F6C343" } : {}}
              onMouseEnter={(e) => {
                if (!isActive("/")) {
                  e.target.style.color = "#F6C343";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/")) {
                  e.target.style.color = "#374151";
                }
              }}
            >
              INICIO
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition px-1 py-1 ${
                isActive("/about") ? "text-black border-b-2" : "text-gray-700"
              }`}
              style={isActive("/about") ? { borderBottomColor: "#F6C343" } : {}}
              onMouseEnter={(e) => {
                if (!isActive("/about")) {
                  e.target.style.color = "#F6C343";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/about")) {
                  e.target.style.color = "#374151";
                }
              }}
            >
              SOBRE NOSOTROS
            </Link>
            <Link
              href="/products"
              className={`text-sm font-medium transition px-1 py-1 ${
                isActive("/products")
                  ? "text-black border-b-2"
                  : "text-gray-700"
              }`}
              style={
                isActive("/products") ? { borderBottomColor: "#F6C343" } : {}
              }
              onMouseEnter={(e) => {
                if (!isActive("/products")) {
                  e.target.style.color = "#F6C343";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/products")) {
                  e.target.style.color = "#374151";
                }
              }}
            >
              PRODUCTOS
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition px-1 py-1 ${
                isActive("/contact") ? "text-black border-b-2" : "text-gray-700"
              }`}
              style={
                isActive("/contact") ? { borderBottomColor: "#F6C343" } : {}
              }
              onMouseEnter={(e) => {
                if (!isActive("/contact")) {
                  e.target.style.color = "#F6C343";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/contact")) {
                  e.target.style.color = "#374151";
                }
              }}
            >
              CONTACTO
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className={`text-sm font-medium transition px-1 py-1 flex items-center ${
                  isActive("/admin") ? "text-black border-b-2" : "text-gray-700"
                }`}
                style={
                  isActive("/admin") ? { borderBottomColor: "#F6C343" } : {}
                }
                onMouseEnter={(e) => {
                  if (!isActive("/admin")) {
                    e.target.style.color = "#F6C343";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive("/admin")) {
                    e.target.style.color = "#374151";
                  }
                }}
              >
                <ShieldCheckIcon className="h-4 w-4 mr-1" />
                ADMIN
              </Link>
            )}
          </div>

          {/* Sección derecha (iconos) */}
          <div className="flex items-center">
            {/* Desktop: Carrito y Opciones de Usuario separados claramente */}
            <div className="hidden md:flex items-center">
              {/* Carrito - Desktop - Con margen mayor */}
              {!isAdmin && (
                <div className="mr-8">
                  <Link
                    href="/cart"
                    className="relative p-2 text-gray-600 transition"
                    onMouseEnter={(e) => {
                      e.target.style.color = "#F6C343";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#4B5563";
                    }}
                  >
                    <ShoppingCartIcon className="h-6 w-6" />
                    {cartItemsCount > 0 && (
                      <span
                        className="absolute top-3 left-2 text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center shadow-sm text-black"
                        style={{ backgroundColor: "#F6C343" }}
                      >
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                </div>
              )}

              {/* Botones de autenticación - Desktop */}
              {!session ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={openLoginModal}
                    className="text-sm font-medium text-gray-700 transition"
                    onMouseEnter={(e) => {
                      e.target.style.color = "#F6C343";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#374151";
                    }}
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={openRegisterModal}
                    className="text-white px-4 py-2 rounded-md text-sm font-medium transition"
                    style={{ backgroundColor: "#F6C343" }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#E6B039";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#F6C343";
                    }}
                  >
                    Registrarse
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-5">
                  {/* Botón + PRODUCTO - Solo admin */}
                  {isAdmin && (
                    <Link
                      href="/admin/products/add"
                      className="text-black px-3 py-2 rounded-md text-sm font-medium flex items-center mr-2 transition"
                      style={{ backgroundColor: "#F6C343" }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#E6B039";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#F6C343";
                      }}
                    >
                      <span className="mr-1">+</span> Producto
                    </Link>
                  )}
                  {/* Perfil */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() =>
                        setIsProfileDropdownOpen(!isProfileDropdownOpen)
                      }
                      className="flex items-center space-x-1 focus:outline-none"
                      aria-label="Menu de usuario"
                    >
                      {hasGoogleImage ? (
                        <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm">
                          <Image
                            src={session.user.image}
                            alt={session.user.name || "Usuario"}
                            fill
                            className="object-cover"
                            sizes="36px"
                          />
                        </div>
                      ) : (
                        <div
                          className="h-9 w-9 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                          style={{ backgroundColor: "#F6C343" }}
                        >
                          <UserIcon className="h-5 w-5 text-black" />
                        </div>
                      )}
                      <ChevronDownIcon className="h-4 w-4 text-gray-600" />
                    </button>

                    {/* Dropdown de perfil */}
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-3 w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                        <div className="p-3 border-b border-gray-100 bg-gray-50">
                          <p className="font-medium text-gray-900">
                            {session.user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {session.user.email}
                          </p>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/profile"
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                            style={{
                              "&:hover": { color: "#F6C343" },
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.color = "#F6C343";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.color = "#374151";
                            }}
                          >
                            Mi Perfil
                          </Link>
                          <Link
                            href="/profile/orders"
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                            onMouseEnter={(e) => {
                              e.target.style.color = "#F6C343";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.color = "#374151";
                            }}
                          >
                            Mis Pedidos
                          </Link>
                          <Link
                            href="/profile/settings"
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                            onMouseEnter={(e) => {
                              e.target.style.color = "#F6C343";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.color = "#374151";
                            }}
                          >
                            Configuración
                          </Link>
                        </div>
                        <div className="border-t border-gray-100 bg-gray-50">
                          <button
                            onClick={handleSignOut}
                            className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Cerrar Sesión
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Versión móvil - Carrito + Hamburguesa */}
            <div className="md:hidden flex items-center space-x-3">
              {/* Carrito en móvil - Siempre visible */}
              {!isAdmin && (
                <Link
                  href="/cart"
                  className="relative p-2 text-gray-600 transition"
                  onMouseEnter={(e) => {
                    e.target.style.color = "#F6C343";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#4B5563";
                  }}
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {cartItemsCount > 0 && (
                    <span
                      className="absolute -top-2 -right-2 text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center shadow-sm text-black"
                      style={{ backgroundColor: "#F6C343" }}
                    >
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              )}
              {/* Menú hamburguesa */}
              <button
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menú"
                onMouseEnter={(e) => {
                  e.target.style.color = "#F6C343";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#4B5563";
                }}
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu - Versión mejorada */}
        <div
          className={`md:hidden fixed inset-0 bg-white z-50 transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Cabecera del menú */}
            <div className="border-b border-gray-200 py-4 px-4 flex justify-between items-center bg-gray-50">
              <Link
                href="/"
                className="flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="relative w-[65px] h-[65px]">
                  <Image
                    src="/images/solcampestrecolor.png"
                    alt="Logo"
                    fill
                    className="object-cover rounded"
                    sizes="65px"
                  />
                </div>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
                aria-label="Cerrar menú"
                onMouseEnter={(e) => {
                  e.target.style.color = "#F6C343";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#4B5563";
                }}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Contenido del menú */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              {/* Perfil - Si está autenticado */}
              {session && (
                <div className="mb-6">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                    {hasGoogleImage ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "Usuario"}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                    ) : (
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                        style={{ backgroundColor: "#F6C343" }}
                      >
                        <UserIcon className="h-6 w-6 text-black" />
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navegación principal */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                    Navegación
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href="/"
                      className={`flex items-center px-3 py-3 rounded-lg ${
                        isActive("/")
                          ? "text-black"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      style={
                        isActive("/") ? { backgroundColor: "#F6C343" } : {}
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-sm font-medium">Inicio</span>
                    </Link>
                    <Link
                      href="/about"
                      className={`flex items-center px-3 py-3 rounded-lg ${
                        isActive("/about")
                          ? "text-black"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      style={
                        isActive("/about") ? { backgroundColor: "#F6C343" } : {}
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-sm font-medium">
                        Sobre Nosotros
                      </span>
                    </Link>
                    <Link
                      href="/products"
                      className={`flex items-center px-3 py-3 rounded-lg ${
                        isActive("/products")
                          ? "text-black"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      style={
                        isActive("/products")
                          ? { backgroundColor: "#F6C343" }
                          : {}
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-sm font-medium">Productos</span>
                    </Link>
                    <Link
                      href="/contact"
                      className={`flex items-center px-3 py-3 rounded-lg ${
                        isActive("/contact")
                          ? "text-black"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      style={
                        isActive("/contact")
                          ? { backgroundColor: "#F6C343" }
                          : {}
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-sm font-medium">Contacto</span>
                    </Link>
                    {!isAdmin && (
                      <Link
                        href="/cart"
                        className={`flex items-center px-3 py-3 rounded-lg ${
                          isActive("/cart")
                            ? "text-black"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        style={
                          isActive("/cart")
                            ? { backgroundColor: "#F6C343" }
                            : {}
                        }
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <ShoppingCartIcon className="h-5 w-5 mr-3" />
                        <span className="text-sm font-medium">Mi Carrito</span>
                        {cartItemsCount > 0 && (
                          <span
                            className="ml-auto text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center text-black"
                            style={{ backgroundColor: "#F6C343" }}
                          >
                            {cartItemsCount}
                          </span>
                        )}
                      </Link>
                    )}
                  </div>
                </div>

                {/* Sección de cuenta - Solo si hay sesión */}
                {session && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                      Mi Cuenta
                    </h3>
                    <div className="space-y-2">
                      <Link
                        href="/profile"
                        className={`flex items-center px-3 py-3 rounded-lg ${
                          isActive("/profile")
                            ? "text-black"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        style={
                          isActive("/profile")
                            ? { backgroundColor: "#F6C343" }
                            : {}
                        }
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="text-sm font-medium">Mi Perfil</span>
                      </Link>
                      <Link
                        href="/profile/orders"
                        className={`flex items-center px-3 py-3 rounded-lg ${
                          isActive("/profile/orders")
                            ? "text-black"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        style={
                          isActive("/profile/orders")
                            ? { backgroundColor: "#F6C343" }
                            : {}
                        }
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="text-sm font-medium">Mis Pedidos</span>
                      </Link>
                      <Link
                        href="/profile/settings"
                        className={`flex items-center px-3 py-3 rounded-lg ${
                          isActive("/profile/settings")
                            ? "text-black"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        style={
                          isActive("/profile/settings")
                            ? { backgroundColor: "#F6C343" }
                            : {}
                        }
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="text-sm font-medium">
                          Configuración
                        </span>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Sección de administración - Solo si es admin */}
                {isAdmin && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                      Administración
                    </h3>
                    <div className="space-y-2">
                      <Link
                        href="/admin"
                        className={`flex items-center px-3 py-3 rounded-lg ${
                          isActive("/admin")
                            ? "text-black"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        style={
                          isActive("/admin")
                            ? { backgroundColor: "#F6C343" }
                            : {}
                        }
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <ShieldCheckIcon className="h-5 w-5 mr-3" />
                        <span className="text-sm font-medium">
                          Panel de Administración
                        </span>
                      </Link>
                      <Link
                        href="/admin/products/add"
                        className="flex items-center px-3 py-3 rounded-lg text-black transition"
                        style={{ backgroundColor: "#F6C343" }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#E6B039";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#F6C343";
                        }}
                      >
                        <span className="text-lg mr-2">+</span>
                        <span className="text-sm font-medium">
                          Crear Producto
                        </span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pie del menú */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              {session ? (
                <button
                  onClick={handleSignOut}
                  className="w-full py-2.5 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 flex justify-center items-center"
                >
                  Cerrar Sesión
                </button>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={openLoginModal}
                    className="w-full py-2.5 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={openRegisterModal}
                    className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-black transition"
                    style={{ backgroundColor: "#F6C343" }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#E6B039";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#F6C343";
                    }}
                  >
                    Registrarse
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Modal de autenticación */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView={authModalView}
      />
    </>
  );
};

export default Navbar;
