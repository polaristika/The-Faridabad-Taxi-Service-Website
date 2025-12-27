
import React, { useEffect } from 'react';
import { SiteConfig } from '../types';

interface GalleryProps {
  config: SiteConfig;
}

const Gallery: React.FC<GalleryProps> = ({ config }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-white min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Our Fleet</h2>
        <h3 className="text-4xl font-black text-slate-900 mb-6">Fleet Gallery</h3>
        <p className="max-w-2xl mx-auto text-slate-500">
          Clean, sanitized, and well-maintained vehicles for a comfortable ride. Take a look at our fleet ready to serve you.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {config.gallery.map((img, index) => (
            <div key={index} className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-slate-100 border border-slate-100 shadow-sm">
              <img 
                src={img} 
                alt={`Vehicle ${index + 1}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <p className="text-white font-bold">Premium Taxi {index + 1}</p>
              </div>
            </div>
          ))}
          {config.gallery.length === 0 && (
            <div className="col-span-full py-24 text-center text-slate-400 font-medium italic">
              No photos in gallery yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
