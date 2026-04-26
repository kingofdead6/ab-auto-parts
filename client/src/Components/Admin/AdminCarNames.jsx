import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { Plus, Trash2, Car } from "lucide-react";

export default function AdminCarNames() {
  const [names, setNames] = useState([]);
  const [newName, setNewName] = useState("");

  useEffect(() => { fetchNames(); }, []);

  const fetchNames = async () => {
    const res = await axios.get(`${API_BASE_URL}/car-names`);
    setNames(res.data);
  };

  const handleAdd = async () => {
    if (!newName) return;
    try {
      await axios.post(`${API_BASE_URL}/car-names`, { name: newName });
      setNewName("");
      fetchNames();
      toast.success("Marque ajoutée");
    } catch { toast.error("Erreur ou doublon"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette marque ?")) return;
    await axios.delete(`${API_BASE_URL}/car-names/${id}`);
    fetchNames();
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white min-h-screen">
      <h1 className="text-3xl font-light mb-8 flex items-center gap-3">
        <Car className="text-red-600" /> Marques de Véhicules
      </h1>
      <div className="flex gap-4 mb-8">
        <input 
          className="flex-1 p-4 border rounded-2xl focus:ring-2 ring-red-500 outline-none"
          placeholder="Ex: BMW, Audi, Toyota..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={handleAdd} className="bg-red-600 text-white px-8 rounded-2xl hover:bg-red-700 transition shadow-lg">
          Ajouter
        </button>
      </div>
      <div className="space-y-3">
        {names.map(item => (
          <div key={item._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
            <span className="font-medium text-gray-800">{item.name}</span>
            <button onClick={() => handleDelete(item._id)} className="text-gray-400 hover:text-red-600 transition">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}