"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ChevronRight, X, Car } from "lucide-react";

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState("Tous les véhicules");
  const [availableCars, setAvailableCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    const carFromUrl = searchParams.get("car");
    const searchFromUrl = searchParams.get("search");
    if (carFromUrl) setSelectedCar(carFromUrl);
    if (searchFromUrl) setSearchTerm(searchFromUrl);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/products`);
        const allProducts = res.data || [];
        setProducts(allProducts);
        const uniqueCars = [...new Set(allProducts.map((p) => p.CarType).filter(Boolean))];
        setAvailableCars(["Tous les véhicules", ...uniqueCars.sort()]);
      } catch (err) {
        toast.error("Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const updateURL = (car, search) => {
    const params = new URLSearchParams();
    if (car && car !== "Tous les véhicules") params.set("car", car);
    if (search) params.set("search", search);
    navigate(`?${params.toString()}`, { replace: true });
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCar = selectedCar === "Tous les véhicules" || p.CarType === selectedCar;
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCar && matchSearch;
    });
  }, [products, selectedCar, searchTerm]);

  const displayedProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-500 font-light tracking-widest uppercase text-xs">Chargement</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* MODERN HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between py-12 gap-6">
          <div>
            <h1 className="text-5xl font-black text-stone-900 tracking-tighter italic uppercase">
              Pièces <span className="text-red-600">Pro</span>
            </h1>
            <p className="text-stone-500 font-medium mt-2 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-red-600"></span>
              {filteredProducts.length} Pièces disponibles
            </p>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-red-600 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Référence ou nom..."
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value); updateURL(selectedCar, e.target.value);}}
              className="w-full md:w-80 pl-12 pr-5 py-4 rounded-2xl bg-white border-none shadow-sm focus:ring-2 focus:ring-red-600 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* SIDEBAR */}
          <aside className="w-full lg:w-72 space-y-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100">
              <div className="flex items-center gap-2 mb-6 text-stone-900 font-bold uppercase tracking-wider text-sm">
                <Filter size={16} className="text-red-600" /> Filtrer par véhicule
              </div>
              <div className="space-y-2">
                {availableCars.map((car) => (
                  <button
                    key={car}
                    onClick={() => {setSelectedCar(car); updateURL(car, searchTerm);}}
                    className={`cursor-pointer flex items-center justify-between w-full text-left px-5 py-3 rounded-xl transition-all duration-300 font-medium ${
                      selectedCar === car ? "bg-red-600 text-white shadow-lg shadow-red-200 scale-105" : "text-stone-500 hover:bg-stone-50"
                    }`}
                  >
                    {car}
                    {selectedCar === car && <ChevronRight size={16} />}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* GRID */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {displayedProducts.map((product) => (
                  <motion.div
                    layout
                    key={product._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-stone-100 hover:shadow-2xl hover:shadow-red-50 transition-all duration-500"
                  >
                    <div 
                        className="relative h-64 overflow-hidden cursor-pointer"
                        onClick={() => navigate(`/${product._id}`)}
                    >
                      <img
                        src={product.images?.[0]?.url || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-red-600 shadow-sm">
                        {product.CarType}
                      </div>
                    </div>

                    <div className="p-8">
                      <h3 className="text-xl font-bold text-stone-900 mb-4 line-clamp-1 group-hover:text-red-600 transition-colors">
                        {product.name}
                      </h3>
                      
                      <button 
                        onClick={() => navigate(`/${product._id}`)}
                        className="cursor-pointer w-full py-4 bg-stone-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-all duration-300 shadow-lg shadow-stone-100 hover:shadow-red-100"
                      >
                        Voir détails <ChevronRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}