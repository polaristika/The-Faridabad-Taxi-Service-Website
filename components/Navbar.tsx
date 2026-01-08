import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SiteConfig } from '../types';

interface NavbarProps {
  config: SiteConfig;
}

const Navbar: React.FC<NavbarProps> = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    setIsOpen(false);
    if (path.startsWith('/#')) {
      const id = path.split('#')[1];
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(id);
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Pricing', path: '/#pricing' },
    { name: 'Services', path: '/#services' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-md z-[1000] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3">
            {!logoError ? (
              <img 
                src="/logo.png" 
                alt="The Faridabad Taxi Service" 
                className="h-14 w-auto object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="bg-slate-900 p-2 rounded-lg text-yellow-400">
                <i className="fas fa-taxi text-xl"></i>
              </div>
            )}
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold leading-none text-slate-900 uppercase tracking-wider">The Faridabad</h1>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.2em]">Taxi Service</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.path)}
                className={`text-sm font-medium transition-colors ${
                  (location.pathname === link.path || (link.path.includes('#') && location.hash === link.path.split('/')[1])) 
                  ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                {link.name}
              </button>
            ))}
            <a
              href={`tel:${config.phones[0]}`}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <i className="fas fa-phone"></i> Book Now
            </a>
          </div>

          <button 
            className="md:hidden text-slate-600 p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-4 shadow-xl">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.path)}
              className="block w-full text-left text-slate-600 font-medium py-3 px-4 hover:bg-slate-50 rounded-lg"
            >
              {link.name}
            </button>
          ))}
          <a
            href={`tel:${config.phones[0]}`}
            className="block w-full text-center bg-blue-600 text-white py-4 rounded-xl font-bold"
          >
            Call: {config.phones[0]}
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;