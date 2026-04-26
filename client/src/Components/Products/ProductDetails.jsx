"use client";

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { ArrowLeft, ShoppingCart, Check, ChevronRight, Plus, Minus } from "lucide-react";

// SimilarProductsGrid remains the same logic-wise
const SimilarProductsGrid = ({ currentProductId, carname }) => {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSimilar = async () => {
      if (!currentProductId) return;
      try {
        const url = carname 
          ? `${API_BASE_URL}/products?carname=${encodeURIComponent(carname)}` 
          : `${API_BASE_URL}/products`;
        const res = await axios.get(url);
        const filtered = res.data
          .filter(p => p._id !== currentProductId)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
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
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
    {similarProducts.map((product) => (
      <div
        key={product._id}
        className="group cursor-pointer flex flex-col h-full"
        onClick={() => {
          navigate(`/${product._id}`);
          window.scrollTo(0, 0);
        }}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-stone-100 mb-5 shadow-sm border border-stone-50">
          <img
            src={product.images?.[0]?.url || "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Dark gradient overlay that appears on hover to make button pop */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Action Button - Absolute positioned at the bottom of the image */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/${product._id}`);
                window.scrollTo(0, 0);
              }}
              className="cursor-pointer w-full py-4 bg-white text-stone-900 hover:bg-red-600 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all duration-300 shadow-2xl backdrop-blur-md bg-white/90"
            >
              Voir détails <ChevronRight size={14} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Text Content */}
        <div className="px-2">
          <h3 className="font-black text-stone-900 truncate uppercase text-xs tracking-widest mb-1">
            {product.name}
          </h3>
          <p className="text-red-600 font-bold text-sm italic">
            {product.price?.toLocaleString()} DA
          </p>
        </div>
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
      navigate("/");
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
    <div className="min-h-screen  pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP NAVIGATION & TITLE SECTION */}
        <div className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer flex items-center gap-2 text-stone-400 hover:text-red-600 mb-8 uppercase tracking-widest font-black text-[10px] transition-colors"
          >
            <ArrowLeft size={14} /> Retour au catalogue
          </button>

          <div className="flex flex-col gap-2">
            <span className="text-red-600 font-black uppercase tracking-[0.4em] text-xs">
              {product.carname || "Pièce d'origine"}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-stone-900 leading-none italic uppercase tracking-tighter">
              {product.name}
            </h1>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className=" gap-12 lg:gap-20 border-t border-stone-100 pt-12">
          
          {/* LEFT: IMAGE SECTION (Span 7 columns) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-square md:aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-stone-50 border border-stone-100 shadow-sm">
              <img
                src={product.images[selectedImageIndex]?.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImageIndex === i ? "border-red-600 scale-105 shadow-lg" : "border-transparent opacity-40 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

     
        </div>

        {/* SIMILAR SECTION */}
        <div className=" pt-20 border-t border-stone-100">
            <div className="flex items-end justify-between mb-12">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                    Produits <span className="text-red-600">Similaires</span>
                </h2>
                <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-red-600 flex items-center gap-2">
                    Voir tout <ChevronRight size={14}/>
                </Link>
            </div>
            <SimilarProductsGrid currentProductId={product._id} carname={product.carname} />
        </div>
      </div>

   
    </div>
  );
}