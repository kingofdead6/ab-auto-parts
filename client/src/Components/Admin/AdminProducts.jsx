import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { Plus, Search, X, Edit, Trash2, Filter, Image as ImageIcon } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [carOptions, setCarOptions] = useState([]); // Defined Car Names
  const [selectedCar, setSelectedCar] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({ name: "", CarType: "", images: [] });

  useEffect(() => {
    fetchProducts();
    fetchCarNames();
  }, []);

  const fetchCarNames = async () => {
    const res = await axios.get(`${API_BASE_URL}/car-names`);
    setCarOptions(res.data);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/products`);
      setProducts(res.data || []);
    } catch (err) { toast.error("Erreur chargement"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const filtered = products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCar = !selectedCar || p.CarType === selectedCar;
      return matchSearch && matchCar;
    });
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.CarType) return toast.warning("Sélectionnez une marque");
    
    setLoading(true);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("CarType", form.CarType);
    form.images.filter(img => img.file).forEach(img => formData.append("images", img.file));

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/products/${editingId}`, formData);
        toast.success("Produit mis à jour");
      } else {
        await axios.post(`${API_BASE_URL}/products`, formData);
        toast.success("Produit créé");
      }
      resetForm();
      fetchProducts();
    } catch { toast.error("Erreur sauvegarde"); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setForm({ name: "", CarType: "", images: [] });
    setEditingId(null);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Catalogue Pièces</h1>
            <p className="text-gray-500 mt-2">Gérez vos articles et affectations véhicules</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 transition shadow-xl shadow-red-200 font-semibold"
          >
            <Plus size={20}/> Ajouter une pièce
          </button>
        </div>

        {/* FILTERS */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-10">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
            <input
              type="text"
              placeholder="Rechercher une pièce..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none focus:ring-2 ring-red-500 transition"
            />
          </div>
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
            <Filter size={18} className="text-gray-400" />
            <select
              value={selectedCar}
              onChange={(e) => setSelectedCar(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-gray-700 font-medium cursor-pointer"
            >
              <option value="">Toutes les marques</option>
              {carOptions.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* PRODUCT LIST */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((p) => (
            <motion.div layout key={p._id} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all group">
              <div className="h-56 relative overflow-hidden bg-gray-100">
                <img
                  src={p.images?.[0]?.url || "/placeholder.jpg"}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-red-600 shadow-sm">
                  {p.CarType}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 truncate">{p.name}</h3>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => { setEditingId(p._id); setForm({name: p.name, CarType: p.CarType, images: p.images.map(i=>({preview: i.url, url: i.url}))}); setShowModal(true); }} className="cursor-pointer flex-1 flex justify-center items-center py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="cursor-pointer flex-1 flex justify-center items-center py-3 border-2 border-gray-100 text-red-500 rounded-xl hover:bg-red-50 transition">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* MODAL */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                  <h2 className="text-2xl font-bold">{editingId ? "Éditer le produit" : "Nouveau produit"}</h2>
                  <button onClick={resetForm} className="cursor-pointer p-2 hover:bg-red-500 rounded-full transition "><X /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 ml-1">Nom de la pièce</label>
                    <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 ring-red-500 transition" required placeholder="ex: Disque de frein ventilé"/>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 ml-1">Marque du véhicule</label>
                    <select value={form.CarType} onChange={(e) => setForm({...form, CarType: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 ring-red-500 transition cursor-pointer" required>
                      <option value="">Sélectionner une marque...</option>
                      {carOptions.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-500 ml-1">Photos (Max 3)</label>
                    <div className="grid grid-cols-4 gap-4">
                      {form.images.map((img, i) => (
                        <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group">
                          <img src={img.preview || img.url} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setForm({...form, images: form.images.filter((_, idx)=> idx !== i)})} className="cursor-pointer absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition"><X size={20}/></button>
                        </div>
                      ))}
                      {form.images.length < 3 && (
                        <label className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-red-400 hover:text-red-400 cursor-pointer transition">
                          <Plus size={24}/>
                          <input type="file" multiple hidden onChange={(e) => {
                            const files = Array.from(e.target.files);
                            const newImgs = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
                            setForm(prev => ({ ...prev, images: [...prev.images, ...newImgs].slice(0, 3) }));
                          }}/>
                        </label>
                      )}
                    </div>
                  </div>

                  <button className="cursor-pointer w-full py-5 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 transition shadow-xl shadow-red-100">
                    {loading ? "Chargement..." : editingId ? "Enregistrer les modifications" : "Créer le produit"}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}