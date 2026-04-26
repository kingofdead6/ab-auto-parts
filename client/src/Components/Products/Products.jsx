"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCar, setSelectedCar] = useState("Tous les véhicules");
  const [availableCars, setAvailableCars] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const productsPerPage = 9;

  // Sync URL params
  useEffect(() => {
    const carFromUrl = searchParams.get("car");
    const searchFromUrl = searchParams.get("search");

    if (carFromUrl) setSelectedCar(carFromUrl);
    if (searchFromUrl) setSearchTerm(searchFromUrl);
  }, [searchParams]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/products`);
        const allProducts = res.data || [];

        setProducts(allProducts);

        const uniqueCars = [
          ...new Set(allProducts.map((p) => p.CarType).filter(Boolean)),
        ];

        setAvailableCars(["Tous les véhicules", ...uniqueCars.sort()]);
      } catch (err) {
        toast.error("Erreur lors du chargement des produits");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle filters
  const handleCarChange = (car) => {
    setSelectedCar(car);
    setCurrentPage(1);

    updateURL(car, searchTerm);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);

    updateURL(selectedCar, value);
  };

  const updateURL = (car, search) => {
    const params = new URLSearchParams();

    if (car && car !== "Tous les véhicules") {
      params.set("car", car);
    }

    if (search) {
      params.set("search", search);
    }

    navigate(`?${params.toString()}`, { replace: true });
  };

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCar =
        selectedCar === "Tous les véhicules" || p.CarType === selectedCar;

      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase());

      return matchCar && matchSearch;
    });
  }, [products, selectedCar, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const clearFilters = () => {
    setSelectedCar("Tous les véhicules");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const hasActiveFilter =
    selectedCar !== "Tous les véhicules" || searchTerm !== "";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Pièces automobiles</h1>

          <p className="text-stone-600 mt-2">
            {filteredProducts.length} résultat
            {filteredProducts.length > 1 ? "s" : ""}
          </p>

          {/* SEARCH */}
          <div className="mt-6">
            <input
              type="text"
              placeholder="Rechercher une pièce (ex: filtre, moteur...)"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full md:w-96 px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="flex gap-10">

          {/* SIDEBAR */}
          <aside className="hidden lg:block w-64">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-semibold mb-4">Véhicules</h3>

              {availableCars.map((car) => (
                <button
                  key={car}
                  onClick={() => handleCarChange(car)}
                  className={`block w-full text-left px-4 py-2 rounded-lg mb-1 ${
                    selectedCar === car
                      ? "bg-red-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {car}
                </button>
              ))}

              {hasActiveFilter && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-red-600"
                >
                  Réinitialiser
                </button>
              )}
            </div>
          </aside>

          {/* PRODUCTS */}
          <main className="flex-1">
            {displayedProducts.length === 0 ? (
              <div className="text-center py-20">
                Aucun produit trouvé
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {displayedProducts.map((product) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
                    >
                      <Link to={`/${product._id}`}>
                        <img
                          src={product.images?.[0]?.url || "/placeholder.jpg"}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                      </Link>

                      <div className="p-4">
                        <h3 className="font-semibold">
                          {product.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {product.CarType}
                        </p>

                        <Link
                          to={`/${product._id}`}
                          className="text-red-600 text-sm mt-2 inline-block"
                        >
                          Voir détails →
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-10 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (n) => (
                        <button
                          key={n}
                          onClick={() => setCurrentPage(n)}
                          className={`w-10 h-10 rounded-lg ${
                            n === currentPage
                              ? "bg-black text-white"
                              : "border"
                          }`}
                        >
                          {n}
                        </button>
                      )
                    )}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}