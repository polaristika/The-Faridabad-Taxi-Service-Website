import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteConfig } from '../types';

interface FooterProps {
  config: SiteConfig;
}

const Footer: React.FC<FooterProps> = ({ config }) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {!logoError ? (
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="h-12 w-auto brightness-0 invert" 
                  onError={() => setLogoError(true)}
                />
              ) : (
                <i className="fas fa-taxi text-yellow-400 text-2xl"></i>
              )}
              <h3 className="text-white font-bold text-xl uppercase tracking-tighter">The Faridabad Taxi</h3>
            </div>
            <p className="text-sm leading-relaxed">
              Premium cab services in Faridabad for local rides, airport transfers, and outstation trips. Available 24/7 with a fleet of sanitized and well-maintained vehicles.
            </p>
            <div className="flex gap-4 pt-2">
              {config.socialLinks.map((link) => (
                <a 
                  key={link.id} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                >
                  <i className={`fab fa-${link.platform.toLowerCase()}`}></i>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="/gallery" className="hover:text-blue-400 transition-colors">Gallery</Link></li>
              <li><a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a></li>
              <li><Link to="/login" className="hover:text-blue-400 transition-colors font-semibold">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Services</h4>
            <ul className="space-y-3 text-sm">
              <li>Local City Rides</li>
              <li>Outstation One-Way</li>
              <li>Round Trip Packages</li>
              <li>Airport Drop & Pick</li>
              <li>Corporate Monthly Rental</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <i className="fas fa-map-marker-alt text-blue-500 mt-1"></i>
                <span>{config.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-phone text-blue-500"></i>
                <div className="flex flex-col gap-1">
                  <a href={`tel:${config.phones[0]}`} className="hover:text-blue-400">{config.phones[0]}</a>
                  {config.secondaryPhone && (
                    <a href={`tel:${config.secondaryPhone}`} className="hover:text-blue-400">{config.secondaryPhone}</a>
                  )}
                </div>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-envelope text-blue-500"></i>
                <a href={`mailto:${config.emails[0]}`} className="hover:text-blue-400">{config.emails[0]}</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 text-center text-xs">
          <p>© {new Date().getFullYear()} The Faridabad Taxi Service. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;