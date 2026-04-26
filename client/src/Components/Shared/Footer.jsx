"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ChevronRight, Facebook } from "lucide-react";
import Logo from "../../assets/Logo.png";

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-white pt-24 pb-12 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          
          {/* 1. BRAND SECTION (Span 4) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-4">
              {/* LOGO PLACE */}
              <img
                src={Logo}
                alt="ab auto parts"
                className="h-30 w-auto object-contain"
              />

            
            </div>
            <p className="text-stone-400 text-sm leading-relaxed max-w-sm font-medium">
              Spécialiste en fabrication, installation et maintenance de solutions 
              de sécurité physique. L'excellence au service de votre protection 
              depuis plus de deux décennies.
            </p>
            <div className="flex gap-4">
               {/* Decorative accent bar */}
               <div className="w-12 h-[2px] bg-red-600 mt-2"></div>
            </div>
          </div>

          {/* 2. CONTACTS SECTION (Span 3) */}
          <div className="lg:col-span-3 space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-red-600">
              Contactez-nous
            </h3>
            <div className="space-y-6">
  {/* FACEBOOK CONTACT */}
  <a 
    href="https://web.facebook.com/groups/260342790061805/" 
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-start gap-4 transition-colors"
  >
    <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center group-hover:bg-red-600 transition-colors shrink-0">
      <Facebook size={18} className="text-stone-400 group-hover:text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1">Facebook</p>
      <p className="text-sm font-bold text-stone-200 truncate max-w-[200px] lg:max-w-full">
        ab auto parts Group
      </p>
    </div>
  </a>

  {/* PHONE CONTACT */}
  <a 
    href="tel:0556837510" 
    className="group flex items-start gap-4 transition-colors"
  >
    <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center group-hover:bg-red-600 transition-colors shrink-0">
      <Phone size={18} className="text-stone-400 group-hover:text-white" />
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1">Téléphone</p>
      <p className="text-sm font-bold text-stone-200 tracking-tight">0556 83 75 10</p>
    </div>
  </a>
</div>
          </div>

          {/* 3. MAP SECTION (Span 5) */}
          <div className="lg:col-span-5 space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-red-600">
              Notre Emplacement
            </h3>
            <div className="relative w-full h-48 rounded-[2rem] overflow-hidden border border-white/5 grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3634.5734302560927!2d3.0054672!3d36.6482326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fa970f9e1ff41%3A0x73e05e65a366ae9e!2sAb%20auto%20parts%20raouf!5e1!3m2!1sen!2sdz!4v1777223879544!5m2!1sen!2sdz"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="flex items-center gap-3 text-stone-500">
                <MapPin size={14} className="text-red-600"/>
                <p className="text-[10px] font-black uppercase tracking-widest">Alger, Algérie</p>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-600">
            © {new Date().getFullYear()} ab auto parts — ALL RIGHTS RESERVED
          </p>

          <div className="flex items-center gap-8">
            <a
              href="https://softwebelevation.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-600 group-hover:text-white transition-colors">
                Crafted by <span className="text-stone-400 group-hover:text-red-600 transition-colors">SoftWebElevation</span>
              </span>
              <ChevronRight size={14} className="text-stone-700 group-hover:text-red-600 transition-all" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}