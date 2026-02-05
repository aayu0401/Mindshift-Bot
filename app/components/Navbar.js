"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isApp = pathname.includes('/dashboard') || pathname.includes('/tasks') || pathname.includes('/bot') || pathname.includes('/screening') || pathname.includes('/crisis') || pathname.includes('/vitals') || pathname.includes('/analytics') || pathname.includes('/community') || pathname.includes('/profile');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className={`glass-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">

        {/* Logo Group - Updated with new Image Logo */}
        <Link href="/" className="logo-group">
          <div className="logo-icon-wrapper">
            <Image
              src="/mindshiftr-logo.png"
              alt="MindshiftR Logo"
              width={40}
              height={40}
              className="logo-img"
            />
          </div>
          <span className="logo-text">MindshiftR</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links desktop-only">
          {!isApp ? (
            <>
              <a href="/#features" className="nav-link">Features</a>
              <a href="/#about" className="nav-link">Science</a>
              <Link href="/dashboard" className="btn-nav">Launch App</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}>Dashboard</Link>
              <Link href="/tasks" className={`nav-link ${pathname === '/tasks' ? 'active' : ''}`}>Tools</Link>
              <Link href="/vitals" className={`nav-link ${pathname === '/vitals' ? 'active' : ''}`}>Vitals</Link>
              <Link href="/bot" className={`nav-link ${pathname === '/bot' ? 'active' : ''}`}>AI Companion</Link>
              <Link href="/analytics" className={`nav-link ${pathname === '/analytics' ? 'active' : ''}`}>Analytics</Link>
              <Link href="/profile" className={`nav-link ${pathname === '/profile' ? 'active' : ''}`}>Profile</Link>

              <Link href="/crisis" className="btn-crisis">
                <span>🆘</span> SOS
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <div className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* Mobile Drawer */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-links">
            {!isApp ? (
              <>
                <Link href="/#features" className="mobile-link">Features</Link>
                <Link href="/#about" className="mobile-link">Science</Link>
                <Link href="/dashboard" className="btn-nav mobile-btn">Launch App</Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="mobile-link">Dashboard</Link>
                <Link href="/tasks" className="mobile-link">Toolbox</Link>
                <Link href="/vitals" className="mobile-link">Vitals Hub</Link>
                <Link href="/bot" className="mobile-link">AI Companion</Link>
                <Link href="/analytics" className="mobile-link">Analytics</Link>
                <Link href="/profile" className="mobile-link">Profile</Link>
                <Link href="/crisis" className="btn-crisis mobile-btn">SOS Mode</Link>
              </>
            )}
          </div>
        </div>

      </div>

      <style jsx>{`
        .glass-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 80px;
          transition: all 0.3s ease;
          z-index: 100;
          display: flex; align-items: center;
          border-bottom: 1px solid transparent;
        }
        .glass-nav.scrolled {
          background: rgba(2, 6, 23, 0.85);
          backdrop-filter: blur(16px);
          height: 70px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .nav-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          width: 100%;
          display: flex; justifyContent: space-between; alignItems: center;
          position: relative;
        }

        /* Logo Styling */
        .logo-group {
          display: flex; align-items: center; gap: 0.8rem;
          text-decoration: none;
          flex-shrink: 0;
          z-index: 102;
        }
        .logo-icon-wrapper {
          width: 40px; height: 40px;
          display: flex; align-items: center; justifyContent: center;
          flex-shrink: 0;
          border-radius: 12px;
          overflow: hidden;
          background: rgba(14, 165, 233, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        .logo-group:hover .logo-icon-wrapper {
          border-color: var(--primary);
          box-shadow: 0 0 15px rgba(14, 165, 233, 0.2);
          transform: rotate(-5deg);
        }
        .logo-img {
          object-fit: contain;
          border-radius: 8px;
        }
        .logo-text {
          font-size: 1.5rem; font-weight: 800;
          background: linear-gradient(to right, #ffffff, #cbd5e1);
          -webkit-background-clip: text; color: transparent;
          letter-spacing: -0.03em;
          white-space: nowrap;
        }

        /* Desktop Nav */
        .nav-links { display: flex; gap: 2rem; alignItems: center; }
        .nav-link {
          color: #94a3b8; font-weight: 500; font-size: 0.95rem;
          transition: color 0.2s; position: relative;
          white-space: nowrap;
        }
        .nav-link:hover, .nav-link.active { color: #fff; }
        
        .nav-link.active::after {
          content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
          height: 2px; background: var(--primary); border-radius: 2px;
          box-shadow: 0 0 8px var(--primary);
        }
        
        /* Buttons */
        .btn-nav {
          padding: 0.6rem 1.4rem;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          color: #fff; font-size: 0.9rem; font-weight: 600;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .btn-nav:hover {
          background: #fff; color: #020617; transform: translateY(-1px);
        }

        .btn-crisis {
          background: rgba(239, 68, 68, 0.15); 
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.3);
          padding: 0.5rem 1rem;
          border-radius: 20px; font-weight: 600;
          cursor: pointer; font-size: 0.9rem;
          display: flex; align-items: center; gap: 0.5rem;
          transition: all 0.2s;
          text-decoration: none;
          white-space: nowrap;
        }
        .btn-crisis:hover {
          background: #ef4444; color: white;
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
        }

        /* Mobile Styles */
        .mobile-toggle {
            display: none;
            background: none; border: none; cursor: pointer;
            z-index: 102; padding: 0.5rem;
        }
        .hamburger span {
            display: block; width: 24px; height: 2px;
            background: #fff; margin: 5px 0;
            transition: all 0.3s;
        }
        .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

        .mobile-menu {
            position: fixed; inset: 0;
            background: rgba(2, 6, 23, 0.98);
            backdrop-filter: blur(20px);
            z-index: 101;
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            opacity: 0; pointer-events: none;
            transition: opacity 0.3s;
        }
        .mobile-menu.open { opacity: 1; pointer-events: all; }

        .mobile-links {
            display: flex; flex-direction: column; gap: 2rem; text-align: center;
            align-items: center;
        }
        .mobile-link {
            font-size: 1.5rem; font-weight: 700; color: #94a3b8;
        }
        .mobile-link:hover { color: #fff; }
        .mobile-btn {
            margin-top: 1rem; padding: 1rem 3rem; font-size: 1.1rem;
        }

        /* Responsive Breakpoints */
        @media (max-width: 900px) {
            .desktop-only { display: none; }
            .mobile-toggle { display: block; }
        }
      `}</style>
    </nav>
  );
}
