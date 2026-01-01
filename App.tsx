import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { SiteConfig } from './types';

// ==========================================
// 1. PASTE YOUR SUPABASE KEYS HERE
// ==========================================
const CLOUD_CONFIG = {
  url: "https://jcaieopwycitxqcmiamm.supabase.co",
  key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjYWllb3B3eWNpdHhxY21pYW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyODIxMzcsImV4cCI6MjA4Mjg1ODEzN30.H7lOV9_GIAXN4Wpei9tim0ER09VEzP7rG-bhYIbSm8E"
};

const INITIAL_CONFIG: SiteConfig = {
  hero: {
    title: "Premium Taxi Service In Faridabad",
    subtitle: "Whether it's a quick local drop, a late-night airport run, or a scenic outstation trip, we've got the perfect ride waiting for you. Safe, reliable, and professional.",
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=2070"
  },
  stats: [
    { id: '1', value: '5000+', label: 'Happy Clients' },
    { id: '2', value: '10+', label: 'Years Exp' },
    { id: '3', value: '24/7', label: 'Availability' },
    { id: '4', value: '15+', label: 'Active Fleet' }
  ],
  phones: ['+91 9999711219'],
  emails: ['Rajnijeetunagar1986@gmail.com'],
  address: 'Near NIT, Faridabad, Haryana – 121001',
  vehicles: [
    { id: '1', name: 'Dzire', icon: 'fa-car', base: 1300, km: 12, hour: 150, fullDay: 3000, capacity: 4 },
    { id: '2', name: 'Ertiga', icon: 'fa-car-side', base: 1600, km: 15, hour: 150, fullDay: 4000, capacity: 6 },
    { id: '3', name: 'Innova', icon: 'fa-shuttle-van', base: 1800, km: 18, hour: 200, fullDay: 4500, capacity: 7 },
    { id: '4', name: 'Innova Crysta', icon: 'fa-van-shuttle', base: 2500, km: 22, hour: 300, fullDay: 5500, capacity: 7 }
  ],
  gallery: [
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1594051808233-e19ecf20cc9c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1605281317010-fe5ffe798156?auto=format&fit=crop&q=80&w=800'
  ],
  socialLinks: [
    { id: 's1', platform: 'Facebook', url: 'https://facebook.com' },
    { id: 's2', platform: 'Instagram', url: 'https://instagram.com' }
  ],
  serviceAreas: ['NIT Faridabad', 'Sector 15', 'Sector 16', 'Ballabgarh', 'Greater Faridabad', 'Green Field', 'Sainik Colony', 'Surajkund'],
  reviews: [
    { id: 'r1', name: 'Anil Kumar', rating: 5, comment: 'Excellent service! The car was clean and the driver was very professional.', date: '2023-10-15' },
    { id: 'r2', name: 'Priya Sharma', rating: 4, comment: 'Reliable and punctual for my airport drop. Highly recommended.', date: '2023-11-02' }
  ],
  faqs: [
    { id: 'f1', question: 'Do you offer 24/7 service?', answer: 'Yes, we operate 24 hours a day, 7 days a week for all your travel needs.' },
    { id: 'f2', question: 'How can I pay for my ride?', answer: 'We accept Cash, UPI (GPay, PhonePe), and Net Banking.' },
    { id: 'f3', question: 'Are there any hidden charges?', answer: 'No, our pricing is transparent. Toll and parking are extra as per actuals.' }
  ]
};

const App: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig>(INITIAL_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('admin_session') === 'true';
  });

  useEffect(() => {
    const fetchCloudConfig = async () => {
      const saved = localStorage.getItem('taxi_config');
      const localCloudSettings = localStorage.getItem('cloud_settings');
      
      let currentConfig = { ...INITIAL_CONFIG };

      // 1. Load from localStorage first (for speed)
      if (saved) {
        currentConfig = { ...currentConfig, ...JSON.parse(saved) };
      }

      // 2. Decide which keys to use (hardcoded CLOUD_CONFIG is preferred for cross-device)
      const url = CLOUD_CONFIG.url || (localCloudSettings ? JSON.parse(localCloudSettings).url : null);
      const key = CLOUD_CONFIG.key || (localCloudSettings ? JSON.parse(localCloudSettings).key : null);

      // 3. Sync from Supabase
      if (url && key) {
        try {
          const res = await fetch(`${url}/rest/v1/site_config?select=data&id=eq.1`, {
            headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
          });
          const data = await res.json();
          if (data && data[0]) {
            currentConfig = { ...currentConfig, ...data[0].data };
            localStorage.setItem('taxi_config', JSON.stringify(currentConfig));
          }
        } catch (e) {
          console.error("Cloud sync failed, using local fallback", e);
        }
      }

      setConfig(currentConfig);
      setIsLoading(false);
    };

    fetchCloudConfig();
  }, []);

  const handleUpdateConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
    localStorage.setItem('taxi_config', JSON.stringify(newConfig));
  };

  const handleLogin = (status: boolean) => {
    setIsAdmin(status);
    if (status) localStorage.setItem('admin_session', 'true');
    else localStorage.removeItem('admin_session');
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Checking for updates...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar config={config} />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home config={config} />} />
            <Route path="/gallery" element={<Gallery config={config} />} />
            <Route 
              path="/login" 
              element={isAdmin ? <Navigate to="/admin" /> : <Login onLogin={() => handleLogin(true)} />} 
            />
            <Route 
              path="/admin" 
              element={isAdmin ? <Admin config={config} onUpdate={handleUpdateConfig} onLogout={() => handleLogin(false)} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
        <Footer config={config} />
        
        <a 
          href={`https://wa.me/${config.phones[0].replace(/\D/g, '')}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform z-50 animate-bounce"
        >
          <i className="fab fa-whatsapp text-2xl"></i>
        </a>
      </div>
    </HashRouter>
  );
};

export default App;