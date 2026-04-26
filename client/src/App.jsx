import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Shared/NavBar";
import Footer from "./Components/Shared/Footer";

import ProductsPage from "./Components/Products/Products";   
import ProductDetailsPage from "./Components/Products/ProductDetails";

import Login from "./Pages/Login";
import ProtectedRoute from "./Components/Shared/ProtectedRoute";

import AdminDashboard from "./Components/Admin/AdminDashboard";
import AdminProducts from "./Components/Admin/AdminProducts";

import AdminUsers from "./Components/Admin/AdminUsers";

import NotFound from "./Pages/NotFound";
import ScrollToTop from "./Components/Shared/ScrollToTop";
import Hero from "./Components/Home/Hero";


function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Hero />} />
        <Route path="/products" element={<ProductsPage />} />           
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;