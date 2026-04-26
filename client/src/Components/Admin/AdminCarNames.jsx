import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { Plus, Trash2, Car, Loader2, Search, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminCarNames() {
  const [names, setNames] = useState([]);
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchNames();
  }, []);

  const fetchNames = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/car-names`);
      setNames(res.data);
    } catch (err) {
      toast.error("Erreur lors du chargement");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    try {
      setIsSubmitting(true);
      await axios.post(`${API_BASE_URL}/car-names`, { name: newName.trim() });
      setNewName("");
      fetchNames();
      toast.success("Marque ajoutée");
    } catch (err) {
      toast.error("Erreur ou doublon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette marque ?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/car-names/${id}`);
      setNames(names.filter((n) => n._id !== id));
      toast.success("Marque supprimée");
    } catch (err) {
      toast.error("Erreur de suppression");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
              <Tag size={14} /> Configuration
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Marques <span className="text-red-600">Auto</span>
            </h1>
          </div>

          {/* Quick Add Form */}
          <form onSubmit={handleAdd} className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              className="flex-1 md:w-64 p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 ring-red-500 outline-none transition-all shadow-sm"
              placeholder="Nouvelle marque..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting || !newName.trim()}
              className="cursor-pointer bg-red-600 text-white p-4 rounded-2xl hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-100 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus size={24} />}
            </button>
          </form>
        </div>

        {/* Grid List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-10 h-10 text-red-600" />
          </div>
        ) : names.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {names.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -5 }}
                  className="group relative bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-red-50 transition-colors">
                      <Car size={18} className="text-gray-400 group-hover:text-red-600" />
                    </div>
                    <span className="font-bold text-gray-800 tracking-tight">
                      {item.name}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="cursor-pointer opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">Aucune marque enregistrée.</p>
          </div>
        )}

      </div>
    </div>
  );
}