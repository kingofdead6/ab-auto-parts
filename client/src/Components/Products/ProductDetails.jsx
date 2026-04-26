"use client";

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { ArrowLeft, ShoppingCart, Check, ChevronRight } from "lucide-react";

const SimilarProductsGrid = ({ currentProductId, carname }) => {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSimilar = async () => {
      if (!currentProductId) return;

      try {
        // Fetch products filtered by the same carname if available
        const url = carname 
          ? `${API_BASE_URL}/products?carname=${encodeURIComponent(carname)}` 
          : `${API_BASE_URL}/products`;
          
        const res = await axios.get(url);

        const filtered = res.data
          .filter(p => p._id !== currentProductId)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4); // Grid of 4 looks cleaner

        setSimilarProducts(filtered);
      } catch (err) {
        console.error("Failed to load similar products");
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [currentProductId, carname]);

  if (loading) return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-stone-100 animate-pulse rounded-3xl aspect-[3/4]" />
      ))}
    </div>
  );

  if (similarProducts.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {similarProducts.map(product => (
        <div
          key={product._id}
          className="group cursor-pointer"
          onClick={() => {
            navigate(`/product/${product._id}`);
            window.scrollTo(0, 0);
          }}
        >
          <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-stone-100 mb-4">
            <img
              src={product.images?.[0]?.url || "/placeholder.jpg"}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <h3 className="font-bold text-stone-900 truncate">{product.name}</h3>

        </div>
      ))}
    </div>
  );
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showAddedPopup, setShowAddedPopup] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/products/${id}`);
      setProduct(res.data);
      setSelectedImageIndex(0);
    } catch (err) {
      toast.error("Produit non trouvé");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };


  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-stone-400 hover:text-red-600 mb-12 uppercase tracking-widest font-black text-xs transition-colors"
        >
          <ArrowLeft size={16} /> Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* IMAGE SECTION */}
          <div className="space-y-6">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-stone-50 border border-stone-100 shadow-sm">
              <img
                src={product.images[selectedImageIndex]?.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImageIndex === i ? "border-red-600 scale-105 shadow-md" : "border-transparent opacity-50"
                  }`}
                >
                  <img src={img.url} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* INFO SECTION */}
          <div className="flex flex-col justify-center">
            <span className="text-red-600 font-black uppercase tracking-[0.3em] text-sm mb-4">
              {product.carname || "Véhicule"}
            </span>
            <h1 className="text-5xl lg:text-7xl font-black text-stone-900 leading-[0.9] italic uppercase mb-6 tracking-tighter">
              {product.name}
            </h1>
     
          </div>
        </div>

        {/* SIMILAR SECTION */}
        <div className="mt-40">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-12">
                Produits <span className="text-red-600">Similaires</span>
            </h2>
            <SimilarProductsGrid currentProductId={product._id} carname={product.carname} />
        </div>
      </div>

      {/* FIXED POPUP NOTIFICATION */}
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ${showAddedPopup ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
        <div className="bg-stone-900 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-6 border border-white/10 backdrop-blur-xl">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                <Check className="text-white" />
            </div>
            <div>
                <p className="text-xs font-black uppercase tracking-widest text-stone-400">Succès</p>
                <p className="font-bold">Ajouté au panier !</p>
            </div>
        </div>
      </div>
    </div>
  );
}