'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export const NavBar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Return active class if current path matches
  const getNavClass = (path: string) => {
    return pathname === path
      ? 'font-sans font-bold text-vc-white border-b-2 border-vc-white pb-1'
      : 'font-sans font-normal text-[#CCCCCC] hover:text-vc-white transition-colors';
  };

  const getMobileNavClass = (path: string) => {
    return pathname === path
      ? 'block px-4 py-3 bg-vc-gray-dark text-vc-white font-sans font-bold rounded-lg'
      : 'block px-4 py-3 text-[#CCCCCC] font-sans font-normal hover:bg-vc-gray-dark rounded-lg transition-colors';
  };

  const getInitial = (name?: string) => (name ? name.charAt(0).toUpperCase() : '?');

  return (
    <header className="bg-vc-black h-[72px] shadow-sm sticky top-0 w-full z-50">
      <div className="flex justify-between items-center w-full px-md h-full max-w-container-max mx-auto">
        <div className="flex items-center gap-2">
          {/* Hamburger button (Mobile only) */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-vc-white hover:bg-vc-gray-dark rounded-full transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          <Link href="/" className="font-serif font-bold text-vc-white flex items-center gap-2 text-[24px] md:text-[28px]">
            <span className="material-symbols-outlined text-[28px] hidden sm:block">tsunami</span>
            Vacomercio
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-gutter items-center">
          <Link href="/marketplace" className={getNavClass('/marketplace')}>
            Marketplace
          </Link>
          <Link href="/mis-lotes" className={getNavClass('/mis-lotes')}>
            Mis Lotes
          </Link>
        </nav>
        
        <div className="flex gap-md text-vc-white items-center relative">
          <span className="material-symbols-outlined cursor-pointer hover:bg-vc-gray-dark p-2 rounded-full transition-colors hidden lg:block">location_on</span>
          
          {user === null ? (
            <Link 
              href="/login" 
              className="bg-vc-white border border-vc-black text-vc-black font-bold font-sans rounded-lg px-6 py-2 whitespace-nowrap hover:bg-vc-gray-light transition-colors"
            >
              Iniciar Sesión
            </Link>
          ) : user ? (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none hover:bg-vc-gray-dark p-1 pr-1 sm:pr-2 rounded-full transition-colors border border-transparent"
              >
                <div className="w-8 h-8 rounded-full bg-vc-gray-mid border border-vc-gray-light text-vc-white font-sans font-bold flex items-center justify-center">
                  {getInitial(user.email)}
                </div>
                <span className="font-label-bold text-on-surface hidden md:block">
                  {user.email?.split('@')[0]}
                </span>
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant hidden sm:block">
                  arrow_drop_down
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-outline-variant shadow-lg rounded-xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-vc-gray-light mb-2 bg-vc-gray-light">
                    <p className="font-sans font-bold text-vc-black truncate">{user.email}</p>
                    <p className="font-sans text-vc-gray-dark text-xs mt-1">Rol: {user.rol}</p>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                      window.location.href = '/';
                    }}
                    className="w-full text-left px-4 py-2 font-sans font-bold text-vc-black hover:bg-vc-gray-light transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-surface-dim animate-pulse"></div> // Loading state
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-vc-gray-dark bg-vc-black absolute w-full shadow-md z-40 pb-4 px-2">
          <nav className="flex flex-col gap-1 mt-2">
            <Link href="/marketplace" onClick={() => setMobileMenuOpen(false)} className={getMobileNavClass('/marketplace')}>
              Marketplace
            </Link>
            <Link href="/mis-lotes" onClick={() => setMobileMenuOpen(false)} className={getMobileNavClass('/mis-lotes')}>
              Mis Lotes
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
