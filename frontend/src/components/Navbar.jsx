/**
 * Navbar Component
 * Enhanced with scroll-aware backdrop blur, mobile hamburger menu, and animated active route indicator
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const navLinks = [
    { to: '/craft-library', label: '技艺库' },
    { to: '/creative-workshop', label: '创意工坊' },
    { to: '/my-practice', label: '我的修习' },
    { to: '/knowledge-curator', label: '知识馆长' },
  ];

  // Backdrop blur classes based on scroll
  const backdropClasses = isScrolled
    ? 'backdrop-blur-md bg-rice-paper/90'
    : 'backdrop-blur-sm bg-rice-paper/80';

  return (
    <>
      <nav
        className={`fixed w-full z-50 px-8 py-6 flex justify-between items-center border-b border-ink-black/5 transition-all duration-300 ${backdropClasses}`}
      >
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-4 group">
          <div className="w-10 h-10 border-2 border-ink-black rounded-full flex items-center justify-center font-calligraphy text-xl bg-ink-black text-rice-paper group-hover:bg-vermilion group-hover:border-vermilion transition-colors">
            承
          </div>
          <div className="flex flex-col">
            <span className="font-xiaowei text-lg tracking-widest text-ink-black">
              数字传承人
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-charcoal/60 font-sans">
              The Digital Inheritor
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-12 font-xiaowei text-ink-black/80 relative">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative py-1 hover:text-vermilion transition-colors ${
                isActive(link.to) ? 'text-vermilion' : ''
              }`}
            >
              {link.label}
              {/* Animated underline for active route */}
              {isActive(link.to) && (
                <motion.div
                  layoutId="navbar-active-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-vermilion"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold">李明</div>
            <div className="text-xs text-charcoal/60">初级学徒</div>
          </div>
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            alt="User"
            className="w-10 h-10 rounded-full border border-ink-black/20"
          />

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 ml-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
          >
            <motion.span
              className="w-6 h-0.5 bg-ink-black origin-center"
              animate={{
                rotate: isMobileMenuOpen ? 45 : 0,
                y: isMobileMenuOpen ? 8 : 0,
              }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="w-6 h-0.5 bg-ink-black"
              animate={{
                opacity: isMobileMenuOpen ? 0 : 1,
              }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="w-6 h-0.5 bg-ink-black origin-center"
              animate={{
                rotate: isMobileMenuOpen ? -45 : 0,
                y: isMobileMenuOpen ? -8 : 0,
              }}
              transition={{ duration: 0.2 }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-ink-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Drawer */}
            <motion.div
              className="fixed top-0 right-0 h-full w-64 bg-rice-paper z-50 md:hidden shadow-lg"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col pt-24 px-6 gap-6 font-xiaowei text-lg">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`py-2 hover:text-vermilion transition-colors ${
                      isActive(link.to) ? 'text-vermilion' : 'text-ink-black'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
